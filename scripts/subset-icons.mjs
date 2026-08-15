// The Material Symbols icon font is self-hosted and subset to just the icons the
// site uses (src/assets/material-symbols-subset.woff2, ~1.1MB -> ~100KB). The
// trade-off: an icon name that is NOT in the subset renders as its literal
// ligature text, so a fresh <span className="material-symbols-outlined">circle</span>
// silently prints the word "circle" on the page. That has shipped twice already
// (24a2eef, ac3a9ba) because the regeneration step lived only in commit messages.
//
// This script is that step. It scans the source for icon names, then rebuilds the
// woff2 from the current upstream font with exactly those ligatures.
//
// Usage:
//   node scripts/subset-icons.mjs            regenerate the subset (needs network)
//   node scripts/subset-icons.mjs --check    offline: fail if the committed subset
//                                            is missing a name the source uses
//   node scripts/subset-icons.mjs --list     print the names the scan found
//   --include-dist   also read icon names out of dist/client prerendered HTML
//                    (ground truth for data-driven icons; run after a full build)
//   --source=<file>  subset from a local .ttf/.woff2 instead of downloading
//   --refresh        ignore the cached upstream font and re-download
//   --out=<file>     write somewhere other than the committed subset
//
// Requires python3 with fontTools + brotli for anything that touches the font:
//   python3 -m pip install 'fonttools[woff]'
// --check degrades to a skip (exit 0) when they are missing, so CI without python
// still builds; the check is there to fail on the developer's machine, pre-push.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, copyFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';

const OUT_DEFAULT = 'src/assets/material-symbols-subset.woff2';
const EXTRA_FILE = 'scripts/icons.extra.txt';
const CACHE_DIR = 'node_modules/.cache/material-symbols';
const ICON_CLASS = 'material-symbols-outlined';
// Full variable font: every axis, so font-variation-settings in index.css keeps working.
const GOOGLE_CSS =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const args = process.argv.slice(2);
const flag = (name) => args.includes('--' + name);
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
if (flag('help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).join('\n')); process.exit(0); }

const OUT = opt('out') ?? OUT_DEFAULT;
const CHECK = flag('check');
const LIST = flag('list');

/* ── 1. Find the icon names the site asks for ─────────────────────────────── */

function walk(dir, test) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p, test);
    return test(e.name) ? [p] : [];
  });
}

// The whole opening tag, so we can tell `<span className="… icon-class …">name</span>`
// apart from the class merely being mentioned. Braces and quotes are tracked because
// className is often a template literal with a nested ternary, and parsing has to
// start at the `<`, not at the class, or the quote parity is inverted (we would be
// starting inside the className string and read its closing quote as an opening one).
function childOfTagAt(text, classIndex) {
  const tagStart = text.lastIndexOf('<', classIndex);
  if (tagStart === -1) return null;
  let depth = 0, quote = null;
  for (let i = tagStart; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === quote && text[i - 1] !== '\\') quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) {
      if (text[i - 1] === '/') return null; // self-closing: no ligature child
      const end = text.indexOf('<', i + 1);
      return end === -1 ? null : text.slice(i + 1, end);
    }
  }
  return null;
}

const NAME_RE = /^[a-z0-9_]+$/;
// Real names are lowercase, but a literal child of an icon span is *meant* to be a
// name, so a mixed-case one (`shieId_lock`) is a typo worth failing on, not text.
const LITERAL_RE = /^[A-Za-z0-9_]+$/;
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// Literal children (definite icons) and, separately, everything a keyed `icon:` field
// or a ternary inside the span could resolve to.
function scanSource(files) {
  const literal = new Map();   // name -> "file:line" of first sight
  const indirect = new Map();  // name -> where          (validated, then kept if real)
  const unresolved = [];       // spans whose icon we could not read at all
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(new RegExp(ICON_CLASS, 'g'))) {
      const child = childOfTagAt(text, m.index);
      const where = `${file}:${lineOf(text, m.index)}`;
      if (child === null) continue;
      const plain = child.trim();
      if (LITERAL_RE.test(plain)) { if (!literal.has(plain)) literal.set(plain, where); continue; }
      // Dynamic child: pick up any string literal in it (`{done ? 'check' : 'close'}`).
      const quoted = [...plain.matchAll(/['"`]([a-z0-9_]+)['"`]/g)].map((q) => q[1]);
      if (quoted.length) { for (const n of quoted) if (!literal.has(n)) literal.set(n, where); continue; }
      if (plain.includes('{')) unresolved.push(where); // e.g. {icon} from a data table
    }
    // Data-driven icons: `icon: 'radar'`, `icon="radar"`, iconName/symbol/glyph too.
    for (const m of text.matchAll(/\b(?:icon|iconName|symbol|glyph)s?\s*[:=]\s*['"`]([a-z0-9_]+)['"`]/g)) {
      if (!indirect.has(m[1])) indirect.set(m[1], `${file}:${lineOf(text, m.index)}`);
    }
  }
  return { literal, indirect, unresolved };
}

// Prerendered HTML is ground truth (vike prerenders every page), but it is a build
// artefact and can be stale, so it is opt-in via --include-dist.
function scanPrerendered() {
  const found = new Map();
  for (const file of walk('dist/client', (n) => n.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(new RegExp(`class="[^"]*\\b${ICON_CLASS}\\b[^"]*"[^>]*>([^<]*)<`, 'g'))) {
      const name = m[1].trim();
      if (NAME_RE.test(name) && !found.has(name)) found.set(name, file);
    }
  }
  return found;
}

function readExtras() {
  if (!existsSync(EXTRA_FILE)) return new Map();
  const entries = readFileSync(EXTRA_FILE, 'utf8')
    .split('\n').map((l) => l.replace(/#.*/, '').trim()).filter((l) => NAME_RE.test(l));
  return new Map(entries.map((n) => [n, EXTRA_FILE]));
}

const sourceFiles = [
  ...walk('src', (n) => /\.(tsx?|jsx?|css|html)$/.test(n)),
  ...walk('pages', (n) => /\.(tsx?|jsx?|html)$/.test(n)),
  ...(existsSync('index.html') ? ['index.html'] : []),
];
const { literal, indirect, unresolved } = scanSource(sourceFiles);
const extras = readExtras();
const prerendered = flag('include-dist') ? scanPrerendered() : new Map();

/* ── 2. Font side: everything below shells out to fontTools ───────────────── */

// Decodes the GSUB ligature table: component glyphs -> the icon name that forms them.
// This is what actually makes `<span>radar</span>` draw a radar, so it is both the
// input to subsetting and the way we verify the result.
const LIGATURES_PY = `
import json, sys
from fontTools.ttLib import TTFont

font = TTFont(sys.argv[1], lazy=True)
# A glyph can be reached from several codepoints ('a' and 'A' share one in this
# font); ligature components are spelled in the lowercase/digit/underscore range.
preferred = {}
for cp, gname in font.getBestCmap().items():
    ch = chr(cp)
    good = ch.islower() or ch.isdigit() or ch == '_'
    prev = preferred.get(gname)
    if prev is None or (good and not (prev.islower() or prev.isdigit() or prev == '_')):
        preferred[gname] = ch

out = {}
if 'GSUB' in font:
    for lookup in font['GSUB'].table.LookupList.Lookup:
        for sub in lookup.SubTable:
            inner = getattr(sub, 'ExtSubTable', sub)  # lookups are wrapped in type 7
            if type(inner).__name__ != 'LigatureSubst':
                continue
            for first, ligs in inner.ligatures.items():
                for lig in ligs:
                    name = ''.join(preferred.get(g, '?') for g in [first] + list(lig.Component))
                    if '?' not in name:
                        out[name] = lig.LigGlyph
json.dump(out, sys.stdout)
`;

function pythonReady() {
  const r = spawnSync('python3', ['-c', 'import fontTools, brotli'], { encoding: 'utf8' });
  return r.status === 0;
}

function ligatures(fontPath) {
  const r = spawnSync('python3', ['-c', LIGATURES_PY, fontPath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) die(`could not read ligatures from ${fontPath}\n${r.stderr}`);
  return JSON.parse(r.stdout);
}

function die(msg) { console.error('subset-icons: ' + msg); process.exit(1); }
const kb = (p) => (statSync(p).size / 1024).toFixed(1) + 'KB';

async function upstreamFont() {
  const local = opt('source');
  if (local) { if (!existsSync(local)) die(`--source font not found: ${local}`); return local; }
  let css;
  try {
    css = await fetch(GOOGLE_CSS, { headers: { 'User-Agent': UA } }).then((r) => r.text());
  } catch (e) {
    die(`could not reach fonts.googleapis.com (${e.message}).\n` +
        '  Offline? Download the variable font and pass --source=<path>:\n' +
        '  https://github.com/google/material-design-icons/tree/master/variablefont');
  }
  const url = css.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) die('no woff2 URL in the Google Fonts CSS response (API shape changed?)');
  const cached = join(CACHE_DIR, url.split('/').pop());
  if (existsSync(cached) && !flag('refresh')) return cached;
  mkdirSync(CACHE_DIR, { recursive: true });
  const bytes = Buffer.from(await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()));
  writeFileSync(cached, bytes);
  console.log(`subset-icons: downloaded upstream font -> ${cached} (${kb(cached)})`);
  return cached;
}

// fontTools writes to the system temp dir, not next to the output: on macOS a
// python3 outside the app sandbox is refused write access to ~/Desktop and friends
// (EPERM), while node is allowed, so node does the move at the end.
function subset(fontPath, names, ligMap) {
  const glyphs = [...new Set(names.map((n) => ligMap[n]))];
  const chars = [...new Set(names.join(''))].join('');
  const tmp = join(tmpdir(), `subset-icons-${process.pid}.woff2`);
  const r = spawnSync('python3', ['-m', 'fontTools.subset', fontPath,
    `--output-file=${tmp}`,
    '--flavor=woff2',
    // Keep the letters (so text can be shaped into a ligature) and the icon glyphs.
    `--text=${chars}`,
    `--glyphs=${glyphs.join(',')}`,
    '--layout-features+=rlig,rclt,liga,dlig,ccmp',
    // Without this, keeping the letters would drag in every icon spelled from them.
    '--no-layout-closure',
  ], { encoding: 'utf8' });
  if (r.status !== 0) { rmSync(tmp, { force: true }); die(`fontTools.subset failed\n${r.stderr}`); }
  return tmp;
}

/* ── 3. Drive it ──────────────────────────────────────────────────────────── */

const wanted = new Map([...indirect, ...prerendered, ...extras, ...literal]); // literal last: best provenance
const names = [...wanted.keys()].sort();

// Spans like `<span …>{item.icon}</span>` are resolved from `icon: '…'` fields rather
// than by following the value, so say so, and say how to settle it for certain.
const runtimeSpanAdvice = () => (flag('include-dist')
  ? `cross-checked against the ${prerendered.size} name(s) in the prerendered HTML.`
  : `re-run with --include-dist after a build to confirm them, or list a name in ${EXTRA_FILE}. First: ${unresolved[0]}`);

if (LIST) {
  for (const n of names) console.log(`${n}\t${wanted.get(n)}`);
  console.log(`subset-icons: ${names.length} candidate name(s) from ${sourceFiles.length} source file(s)`);
  process.exit(0);
}

if (!pythonReady()) {
  const msg = 'python3 with fontTools + brotli not available (python3 -m pip install \'fonttools[woff]\')';
  if (CHECK) { console.log(`subset-icons: skipped, ${msg}`); process.exit(0); }
  die(msg);
}

if (CHECK) {
  // Offline check: is every name the source uses actually in the committed subset?
  if (!existsSync(OUT)) die(`${OUT} is missing; run: npm run icons`);
  const have = new Set(Object.keys(ligatures(OUT)));
  const missing = names.filter((n) => !have.has(n));
  if (missing.length) {
    console.error(`subset-icons: ${missing.length} icon name(s) used in the source are NOT in ${OUT}.`);
    console.error('These render as their literal text (e.g. the word "radar") in the browser:');
    for (const n of missing) console.error(`  ${n}\t${wanted.get(n)}${literal.has(n) ? '' : '  (read from an icon-ish field, not an icon span)'}`);
    console.error('Fix: npm run icons   (then commit the regenerated woff2)');
    process.exit(1);
  }
  const unused = [...have].filter((n) => !wanted.has(n));
  if (unused.length) console.log(`subset-icons: note, ${unused.length} name(s) in the subset are no longer referenced (harmless; regenerate to shrink)`);
  if (unresolved.length) console.log(`subset-icons: note, ${unresolved.length} icon span(s) take a runtime value; ${runtimeSpanAdvice()}`);
  console.log(`subset-icons: OK, all ${names.length} icon name(s) present in ${OUT} (${kb(OUT)}).`);
  process.exit(0);
}

const font = await upstreamFont();
const full = ligatures(font);
console.log(`subset-icons: upstream font has ${Object.keys(full).length} icon ligatures (${kb(font)})`);

// A name that is not a real Material Symbols ligature can never render. Typos in a
// literal <span> are the bug this script exists to prevent, so they are fatal.
const bogus = names.filter((n) => !(n in full) && literal.has(n));
if (bogus.length) {
  console.error('subset-icons: these are written as icon names in the source but do not exist upstream:');
  for (const n of bogus) console.error(`  ${n}\t${wanted.get(n)}`);
  die('fix the name (or the span): it would render as text. Browse names at https://fonts.google.com/icons');
}
const dropped = names.filter((n) => !(n in full));
if (dropped.length) {
  console.log(`subset-icons: ignoring ${dropped.length} string(s) that are not Material Symbols names:`);
  for (const n of dropped) console.log(`  ${n}\t${wanted.get(n)}`);
}

const keep = names.filter((n) => n in full);
const before = existsSync(OUT) ? Object.keys(ligatures(OUT)) : [];
const beforeSize = existsSync(OUT) ? kb(OUT) : 'n/a';

const tmp = subset(font, keep, full);
const after = Object.keys(ligatures(tmp));
const stillMissing = keep.filter((n) => !after.includes(n));
if (stillMissing.length) { rmSync(tmp, { force: true }); die(`subset dropped ligatures it was asked to keep: ${stillMissing.join(', ')}`); }
mkdirSync(dirname(OUT), { recursive: true });
copyFileSync(tmp, OUT);
rmSync(tmp, { force: true });

// The ligature list is the thing that matters, so say exactly how it moved.
const added = after.filter((n) => !before.includes(n));
const removed = before.filter((n) => !after.includes(n));
const summarise = (list) => (list.length > 12 ? `${list.slice(0, 12).join(', ')} … (+${list.length - 12} more)` : list.join(', '));
console.log(`subset-icons: wrote ${OUT}: ${after.length} icons, ${beforeSize} -> ${kb(OUT)}`);
if (!before.length) console.log('  (new file)');
else if (!added.length && !removed.length) console.log('  (ligature set unchanged)');
if (added.length && before.length) console.log(`  + ${summarise(added)}`);
if (removed.length) console.log(`  - ${summarise(removed)}`);
if (unresolved.length) console.log(`subset-icons: ${unresolved.length} icon span(s) render a runtime value; ${runtimeSpanAdvice()}`);

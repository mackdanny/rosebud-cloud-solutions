// Every inline <script> the prerender emits must be hash-allowlisted in the CSP,
// or browsers block it silently (React's streaming runtime was blocked on every
// page until 2026-08). The hashes are byte-exact, so a react-dom/vike upgrade can
// change the emitted script and invalidate them: this check fails the build loudly
// instead. Fix = update script-src in public/staticwebapp.config.json with the
// hashes printed below.
//
// Usage: node scripts/check-csp-hashes.mjs [config-path]   (default: public/staticwebapp.config.json)
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name === 'index.html' ? [join(dir, e.name)] : [],
  );
}

const configPath = process.argv[2] ?? 'public/staticwebapp.config.json';
const csp = JSON.parse(readFileSync(configPath, 'utf8')).globalHeaders['Content-Security-Policy'];
const scriptSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('script-src '));
if (!scriptSrc) { console.error('check-csp-hashes: no script-src directive in ' + configPath); process.exit(1); }
const declared = new Set([...scriptSrc.matchAll(/'(sha256-[^']+)'/g)].map((m) => m[1]));

const needed = new Map(); // hash -> { snippet, pages }
for (const file of htmlFiles('dist/client')) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attrs, body] = m;
    if (/application\/(ld\+)?json/.test(attrs)) continue; // data blocks: CSP does not execute these
    const hash = 'sha256-' + createHash('sha256').update(body).digest('base64');
    const entry = needed.get(hash) ?? { snippet: body.trim().slice(0, 60), pages: 0 };
    entry.pages += 1;
    needed.set(hash, entry);
  }
}

const missing = [...needed].filter(([h]) => !declared.has(h));
const stale = [...declared].filter((h) => !needed.has(h));
if (stale.length) console.warn('check-csp-hashes: WARNING, declared but unused (stale?): ' + stale.join(', '));
if (missing.length) {
  console.error('check-csp-hashes: inline scripts NOT allowlisted in script-src (' + configPath + '):');
  for (const [h, { snippet, pages }] of missing) console.error(`  '${h}'  (${pages} pages)  ${snippet}`);
  process.exit(1);
}
console.log(`check-csp-hashes: OK, ${needed.size} inline script(s) all allowlisted (${declared.size} declared).`);

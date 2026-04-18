#!/usr/bin/env node
// Converts public/ PNGs to WebP (keeps PNG fallback) and resizes oversized sources.
// Each image has an explicit max dimension based on how it's actually displayed.

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';

const PUBLIC = new URL('../public/', import.meta.url).pathname;

// Explicit per-image targets. Missing entries get a conservative default.
// maxDim = longest side in px. Applied as `width/height` ceiling; smaller images are left alone.
const PLAN = {
  // 6000×6000 used at ~580px max — huge win from resizing
  'rcs-logo.png':                { maxDim: 1200, webpQuality: 85 },
  // OG card (1200×630 is the canonical size — keep)
  'rcs-logo-full.png':           { maxDim: 1200, webpQuality: 88 },
  // Team photos (currently 1030-1546px, displayed at ~300-400px)
  'team-alex.png':               { maxDim: 800, webpQuality: 82 },
  'team-daniel.png':             { maxDim: 800, webpQuality: 82 },
  'team-hani.png':               { maxDim: 800, webpQuality: 82 },
  'team-hannah.png':             { maxDim: 800, webpQuality: 82 },
  'team-raza.png':               { maxDim: 800, webpQuality: 82 },
  // Case study images (hero + card, keep 1024 for hero quality)
  'case-study-01.png':           { maxDim: 1024, webpQuality: 80 },
  'case-study-02.png':           { maxDim: 1024, webpQuality: 80 },
  'case-study-03.png':           { maxDim: 1024, webpQuality: 80 },
  'case-study-04.png':           { maxDim: 1024, webpQuality: 80 },
  'case-study-05.png':           { maxDim: 1024, webpQuality: 80 },
  'case-study-06.png':           { maxDim: 1024, webpQuality: 80 },
  // Service images (used in cards ~400-600px)
  'service-cloud-architecture.png': { maxDim: 768, webpQuality: 82 },
  'service-cloud-optimisation.png': { maxDim: 768, webpQuality: 82 },
  'service-cloud-security.png':     { maxDim: 768, webpQuality: 82 },
  'service-devsecops.png':          { maxDim: 768, webpQuality: 82 },
  'service-managed-cloud.png':      { maxDim: 768, webpQuality: 82 },
  // Cert badges (displayed at 102px, 2x retina = 204px, go 256 for safety)
  'cert-01.png':                 { maxDim: 256, webpQuality: 85 },
  'cert-02.png':                 { maxDim: 256, webpQuality: 85 },
  'cert-03.png':                 { maxDim: 256, webpQuality: 85 },
  'cert-04.png':                 { maxDim: 256, webpQuality: 85 },
  'cert-05.png':                 { maxDim: 256, webpQuality: 85 },
  'cert-06.png':                 { maxDim: 256, webpQuality: 85 },
};

const DEFAULT = { maxDim: 1024, webpQuality: 82 };
const BYTES_KB = (n) => (n / 1024).toFixed(1) + ' KB';

async function optimize(file) {
  const plan = PLAN[file] ?? DEFAULT;
  const inputPath = join(PUBLIC, file);
  const { name } = parse(file);
  const webpPath = join(PUBLIC, `${name}.webp`);

  const originalSize = (await stat(inputPath)).size;

  const pipeline = sharp(inputPath);
  const meta = await pipeline.metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  // Also resize the PNG if dramatically oversized (e.g., 6000x6000 → 1200x1200)
  const needsResize = longest > plan.maxDim;
  const resizedPng = needsResize ? join(PUBLIC, file) : null;

  // Produce WebP (always)
  await sharp(inputPath)
    .resize({ width: plan.maxDim, height: plan.maxDim, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: plan.webpQuality, effort: 6 })
    .toFile(webpPath);

  // Overwrite PNG with resized version if needed (keeps format, reduces size)
  if (needsResize) {
    const resizedBuffer = await sharp(inputPath)
      .resize({ width: plan.maxDim, height: plan.maxDim, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    await sharp(resizedBuffer).toFile(resizedPng);
  }

  const webpSize = (await stat(webpPath)).size;
  const newPngSize = (await stat(inputPath)).size;

  return {
    file,
    originalDim: `${meta.width}x${meta.height}`,
    targetDim: needsResize ? `${plan.maxDim} max` : `${meta.width}x${meta.height}`,
    originalPng: originalSize,
    newPng: newPngSize,
    webp: webpSize,
    webpSavingsPct: Math.round(((originalSize - webpSize) / originalSize) * 100),
  };
}

async function main() {
  const files = (await readdir(PUBLIC)).filter((f) => f.endsWith('.png'));
  console.log(`Optimizing ${files.length} images...\n`);

  const results = [];
  for (const f of files) {
    try {
      const r = await optimize(f);
      results.push(r);
      console.log(
        `✓ ${r.file.padEnd(38)} ${r.originalDim.padEnd(12)} → ${r.targetDim.padEnd(12)} | ` +
        `PNG ${BYTES_KB(r.originalPng).padEnd(10)} → ${BYTES_KB(r.newPng).padEnd(10)} | ` +
        `WebP ${BYTES_KB(r.webp).padEnd(9)} (-${r.webpSavingsPct}%)`,
      );
    } catch (err) {
      console.error(`✗ ${f}: ${err.message}`);
    }
  }

  const totalOrig = results.reduce((s, r) => s + r.originalPng, 0);
  const totalNewPng = results.reduce((s, r) => s + r.newPng, 0);
  const totalWebp = results.reduce((s, r) => s + r.webp, 0);

  console.log('\n=== Summary ===');
  console.log(`Original PNGs:   ${BYTES_KB(totalOrig)}`);
  console.log(`Resized PNGs:    ${BYTES_KB(totalNewPng)} (${Math.round(((totalOrig - totalNewPng) / totalOrig) * 100)}% smaller)`);
  console.log(`WebP output:     ${BYTES_KB(totalWebp)} (${Math.round(((totalOrig - totalWebp) / totalOrig) * 100)}% smaller than original)`);
}

main();

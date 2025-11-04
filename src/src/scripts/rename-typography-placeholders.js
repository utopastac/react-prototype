#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const exts = new Set(['.sass', '.scss']);

// Map old placeholders -> new placeholders (without the leading %)
const RENAME_MAP = new Map([
  ['display-hero-numerics', 'typography-display-xl-bold'],
  ['display-hero', 'typography-display-xl'],
  ['display-headline-l', 'typography-display-l'],
  ['display-headline-s', 'typography-display-m'],
  ['display-numeral-s', 'typography-display-s'],
  ['display-section-title', 'typography-heading-m'],
  ['display-page-title', 'typography-heading-l'],
  ['body-label-m', 'typography-title-l'],
  ['body-label-s', 'typography-title-s'],
  ['body-body-s', 'typography-body'],
  // For body-body-m we use custom mapping to 16/24 via globals; keep as-is or map to title-l if desired
  ['body-body-m', 'typography-body'],
  ['body-body-m-link', 'typography-title-l'],
  ['body-body-s-link', 'typography-title-s'],
  ['detail-label-xs', 'typography-supportive-s'],
  ['detail-body-xs', 'typography-supportive-s'],
  ['detail-link-xs', 'typography-supportive-s'],
  ['component-title-bar-page-title', 'typography-title-l'],
  ['component-input', 'typography-body'],
  ['component-button', 'typography-title-l'],
  ['component-button-compact', 'typography-title-s'],
  ['component-help-text', 'typography-body'],
  ['component-card-title-l', 'typography-heading-m'],
  ['component-card-title-s', 'typography-title-l'],
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;
  let changes = 0;

  for (const [from, to] of RENAME_MAP) {
    const re = new RegExp(`@extend \\%${from}(?![\w-])`, 'g');
    updated = updated.replace(re, `@extend %${to}`);
    if (original !== updated) changes++;
  }

  if (changes > 0 && updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const targetRoot = path.resolve(ROOT, '..'); // project src/src parent
  const startDir = targetRoot; // search all under src/src
  const files = walk(startDir);
  let modified = 0;
  for (const f of files) {
    if (rewriteFile(f)) {
      console.log(`Updated: ${path.relative(startDir, f)}`);
      modified++;
    }
  }
  console.log(`Done. Files updated: ${modified}`);
}

if (require.main === module) {
  main();
}

/*
 * Inserts blank lines between top-level SASS blocks for readability.
 * Rules:
 *  - Keep @import group together, add one blank line after the last import.
 *  - Ensure a blank line before each top-level selector/block (., %, @mixin) if not already separated.
 * Usage:
 *   node src/scripts/formatAdminSass.cjs
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.resolve(__dirname, '../../src/src/admin');

function isBlank(line) {
  return line.trim().length === 0;
}

function isImport(line) {
  return line.startsWith('@import');
}

function isTopLevel(line) {
  if (!line || line.startsWith(' ')) return false; // indented => not top-level
  return line.startsWith('.') || line.startsWith('%') || line.startsWith('@mixin');
}

function formatFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);

  let output = [];
  let inImportBlock = true; // start true; ends when first non-import, non-blank top-level line appears

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = output.length ? output[output.length - 1] : '';

    // Track import block end
    if (inImportBlock) {
      if (!isBlank(line) && !isImport(line)) {
        // leaving import block; ensure exactly one blank line before this line
        if (output.length && !isBlank(prev)) output.push('');
        inImportBlock = false;
      }
    }

    // For subsequent top-level blocks, ensure a blank line before, unless we're at file start or already have one
    if (!inImportBlock && isTopLevel(line)) {
      if (output.length && !isBlank(prev)) {
        output.push('');
      }
    }

    output.push(line);
  }

  const updated = output.join('\n');
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Formatted: ${path.relative(process.cwd(), filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.sass')) {
      formatFile(full);
    }
  }
}

if (!fs.existsSync(ADMIN_DIR)) {
  console.error(`Admin directory not found: ${ADMIN_DIR}`);
  process.exit(1);
}

walk(ADMIN_DIR);
console.log('Admin SASS formatting complete.');



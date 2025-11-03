#!/usr/bin/env node

/*
  Thoroughly rename all references of Formblocker → InterventionScreen across
  file/folder names and file contents.

  Usage:
    Dry run (default):
      node src/scripts/renameFormblockerToInterventionScreen.cjs

    Apply changes:
      node src/scripts/renameFormblockerToInterventionScreen.cjs --apply

    Optional root override (defaults to repo root = process.cwd()):
      node src/scripts/renameFormblockerToInterventionScreen.cjs --apply --root /absolute/path
*/

const fs = require('fs');
const path = require('path');

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');

// Allow overriding root with --root <dir>
let rootArgIndex = process.argv.indexOf('--root');
let ROOT = process.cwd();
if (rootArgIndex !== -1 && process.argv[rootArgIndex + 1]) {
  ROOT = path.resolve(process.argv[rootArgIndex + 1]);
}

// Directories to ignore entirely during traversal
const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'out',
  '.turbo',
  '.cache'
]);

// File extensions to consider for in-file text replacement
const TEXT_EXTENSIONS = new Set([
  // code
  '.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx',
  // styles and markup
  '.css', '.sass', '.scss', '.less', '.html', '.htm', '.svg',
  // config/content
  '.md', '.mdx', '.json', '.yml', '.yaml', '.txt', '.env', '.env.example',
]);

// Replacement variants (ordered from most specific to most generic/case-insensitive)
// Adjust or extend as needed for other naming conventions observed in the codebase.
const REPLACEMENTS = [
  // PascalCase variants
  { from: 'FormBlocker', to: 'InterventionScreen' },
  { from: 'Formblocker', to: 'InterventionScreen' },
  // camelCase
  { from: 'formBlocker', to: 'interventionScreen' },
  // kebab-case
  { from: 'form-blocker', to: 'intervention-screen' },
  // snake_case
  { from: 'form_blocker', to: 'intervention_screen' },
  // lowercase (conservative)
  { from: 'formblocker', to: 'interventionscreen' },
  // UPPERCASE
  { from: 'FORMBLOCKER', to: 'INTERVENTIONSCREEN' },
];

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  if (TEXT_EXTENSIONS.has(ext)) return true;
  // Heuristic: treat files without an extension as text unless binary-signature is detected
  if (!ext) {
    try {
      const fd = fs.openSync(filePath, 'r');
      const buf = Buffer.alloc(512);
      const bytes = fs.readSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      for (let i = 0; i < bytes; i++) {
        if (buf[i] === 0) return false; // likely binary
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

function applyReplacementsToString(input) {
  let output = input;
  for (const { from, to } of REPLACEMENTS) {
    if (!from) continue;
    // Replace all occurrences (escape regex special chars in 'from')
    const safe = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(safe, 'g');
    output = output.replace(re, to);
  }
  return output;
}

function renamePathIfNeeded(absPath, relPath, summary) {
  const dir = path.dirname(absPath);
  const base = path.basename(absPath);
  const newBase = applyReplacementsToString(base);
  if (newBase !== base) {
    const newAbs = path.join(dir, newBase);
    if (apply) {
      fs.renameSync(absPath, newAbs);
    }
    summary.renamed.push({ from: relPath, to: path.relative(ROOT, newAbs) });
    return newAbs;
  }
  return absPath;
}

function replaceFileContents(absPath, relPath, summary) {
  if (!isTextFile(absPath)) return;
  try {
    const original = fs.readFileSync(absPath, 'utf8');
    const updated = applyReplacementsToString(original);
    if (updated !== original) {
      if (apply) {
        fs.writeFileSync(absPath, updated, 'utf8');
      }
      summary.modified.push(relPath);
    }
  } catch (e) {
    summary.errors.push({ file: relPath, error: e.message });
  }
}

function walkAndProcess(currentAbs, summary) {
  const stats = fs.lstatSync(currentAbs);
  const rel = path.relative(ROOT, currentAbs) || '.';

  if (stats.isSymbolicLink()) return; // skip symlinks

  if (stats.isDirectory()) {
    const name = path.basename(currentAbs);
    if (IGNORE_DIRS.has(name)) return;

    // Depth-first: process children first so path renames don't break traversal
    const entries = fs.readdirSync(currentAbs);
    for (const entry of entries) {
      walkAndProcess(path.join(currentAbs, entry), summary);
    }

    // Rename this directory if needed after processing contents
    const maybeRenamedAbs = renamePathIfNeeded(currentAbs, rel, summary);
    return maybeRenamedAbs;
  }

  if (stats.isFile()) {
    // First, rename file if needed
    const newAbs = renamePathIfNeeded(currentAbs, rel, summary);
    const newRel = path.relative(ROOT, newAbs);
    // Then, replace contents
    replaceFileContents(newAbs, newRel, summary);
  }
}

function main() {
  const summary = { renamed: [], modified: [], errors: [] };
  const start = Date.now();
  walkAndProcess(ROOT, summary);
  const ms = Date.now() - start;

  const mode = apply ? 'APPLY' : 'DRY-RUN';
  console.log(`\n[rename-formblocker] Mode: ${mode}`);
  console.log(`[rename-formblocker] Root: ${ROOT}`);
  console.log(`[rename-formblocker] Duration: ${ms}ms`);

  console.log(`\n[rename-formblocker] Renamed paths: ${summary.renamed.length}`);
  for (const r of summary.renamed) {
    console.log(`  ${r.from} -> ${r.to}`);
  }

  console.log(`\n[rename-formblocker] Modified files: ${summary.modified.length}`);
  for (const m of summary.modified) {
    console.log(`  ${m}`);
  }

  if (summary.errors.length) {
    console.log(`\n[rename-formblocker] Errors: ${summary.errors.length}`);
    for (const e of summary.errors) {
      console.log(`  ${e.file}: ${e.error}`);
    }
  }

  if (!apply) {
    console.log('\n[rename-formblocker] No changes written (dry run). Re-run with --apply to write changes.');
  }
}

main();



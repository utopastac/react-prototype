/*
 * Codemod: Replace SASS variables in admin SASS files with CSS variables
 * Usage:
 *   node src/scripts/replaceAdminSassVars.cjs
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.resolve(__dirname, '../../src/src/admin');

const replacements = [
  [/\$admin-brand-highlight\b/g, 'var(--admin-color-accent)'],
  [/\$dev-tools-highlight\b/g, 'var(--admin-highlight)'],
  [/\$dev-tools-section-border\b/g, 'var(--admin-color-border)'],
  [/\$dev-tools-text-dark\b/g, 'var(--admin-color-text)'],
  [/\$dev-tools-text-medium\b/g, 'var(--admin-color-text-muted)'],
  [/\$dev-tools-text-lightest\b/g, 'var(--admin-color-text-subtlest)'],
  [/\$dev-tools-text-light\b/g, 'var(--admin-color-text-subtle)'],
  [/\$white\b/g, '#ffffff'],
  [/\$gray-f4\b/g, 'var(--admin-color-bg-muted)'],
  [/\$gray-e4\b/g, 'var(--admin-color-bg-muted)'],
  [/\$gray-ef\b/g, '#EFEFEF'],
  [/\$gray-888\b/g, 'var(--admin-color-text-muted)'],
  [/\$dev-tools-font-size-xl\b/g, 'var(--admin-font-xl)'],
  [/\$dev-tools-font-size-l\b/g, 'var(--admin-font-l)'],
  [/\$dev-tools-font-size-m\b/g, 'var(--admin-font-m)'],
  [/\$dev-tools-font-size-s\b/g, 'var(--admin-font-s)'],
  [/\$dev-tools-font-size-xs\b/g, 'var(--admin-font-xs)'],
  [/\$dev-tools-input-font-size\b/g, 'var(--admin-font-s)'],
  [/\$admin-panel-size\b/g, 'var(--admin-panel-width)'],
  [/\$dev-tools-section-header-height\b/g, 'var(--admin-section-header-height)'],
  [/\$dev-tools-input-size\b/g, 'var(--admin-input-height)'],
  [/\$dev-tools-wrapper-border-radius\b/g, 'var(--admin-radius-md)'],
  [/\$dev-tools-border-radius\b/g, 'var(--admin-radius-sm)'],
  [/\$dev-tools-padding\b/g, 'var(--admin-space-16)'],
  [/\$dev-tools-input-padding\b/g, 'var(--admin-space-8)'],
  [/\$dev-tools-section-gap\b/g, 'var(--admin-space-14)'],
  [/\$dev-tools-side-offset\b/g, 'var(--admin-space-0)'],
  [/\$dev-tools-button-bg\b/g, 'var(--admin-color-text)'],
  [/\$dev-tools-button-hover\b/g, 'var(--admin-color-text)'],
  [/\$dev-tools-input-bg\b/g, 'var(--admin-color-bg-muted)'],
  [/\$dev-tools-input-focus\b/g, 'rgba(0,0,0,0.12)'],
  [/\$dev-tools-input-hover\b/g, 'rgba(0,0,0,0.12)'],
  [/\$dev-tools-width\b/g, 'var(--admin-panel-width)'],
];

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile()) {
      if (full.endsWith('.sass') && !full.endsWith('tokens.css')) {
        processFile(full);
      }
    }
  }
}

if (!fs.existsSync(ADMIN_DIR)) {
  console.error(`Admin directory not found: ${ADMIN_DIR}`);
  process.exit(1);
}

walk(ADMIN_DIR);
console.log('SASS variable replacement complete.');



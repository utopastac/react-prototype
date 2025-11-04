#!/usr/bin/env node

/**
 * Color Migration Script
 * 
 * Migrates color variables from _colors.sass to globals.css semantic variables.
 * 
 * Usage:
 *   node scripts/migrate-colors.js [path-to-file-or-directory]
 * 
 * If no path is provided, it will scan all .sass, .scss, .css, and .tsx files in src/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the mapping
const mappingPath = path.join(__dirname, '../src/styles/color-migration-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Combine all mappings into a single flat object for easy lookup
// Filter out 'comment' fields
const allMappings = {
  ...mapping.mappings.text,
  ...mapping.mappings.background,
  ...mapping.mappings.border,
  ...mapping.mappings.icon,
  ...mapping.mappings.component,
  ...mapping.mappings.utility,
  ...Object.fromEntries(
    Object.entries(mapping.base_color_mappings).filter(([key]) => key !== 'comment')
  )
};

// Create a reverse lookup for theme selector
const themeSelectorMapping = mapping.theme_selector_mapping;

/**
 * Migrate a single file
 */
function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const changes = [];

  // Migrate theme selector (but skip the comment field)
  for (const [oldSelector, newSelector] of Object.entries(themeSelectorMapping)) {
    if (oldSelector === 'comment') continue;
    if (oldSelector && newSelector && content.includes(oldSelector)) {
      content = content.replace(new RegExp(escapeRegExp(oldSelector), 'g'), newSelector);
      changes.push(`Theme selector: ${oldSelector} → ${newSelector}`);
      changed = true;
    }
  }

  // Also migrate theme constant strings in TypeScript/JavaScript files
  if (filePath.match(/\.(ts|tsx|js|jsx)$/)) {
    // Replace "THEME_LIGHT" string literal with "light"
    if (content.includes('"THEME_LIGHT"') || content.includes("'THEME_LIGHT'")) {
      content = content.replace(/"THEME_LIGHT"/g, '"light"');
      content = content.replace(/'THEME_LIGHT'/g, "'light'");
      if (!changes.some(c => c.includes('THEME_LIGHT'))) {
        changes.push(`Theme constant: "THEME_LIGHT" → "light"`);
      }
      changed = true;
    }
    // Replace "THEME_DARK" string literal with "dark"
    if (content.includes('"THEME_DARK"') || content.includes("'THEME_DARK'")) {
      content = content.replace(/"THEME_DARK"/g, '"dark"');
      content = content.replace(/'THEME_DARK'/g, "'dark'");
      if (!changes.some(c => c.includes('THEME_DARK'))) {
        changes.push(`Theme constant: "THEME_DARK" → "dark"`);
      }
      changed = true;
    }
  }

  // Migrate color variables
  for (const [oldVar, newVar] of Object.entries(allMappings)) {
    // Skip if oldVar or newVar is invalid
    if (!oldVar || !newVar || oldVar === 'comment' || newVar === 'comment') continue;

    let varChanged = false;

    // Replace var(--old-var) with var(--new-var)
    const varPattern = new RegExp(`var\\(${escapeRegExp(oldVar)}\\)`, 'g');
    if (varPattern.test(content)) {
      content = content.replace(varPattern, `var(${newVar})`);
      varChanged = true;
    }

    // Replace standalone --old-var with --new-var (for SASS/CSS variable definitions)
    // This handles cases like: --old-var: value
    // Use word boundaries but account for CSS variable syntax
    const standalonePattern = new RegExp(`(^|[^a-zA-Z0-9_-])${escapeRegExp(oldVar)}([^a-zA-Z0-9_-]|$)`, 'gm');
    if (standalonePattern.test(content)) {
      content = content.replace(standalonePattern, (match, before, after) => {
        // Don't replace if it's already inside a var() (shouldn't happen after first replacement)
        return `${before}${newVar}${after}`;
      });
      varChanged = true;
    }

    if (varChanged) {
      changes.push(`Variable: ${oldVar} → ${newVar}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Migrated: ${filePath}`);
    changes.forEach(change => console.log(`  - ${change}`));
    return true;
  }

  return false;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Recursively find all files that might contain color variables
 */
function findFiles(rootPath) {
  const files = [];
  const extensions = ['.sass', '.scss', '.css', '.tsx', '.ts', '.jsx', '.js'];
  const ignoreDirs = ['node_modules', 'dist', '.git'];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip ignored directories
      if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  walkDir(rootPath);
  return files;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || path.join(__dirname, '../src');

  let files = [];

  if (fs.statSync(targetPath).isDirectory()) {
    files = findFiles(targetPath);
  } else {
    files = [targetPath];
  }

  console.log(`Found ${files.length} files to check...\n`);

  let migratedCount = 0;
  files.forEach(file => {
    try {
      if (migrateFile(file)) {
        migratedCount++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  });

  console.log(`\n✓ Migration complete! ${migratedCount} files migrated.`);
}

// Run if executed directly
main();

export { migrateFile, allMappings, themeSelectorMapping };


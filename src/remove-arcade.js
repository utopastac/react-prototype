#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = path.join(__dirname, 'src');

// Helper function to recursively find all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Helper function to recursively find all directories
function getAllDirs(dirPath, arrayOfDirs = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfDirs.push(filePath);
      arrayOfDirs = getAllDirs(filePath, arrayOfDirs);
    }
  });

  return arrayOfDirs;
}

// Find all files and directories with "Arcade" in the name
function findArcadeFilesAndDirs() {
  const allFiles = getAllFiles(srcDir);
  const allDirs = getAllDirs(srcDir);
  
  const arcadeFiles = allFiles.filter(file => 
    /[Aa]rcade/i.test(path.basename(file))
  );
  
  const arcadeDirs = allDirs.filter(dir => 
    /[Aa]rcade/i.test(path.basename(dir))
  );

  // Sort by depth (deepest first) to avoid renaming parent before child
  arcadeDirs.sort((a, b) => {
    const depthA = a.split(path.sep).length;
    const depthB = b.split(path.sep).length;
    return depthB - depthA;
  });

  return { arcadeFiles, arcadeDirs };
}

// Rename file or directory
function renamePath(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${path.relative(srcDir, oldPath)} -> ${path.relative(srcDir, newPath)}`);
    return true;
  } catch (error) {
    console.error(`Error renaming ${oldPath}:`, error.message);
    return false;
  }
}

// Replace "Arcade" with empty string (removing it)
function removeArcadeFromName(name) {
  return name.replace(/[Aa]rcade/g, '').replace(/Arcade/g, '');
}

// Step 1: Rename all files and directories
function renameFilesAndDirs() {
  console.log('Step 1: Renaming files and directories...\n');
  const { arcadeFiles, arcadeDirs } = findArcadeFilesAndDirs();

  // Rename directories first (deepest first)
  arcadeDirs.forEach(dir => {
    const dirName = path.basename(dir);
    const newDirName = removeArcadeFromName(dirName);
    if (newDirName !== dirName) {
      const parentDir = path.dirname(dir);
      const newPath = path.join(parentDir, newDirName);
      renamePath(dir, newPath);
    }
  });

  // Then rename files
  arcadeFiles.forEach(file => {
    const fileName = path.basename(file);
    const newFileName = removeArcadeFromName(fileName);
    if (newFileName !== fileName) {
      const dir = path.dirname(file);
      const newPath = path.join(dir, newFileName);
      renamePath(file, newPath);
    }
  });
}

// Step 2: Replace all content references
function replaceContentInFiles() {
  console.log('\nStep 2: Replacing content in files...\n');
  
  const allFiles = getAllFiles(srcDir);
  const textFiles = allFiles.filter(file => {
    const ext = path.extname(file);
    return ['.ts', '.tsx', '.js', '.jsx', '.json', '.sass', '.css', '.md'].includes(ext);
  });

  const replacements = [
    // Component names and identifiers (preserve case)
    { pattern: /\bArcade([A-Z][a-zA-Z]*)\b/g, replacement: '$1' },
    // Type/Interface names
    { pattern: /(type|interface)\s+Arcade([A-Z][a-zA-Z]*)/g, replacement: '$1 $2' },
    // Import statements - component names
    { pattern: /import\s+Arcade([A-Z][a-zA-Z]*)\s*,/g, replacement: 'import $1,' },
    { pattern: /import\s+Arcade([A-Z][a-zA-Z]*)\s+from/g, replacement: 'import $1 from' },
    { pattern: /\{\s*Arcade([A-Z][a-zA-Z]*)\s*\}/g, replacement: '{ $1 }' },
    { pattern: /\{\s*Arcade([A-Z][a-zA-Z]*),\s*/g, replacement: '{ $1, ' },
    { pattern: /,\s*Arcade([A-Z][a-zA-Z]*)\s*\}/g, replacement: ', $1 }' },
    { pattern: /,\s*Arcade([A-Z][a-zA-Z]*),\s*/g, replacement: ', $1, ' },
    // Export statements
    { pattern: /export\s+.*Arcade([A-Z][a-zA-Z]*)/g, replacement: (match) => match.replace(/Arcade([A-Z][a-zA-Z]*)/g, '$1') },
    // File paths in import/require
    { pattern: /['"]src\/([^'"]*?)Arcade([A-Z][a-zA-Z]*)/g, replacement: (match, p1, p2) => {
      const dirPart = p1.replace(/Arcade/g, '');
      return `'src/${dirPart}${p2}`;
    }},
    { pattern: /['"]src\/([^'"]*?)Arcade([A-Z][a-zA-Z]*)/g, replacement: (match, p1, p2) => {
      const dirPart = p1.replace(/Arcade/g, '');
      return `"src/${dirPart}${p2}`;
    }},
    // Variable assignments
    { pattern: /=\s*Arcade([A-Z][a-zA-Z]*)/g, replacement: '= $1' },
    // Object property names
    { pattern: /:\s*Arcade([A-Z][a-zA-Z]*)/g, replacement: ': $1' },
    // Default exports
    { pattern: /export\s+default\s+Arcade([A-Z][a-zA-Z]*)/g, replacement: 'export default $1' },
    // Function/const declarations
    { pattern: /(const|let|var|function)\s+Arcade([A-Z][a-zA-Z]*)/g, replacement: '$1 $2' },
  ];

  textFiles.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      let originalContent = content;

      // Apply all replacements
      replacements.forEach(({ pattern, replacement }) => {
        if (typeof replacement === 'function') {
          const newContent = content.replace(pattern, replacement);
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        } else {
          if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
          }
        }
      });

      // Also replace any remaining "Arcade" as prefix (more general)
      const beforeGeneral = content;
      content = content.replace(/\bArcade([A-Z][a-zA-Z]*)\b/g, '$1');
      if (content !== beforeGeneral) {
        modified = true;
      }

      // Replace "Arcade" in string literals
      const beforeString = content;
      content = content.replace(/"Arcade ([^"]+)"/g, '"$1"');
      content = content.replace(/'Arcade ([^']+)'/g, "'$1'");
      if (content !== beforeString) {
        modified = true;
      }

      // Replace "Arcade" in file paths (HTML attributes, comments, etc.)
      const beforePath = content;
      // Match Arcade followed by capital letter and more characters in paths
      // This handles patterns like /components/ArcadeTopBar/ or /ArcadeButtonGroup/index.module.sass
      content = content.replace(/\/Arcade([A-Z][a-zA-Z0-9]*)/g, '/$1');
      content = content.replace(/Arcade([A-Z][a-zA-Z0-9]*)\//g, '$1/');
      content = content.replace(/Arcade([A-Z][a-zA-Z0-9]*)\./g, '$1.');
      if (content !== beforePath) {
        modified = true;
      }

      if (modified && content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${path.relative(srcDir, file)}`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
}

// Main execution
console.log('Starting removal of "Arcade" references...\n');
console.log('=' .repeat(60));

try {
  renameFilesAndDirs();
  replaceContentInFiles();
  
  console.log('\n' + '='.repeat(60));
  console.log('Done! All "Arcade" references have been removed.');
} catch (error) {
  console.error('Error during script execution:', error);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const projectRoot = '/Users/becter/code/react-prototype';
const srcDir = path.join(projectRoot, 'src', 'src');
const iconsFile = path.join(srcDir, 'data', 'Icons.tsx');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function getUsedIconNames() {
  const files = walk(srcDir).filter(f => /\.(tsx|ts|js|jsx|json|md|sass|css)$/.test(f));
  const used = new Set();
  const regex = /Icons\.([A-Za-z0-9_]+)/g;
  for (const file of files) {
    try {
      const text = fs.readFileSync(file, 'utf8');
      let m;
      while ((m = regex.exec(text)) !== null) {
        used.add(m[1]);
      }
    } catch {}
  }
  return used;
}

function parseIconImports(content) {
  const importRegex = /^import\s+([A-Za-z0-9_]+)\s+from\s+"([^"]+)";\s*$/gm;
  const imports = [];
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    imports.push({ name: m[1], from: m[2] });
  }
  return imports;
}

function parseExports(content) {
  const start = content.indexOf('export {');
  if (start === -1) return { start: -1, end: -1, names: [] };
  let i = start;
  let depth = 0;
  for (; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  const end = i;
  const block = content.slice(start, end);
  const nameRegex = /\b([A-Za-z0-9_]+)\b\s*,?/g;
  const names = new Set();
  let nm;
  // Skip keywords like export
  for (const line of block.split('\n')) {
    if (line.trim().startsWith('//')) continue;
    if (line.includes('export')) continue;
    // collect identifiers, ignore trailing comments
    const clean = line.split('//')[0];
    let m2;
    while ((m2 = nameRegex.exec(clean)) !== null) {
      const n = m2[1];
      if (/^(export|default)$/.test(n)) continue;
      names.add(n);
    }
  }
  return { start, end, names: Array.from(names) };
}

function main() {
  const used = getUsedIconNames();
  const content = fs.readFileSync(iconsFile, 'utf8');
  const imports = parseIconImports(content);
  const exportInfo = parseExports(content);

  // Determine which imported names are used
  const keepSet = new Set();
  for (const { name } of imports) {
    if (used.has(name)) keepSet.add(name);
  }

  // Build new imports content preserving original order and comment lines
  const lines = content.split('\n');
  const newLines = [];
  for (const line of lines) {
    if (line.startsWith('import ')) {
      const m = line.match(/^import\s+([A-Za-z0-9_]+)\s+from\s+"([^"]+)";\s*$/);
      if (m) {
        const name = m[1];
        if (keepSet.has(name)) newLines.push(line);
        else newLines.push(null); // mark removed
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  // Rebuild export block using keepSet and preserving comment headings
  const header = content.slice(0, exportInfo.start);
  const footer = content.slice(exportInfo.end);

  // Collect comment headings in the export block
  const exportBlockLines = content.slice(exportInfo.start, exportInfo.end).split('\n');
  const headings = [];
  for (const l of exportBlockLines) {
    if (l.trim().startsWith('//')) headings.push(l);
  }

  const keptNamesOrdered = imports.map(i => i.name).filter(n => keepSet.has(n));
  // Grouping is not strictly needed; keep flat with headings for readability
  const rebuiltExport = ['export {', ...headings, ...keptNamesOrdered.map(n => `  ${n},`), '}'].join('\n');

  const rebuiltContent = header + rebuiltExport + footer;

  // Now compute files to delete (imports removed)
  const removed = imports.filter(i => !keepSet.has(i.name));

  // Write file
  fs.writeFileSync(iconsFile, rebuiltContent, 'utf8');

  // Delete associated svgs
  for (const r of removed) {
    // Only delete .svg files under src/src/assets
    const p = r.from;
    if (!p.endsWith('.svg')) continue;
    const abs = path.join(srcDir, p.replace(/^src\//, ''));
    try {
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch (e) {
      // ignore
    }
  }

  console.log(`Kept: ${keptNamesOrdered.length}, Removed: ${removed.length}`);
}

main();

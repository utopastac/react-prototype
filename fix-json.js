const fs = require('fs');
const path = '/Users/becter/code/react-prototype/src/src/builder/layouts/n-auth.json';
let txt = fs.readFileSync(path, 'utf8');
// Remove trailing commas before ] and }
txt = txt.replace(/,(\s*\])/g, '$1');
txt = txt.replace(/,(\s*\})/g, '$1');
try {
  JSON.parse(txt);
  fs.writeFileSync(path, txt);
  console.log('JSON fixed and saved.');
} catch (e) {
  console.error('Still invalid after cleanup:', e.message);
  process.exit(1);
}

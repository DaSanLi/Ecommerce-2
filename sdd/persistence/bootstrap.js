const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log('Created directory:', p);
  }
}

function ensureFile(p, defaultContent) {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, defaultContent);
    console.log('Created file:', p);
  } else {
    console.log('File already exists:', p);
  }
}

function bootstrap(storagePath) {
  const dir = path.dirname(storagePath);
  ensureDir(dir);
  const defaultContent = JSON.stringify({
    version: 1,
    deltaSpecs: {},
    meta: {
      created: new Date().toISOString(),
      storageType: 'json-file',
      storagePath: storagePath
    }
  }, null, 2);
  ensureFile(storagePath, defaultContent);
  console.log('SDD persistence bootstrap complete.');
}

const storagePath = path.resolve(__dirname, 'storage.json');
bootstrap(storagePath);

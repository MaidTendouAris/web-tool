const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const assert = require('assert/strict');
const source = fs.readFileSync(path.join(__dirname,'../shared-resources.js'),'utf8')
  .replace('global.WebToolsResources = {', 'global.WebToolsResources = { digest,');
const window = {addEventListener() {}};
vm.runInNewContext(source, {window, setTimeout, Map, ArrayBuffer, Uint8Array, Uint32Array});
(async () => {
  for (const size of [0,1,55,56,63,64,65,127,128,262145]) {
    const bytes = crypto.randomBytes(size);
    const actual = await window.WebToolsResources.digest(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length));
    assert.equal(actual,crypto.createHash('sha256').update(bytes).digest('hex'), 'SHA-256 length '+size);
  }
  console.log('SHA-256 fallback against Node crypto, padding boundaries and large blocks: PASS');
})().catch(error=>{console.error(error);process.exitCode=1});

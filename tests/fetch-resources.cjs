const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root,'shared-resources.js'),'utf8');
const definitions = vm.runInNewContext(source.match(/const definitions = (\[[\s\S]*?\]);/)[1]);
const directory = path.resolve(process.env.FFMPEG_CORE_DIR || path.join(root,'tmp/runtime'));
fs.mkdirSync(directory,{recursive:true});
(async()=>{
  for (const resource of definitions) {
    const response = await fetch(resource.downloadUrl, {signal:AbortSignal.timeout(120000)});
    if (!response.ok) throw Error(resource.fileName + ': HTTP '+response.status);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== resource.sha256) throw Error('Integrity mismatch: '+resource.fileName);
    fs.writeFileSync(path.join(directory,resource.fileName),bytes);
    console.log('Verified '+resource.fileName);
  }
})().catch(error=>{console.error(error);process.exitCode=1});

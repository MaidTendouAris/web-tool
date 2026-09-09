const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const vm = require('vm');
const ts = require(process.env.TYPESCRIPT_MODULE || 'typescript');
const root = path.resolve(__dirname, '..');
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, {...parsed.options, noEmit:false});
const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));
  process.exit(1);
}
const normalize = text => text.replace(/\r\n/g, '\n');
let failed = false;
program.emit(undefined, (file, text) => {
  if (!fs.existsSync(file) || normalize(fs.readFileSync(file,'utf8')) !== normalize(text)) {
    console.error('JavaScript out of sync: '+path.relative(root,file)); failed = true;
  }
  if (file.endsWith('.js') && fs.existsSync(file)) {
    new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
    cp.execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
  }
});
if (failed) process.exit(1);
console.log('Full TypeScript, JavaScript syntax and TS/JS parity: PASS');

cp.execFileSync(process.execPath,[path.join(__dirname,'integrity.cjs')],{stdio:'inherit'});

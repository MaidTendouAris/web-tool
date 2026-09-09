const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { PDFDocument } = require(process.env.PDF_LIB_MODULE || "pdf-lib");
const root = path.resolve(__dirname, "..");
const pdfScript = process.env.PDF_LIB_JS || require.resolve("pdf-lib/dist/pdf-lib.min.js");
const server = http.createServer((req,res) => {
  const file = path.resolve(root, "." + decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file,(err,bytes) => {
    if (err) return res.writeHead(404).end();
    res.setHeader("Content-Type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html");
    res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || "msedge", headless:true});
  const errors = [];
  const context = await browser.newContext({viewport:{width:1366,height:900},locale:"zh-CN"});
  context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
  try {
    const page = await context.newPage();
    await page.goto(base + "/image-processing/image-processing.html");
    const png = await page.evaluate(() => {
      const c = document.createElement("canvas");c.width=80;c.height=40;
      c.getContext("2d").fillRect(0,0,80,40);
      return c.toDataURL().split(",")[1];
    });
    const input = {name:"sample.png", mimeType:"image/png", buffer:Buffer.from(png,"base64")};
    await page.locator('[data-tool="compress"]').click();
    await page.locator("#compressFile").setInputFiles(input);
    await page.waitForFunction(() => !document.querySelector("#compressDownload").disabled);
    // Hold real encoder callbacks, then release them out of order.
    await page.evaluate(() => {
      const original = HTMLCanvasElement.prototype.toBlob;
      window.pendingEncodes=[];
      HTMLCanvasElement.prototype.toBlob=function(callback,...args){
        original.call(this,blob=>window.pendingEncodes.push(()=>callback(blob)),...args);
      };
    });
    await page.locator("#maxWidth").fill("60");
    await page.waitForFunction(() => window.pendingEncodes.length === 1);
    await page.locator("#maxWidth").fill("20");
    assert.equal(await page.locator("#compressDownload").isDisabled(),true);
    await page.waitForFunction(() => window.pendingEncodes.length === 2);
    await page.evaluate(() => window.pendingEncodes.pop()());
    await page.waitForFunction(() => !document.querySelector("#compressDownload").disabled);
    await page.evaluate(() => window.pendingEncodes.pop()());
    assert.match(await page.locator("#compressOutputMeta").innerText(), /20 x 10/);
    const dims = await page.locator("#compressPreview img").evaluate(async img => {
      const bitmap=await createImageBitmap(await(await fetch(img.src)).blob());
      const size=[bitmap.width,bitmap.height];bitmap.close();return size;
    });
    assert.deepEqual(dims,[20,10]);
    console.log("Image: late compression result cannot overwrite latest dimensions or download: PASS");
    // A new file must invalidate an old encoder before its decoder completes.
    await page.locator("#maxWidth").fill("30");
    await page.waitForFunction(() => window.pendingEncodes.length === 1);
    await page.locator("#compressFile").setInputFiles({...input,name:"new.png"});
    await page.evaluate(() => window.pendingEncodes.shift()());
    assert.equal(await page.locator("#compressDownload").isDisabled(),true);
    await page.waitForFunction(() => window.pendingEncodes.length === 1);
    await page.evaluate(() => window.pendingEncodes.shift()());
    await page.waitForFunction(() => !document.querySelector("#compressDownload").disabled);
    console.log("Image: replacing input invalidates pending output: PASS");

    await page.reload();
    await page.locator('[data-tool="compress"]').click();
    // Spoof only intrinsic dimensions to test the allocation guard without allocating a giant fixture.
    await page.evaluate(() => {
      Object.defineProperty(HTMLImageElement.prototype,"naturalWidth",{get(){return 20000},configurable:true});
      Object.defineProperty(HTMLImageElement.prototype,"naturalHeight",{get(){return 20000},configurable:true});
      const original=document.createElement.bind(document);
      window.allocatedCanvases=[];
      document.createElement=function(tag,...args) { const el=original(tag,...args);if(tag==="canvas")window.allocatedCanvases.push(el);return el; };
    });
    await page.locator("#compressFile").setInputFiles(input);
    await page.waitForFunction(() => document.querySelector("#compressOutputMeta button"));
    assert.equal(await page.locator("#compressDownload").isDisabled(),true);
    assert.equal(await page.evaluate(() => window.allocatedCanvases.length),0);
    console.log("Image: oversized output stopped before canvas allocation: PASS");

    const pdf = await context.newPage();
    await pdf.goto(base + "/image-to-pdf/image-to-pdf.html");
    await pdf.addScriptTag({path:pdfScript});
    await pdf.evaluate(() => {
      const load=PDFLib.PDFDocument.load;
      window.parseCount=0;
      PDFLib.PDFDocument.load=function(...args){ window.parseCount++;return load.apply(this,args); };
      window.livePdfURLs=new Set();
      const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);
      URL.createObjectURL=blob=>{const url=create(blob);if(blob.type==="application/pdf")window.livePdfURLs.add(url);return url};
      URL.revokeObjectURL=url=>{window.livePdfURLs.delete(url);return revoke(url)};
    });
    const doc = await PDFDocument.create();
    for(let i=0;i<80;i++){ const p=doc.addPage([300,300]);p.drawText("Page "+(i+1)); }
    await pdf.locator('[data-tool="pages"]').click();
    await pdf.locator("#pagesPdfInput").setInputFiles({name:"many.pdf",mimeType:"application/pdf",buffer:Buffer.from(await doc.save())});
    await pdf.waitForFunction(() => document.querySelectorAll(".page-card").length === 80);
    await pdf.locator(".page-card").first().scrollIntoViewIfNeeded();
    await pdf.waitForFunction(() => document.querySelectorAll(".page-card embed").length > 0);
    assert.ok(await pdf.locator(".page-card embed").count() < 20,"offscreen pages must not embed PDF viewers");
    assert.equal(await pdf.evaluate(() => window.parseCount),1,"reuse parsed source");
    for(const i of [25,50,79,0]) {
      await pdf.locator(".page-card").nth(i).scrollIntoViewIfNeeded();
      await pdf.locator(".page-card").nth(i).locator("embed").waitFor({state:"attached"});
      assert.ok(await pdf.evaluate(() => window.livePdfURLs.size <= 22),"bounded idle previews plus source and visible pages");
    }
    assert.equal(await pdf.evaluate(() => window.parseCount),1);
    await pdf.locator(".page-card").first().locator('[data-page-action="rotate"]').click();
    await pdf.waitForFunction(() => document.querySelector(".page-card .thumb").dataset.previewKey?.endsWith(":90"));
    await pdf.locator(".page-card").first().locator(".thumb").click();
    await pdf.waitForFunction(() => !document.querySelector("#pagePreviewModal").hidden);
    const rotation = await pdf.locator("#pagePreviewEmbed").evaluate(async embed => {
      const d=await PDFLib.PDFDocument.load(await(await fetch(embed.src.split("#")[0])).arrayBuffer());
      return d.getPages()[0].getRotation().angle;
    });
    assert.equal(rotation,90);
    await pdf.locator("#pagePreviewClose").click();
    await pdf.locator(".page-card").first().locator('[data-page-action="remove"]').click();
    assert.equal(await pdf.locator(".page-card").count(),79);
    await pdf.locator("#exportPagesButton").click();
    await pdf.locator("#resultBox a").waitFor();
    const exported=await pdf.locator("#resultBox a").evaluate(async a => {
      const doc=await PDFLib.PDFDocument.load(await(await fetch(a.href)).arrayBuffer());return doc.getPageCount();
    });
    assert.equal(exported,79);
    await pdf.locator(".wt-output-clear").click();
    assert.equal(await pdf.locator("#resultBox a").count(),0);
    console.log("PDF: lazy preview, parsed-source reuse, bounded URL cache, rotate/remove/export: PASS");

    // Denied localStorage must not prevent any tool from starting.
    const denied=await browser.newContext({locale:"zh-CN"});
    await denied.addInitScript(() => { Object.defineProperty(window,"localStorage",{get(){throw new DOMException("Denied","SecurityError")}}); });
    const dp=await denied.newPage();
    dp.on("pageerror",error=>errors.push(error.message));
    const folders=["","audio-processing","video-processing","image-to-pdf","image-processing","password-generator","real-time-data-unit-converter"];
    for(const folder of folders) {
      await dp.goto(base + (folder ? "/"+folder+"/"+folder+".html" : "/index.html"));
      await dp.locator('.language [data-lang="en"]').click();
      assert.equal(await dp.locator("html").getAttribute("lang"),"en",folder+JSON.stringify(errors));
      await dp.locator("#themeButton").click();
      for(const width of [1920,1366,760,390]) {
        await dp.setViewportSize({width,height:900});
        assert.ok(await dp.evaluate(() => document.documentElement.scrollWidth <= innerWidth),folder+" overflow "+width);
      }
    }
    await denied.close();
    // Cross-tab updates must clear the in-memory preference override.
    await page.reload();
    await page.locator('.language [data-lang="zh"]').click();
    await pdf.locator('.language [data-lang="en"]').click();
    await page.waitForFunction(() => document.documentElement.lang === "en");
    console.log("Preferences: denied storage, cross-tab sync; all seven pages responsive: PASS");
    assert.deepEqual(errors,[]);
  } finally { await context.close();await browser.close();server.close(); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

// Shared local FFmpeg worker. Kept in one script so file:// pages need no fetch.
(function (global: any) {
  "use strict";

  function workerMain() {
    var scope: any = self;
    var core: any;
    var mounts = new Map<string, string>();
    var mountId = 0;
    var logger: any = null;
    var expectedDuration = 0;
    var durationScale = 1;
    var lastProgress = 0;
    var logQueue: any[] = [];
    var lastLog = 0;
    function flushLogs() {
      if (logQueue.length) scope.postMessage({ event: "logs", data: logQueue.splice(0) });
      lastLog = Date.now();
    }
    function progress(time: number) {
      if (Date.now() - lastProgress < 100) return;
      lastProgress = Date.now();
      scope.postMessage({ event: "progress", data: {
        time: time,
        ratio: expectedDuration > 0 ? Math.min(0.99, Math.max(0, time / expectedDuration)) : null
      } });
    }
    function seconds(text: string) {
      return text.split(":").reduce(function (sum, part) { return sum * 60 + Number(part); }, 0);
    }
    function onLog(event: any) {
      if (!event || !event.message) return;
      if (logger) logger(event);
      var duration = /Duration:\s*(\d+:\d+:\d+(?:\.\d+)?)/.exec(event.message);
      if (!expectedDuration && duration) expectedDuration = seconds(duration[1]) / durationScale;
      var time = /time=\s*(\d+:\d+:\d+(?:\.\d+)?)/.exec(event.message);
      if (time) progress(seconds(time[1]));
      logQueue.push(event);
      if (logQueue.length >= 50 || Date.now() - lastLog >= 150) flushLogs();
    }
    function unlink(path: string) {
      var mount = mounts.get(path);
      if (mount) {
        core.FS.unlink(path);
        core.FS.unmount(mount);
        core.FS.rmdir(mount);
        mounts.delete(path);
      } else {
        try { core.FS.unlink(path); } catch (_) {}
      }
    }
    async function dispatch(method: string, args: any[]) {
      if (method === "load") {
        var scriptUrl = URL.createObjectURL(new Blob([args[0]], { type: "text/javascript" }));
        try {
          scope.importScripts(scriptUrl);
          core = await scope.createFFmpegCore({ wasmBinary: args[1] });
          core.setLogger(onLog);
          core.setProgress(function (event: any) { progress(Number(event.time) / 1000000); });
        } finally { URL.revokeObjectURL(scriptUrl); }
        return true;
      }
      if (method === "input") {
        var path = args[0], file = args[1];
        unlink(path);
        // WORKERFS reads the File on demand, without a full input byte copy.
        if (core.FS.filesystems && core.FS.filesystems.WORKERFS) {
          var mount = "/source-" + (++mountId);
          core.FS.mkdir(mount);
          try {
            core.FS.mount(core.FS.filesystems.WORKERFS, { blobs: [{ name: "input", data: file }] }, mount);
            core.FS.symlink(mount + "/input", path);
            mounts.set(path, mount);
            return "WORKERFS";
          } catch (error) {
            try { core.FS.unmount(mount); } catch (_) {}
            try { core.FS.rmdir(mount); } catch (_) {}
            throw error;
          }
        }
        // Older imported cores: read inside the worker and let MEMFS own the bytes.
        var bytes = new Uint8Array(await file.arrayBuffer());
        core.FS.writeFile(path, bytes, { canOwn: true });
        return "MEMFS";
      }
      if (method === "unlink") { unlink(args[0]); return; }
      if (method === "write") { core.FS.writeFile(args[0], args[1]); return; }
      if (method === "stat") return { size: core.FS.stat(args[0]).size };
      if (method === "blob") {
        var data = core.FS.readFile(args[0]);
        return new Blob([data], { type: args[1] });
      }
      if (method === "reset") { core.reset(); return; }
      if (method === "probe" || method === "probeFallback") {
        var lines: string[] = [];
        logger = function (event: any) {
          if (method === "probeFallback" || event.type === "stdout") lines.push(event.message);
        };
        try {
          core.reset();
          var ret = method === "probe" ? core.ffprobe.apply(core, args[0]) : core.exec("-hide_banner", "-i", args[0]);
          if (ret && !lines.length) throw new Error("FFprobe exited with code " + ret);
          return lines.join("\n");
        } finally { logger = null; core.reset(); }
      }
      if (method === "exec") {
        var command = args[0];
        durationScale = args[1] || 1;
        expectedDuration = 0;
        lastProgress = 0;
        var limitIndex = command.lastIndexOf("-t");
        var endIndex = command.lastIndexOf("-to");
        var startIndex = command.lastIndexOf("-ss");
        if (limitIndex >= 0) expectedDuration = seconds(command[limitIndex + 1]);
        else if (endIndex >= 0) expectedDuration = seconds(command[endIndex + 1]) - (startIndex >= 0 ? seconds(command[startIndex + 1]) : 0);
        // Custom filters/timestamp options may change duration unpredictably.
        // The caller can request indeterminate progress by passing scale = null.
        var unknown = args[1] === null || command.indexOf("-f") >= 0 && command[command.indexOf("-f") + 1] === "concat";
        if (unknown) { expectedDuration = -1; }
        core.reset();
        // ffprobe can leave process-wide log/stats settings behind in this core.
        var code = core.exec.apply(core, ["-nostdin", "-y", "-loglevel", "info", "-stats"].concat(command));
        core.reset();
        if (code !== 0) throw new Error("FFmpeg exited with code " + code);
        return;
      }
      throw new Error("Unknown media worker operation: " + method);
    }
    // Serialize RPCs even when reading a Blob asynchronously.
    var queue = Promise.resolve();
    scope.onmessage = function (event: MessageEvent) {
      var message = event.data;
      queue = queue.then(async function () {
        try {
          var result = await dispatch(message.method, message.args);
          flushLogs();
          scope.postMessage({ id: message.id, result: result });
        } catch (error) {
          flushLogs();
          scope.postMessage({ id: message.id, error: error.message || String(error) });
        }
      });
    };
  }

  function create(options: any) {
    var url = URL.createObjectURL(new Blob(["(" + workerMain.toString() + ")()"], { type: "text/javascript" }));
    var worker = new Worker(url);
    URL.revokeObjectURL(url);
    var nextId = 0;
    var pending = new Map<number, any>();
    var stopped = false;
    function terminate(error?: Error) {
      stopped = true;
      worker.terminate();
      pending.forEach(function (entry) { entry.reject(error || new DOMException("Cancelled", "AbortError")); });
      pending.clear();
    }
    worker.onerror = function (event) { event.preventDefault(); terminate(new Error(event.message || "Media worker failed")); };
    worker.onmessageerror = function () { terminate(new Error("Unable to read media worker response")); };
    worker.onmessage = function (event) {
      if (stopped) return;
      var message = event.data;
      if (message.event === "logs") { message.data.forEach(function (entry: any) { options.log(entry.message); }); return; }
      if (message.event === "progress") { options.progress(message.data); return; }
      var entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error));
      else entry.resolve(message.result);
    };
    function call(method: string, args: any[] = [], transfer: Transferable[] = []) {
      if (stopped) return Promise.reject(new DOMException("Cancelled", "AbortError"));
      return new Promise<any>(function (resolve, reject) {
        var id = ++nextId;
        pending.set(id, { resolve: resolve, reject: reject });
        try { worker.postMessage({ id: id, method: method, args: args }, transfer); }
        catch (error) { pending.delete(id); reject(error); }
      });
    }
    return {
      load: function (script: any, wasm: any) { return call("load", [script, wasm], wasm instanceof ArrayBuffer ? [wasm] : []); },
      input: function (path: string, file: File) { return call("input", [path, file]); },
      reset: function () { return call("reset"); },
      exec: function (args: string[], scale: number | null) { return call("exec", [args, scale]); },
      probe: function (args: string[]) { return call("probe", [args]); },
      probeFallback: function (path: string) { return call("probeFallback", [path]); },
      blob: function (path: string, mime: string) { return call("blob", [path, mime]); },
      FS: {
        unlink: function (path: string) { return call("unlink", [path]); },
        writeFile: function (path: string, data: any) { return call("write", [path, data]); },
        stat: function (path: string) { return call("stat", [path]); }
      },
      terminate: terminate
    };
  }
  global.WebToolsMediaEngine = { create: create };
})(window);

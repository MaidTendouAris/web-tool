# 音视频与资源回归测试

普通使用无需安装依赖或执行构建。以下命令仅用于开发验证。

## 类型和语法检查

需要 TypeScript 6（本次使用 6.0.3）。从仓库根目录执行：

~~~powershell
tsc --ignoreConfig --noEmit --target ES2020 --module none --ignoreDeprecations 6.0 --lib 'DOM,ES2020' --strict false shared-controls.ts shared-resources.ts index.ts image-to-pdf/image-to-pdf.ts shared-media-engine.ts audio-processing/audio-processing.ts video-processing/video-processing.ts
node --check shared-media-engine.js
node --check shared-controls.js
node --check audio-processing/audio-processing.js
node --check video-processing/video-processing.js
git diff --check
~~~

同步 JavaScript 时移除上述 TypeScript 命令中的 --noEmit。全项目类型检查另有图片处理和单位转换文件的既有错误；这些不属于本次音视频改动。

## 真实浏览器回归

需要 Node.js、Playwright、JSZip，以及 Edge。测试不自动下载依赖或 FFmpeg，使用与主页资源管理器相同的 @ffmpeg/core 0.12.10 UMD 核心文件。

将 ffmpeg-core.js 与 ffmpeg-core.wasm 放入一个本地目录，然后运行：

~~~powershell
$env:FFMPEG_CORE_DIR = 'D:\test-resources\ffmpeg'
node tests/media-processing.cjs
~~~

Playwright 和 JSZip 默认通过 Node 模块解析加载；若安装在别处，可分别将 PLAYWRIGHT_MODULE 和 JSZIP_MODULE 设置为对应模块目录的绝对路径。BROWSER_CHANNEL 默认为 msedge，也可设置为 chrome。

测试会启动临时本地 HTTP 服务和无头浏览器，使用隔离浏览器上下文，不访问日常浏览器缓存。生成素材在系统临时目录内，成功后自动清理；失败时打印保留目录的位置。

覆盖内容：

- 真实音频转换、裁剪、元数据读写、增益、变速和批量输出。
- JSZip 独立校验批量 ZIP 的条目和 CRC。
- 视频元数据、转封装、音频提取、裁剪、变速、GIF、拼接。
- 变速过程中出现中间百分比，主线程定时器继续运行，取消后重试。
- 错误参数导致失败后可继续新任务。
- 1920、1366、760、390px 下两页无横向溢出。
- file:// 直接打开页面后正常加载 Blob Worker 和本地核心。
- 320 MiB 填充 MP4 的 WORKERFS 读取、转封装，以及模拟缺少 WORKERFS 的核心回退路径。

大文件用例在短 MP4 后追加合法 free box，仅验证大输入读取和转封装，不代表长视频或高分辨率重编码的内存上限。


## 资源卡片回归

运行以下测试需要 Playwright 和 pdf-lib（开发测试依赖）。默认使用已安装的 Edge：

~~~powershell
node tests/resources.cjs
~~~

Playwright 可通过 PLAYWRIGHT_MODULE 指定模块路径。PDF_LIB_JS 可指定 pdf-lib.min.js 的绝对路径；省略时从已安装的 pdf-lib 包读取。RESOURCE_SCREENSHOT_DIR 为可选截图输出目录。

该测试拦截 CDN 请求以稳定模拟下载成功和失败，验证缺失、部分缓存、重试、事务中止、跨页同步、本地导入、旧无 keyPath 缓存、存储权限错误、file:// 下载，以及真实 PDF 自动加载与生成。三工具页检查 1920、1366、760、390px 和中英文、主题切换。

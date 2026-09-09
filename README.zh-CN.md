[English](./README.md)    [中文](./README.zh-CN.md)

# web-tools (中文)

web-tools 是一个只依赖浏览器的本地工具集合。项目没有后端，也不要求启动服务器；在现代浏览器中打开 `index.html` 即可使用。

应用会在浏览器本地处理用户文件。图片、数据和音视频输入不会被本项目上传到远程服务。

该项目已托管至Github Pages，你可以访问该链接直接使用

https://maidtendouaris.github.io/web-tools/

## 使用要求

- 现代浏览器（建议使用 Chrome、Edge、Firefox 最新版本）。
- 只有修改源码时才需要 TypeScript。
- 音频和视频处理需要 FFmpeg.wasm 核心文件：
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`
- PDF 工具需要 pdf-lib 静态文件：
  - `pdf-lib.min.js`

音频、视频和 PDF 页顶部的“本地资源”卡片会自动检查浏览器缓存。缺失时可直接下载缺失资源或导入文件，无需返回主页；处理时会自动加载运行库。主页顶部也提供“资源管理”入口，用于集中导入、下载和清理缓存。

## 本地运行

直接用浏览器打开 `index.html`。

普通使用不需要安装依赖。

## 音视频处理与进度

音频和视频共用独立 Worker 中的 FFmpeg 引擎，以及共享进度条。界面显示加载、读取、处理、导出和结束状态，批量音频显示当前文件序号；处理中可取消。百分比依据媒体时间估算，变速会调整预期输出时长。无法确定时长（例如部分拼接或自定义时间滤镜）时显示不定进度；只有输出准备完成才显示 100%。

支持 WORKERFS 的核心会按需读取输入文件，避免完整复制输入到内存；引擎也保留缺少 WORKERFS 时在 Worker 内使用内存文件系统的回退路径。任务结束、失败或取消后会销毁引擎，下次处理从本地缓存重新加载。输出仍需要浏览器内存，因此超大输出或高分辨率重编码仍可能失败。

批量音频 ZIP 使用分块校验和 Blob 组合，单文件继续直接下载。超过 32 MiB、超过 5 分钟或无法读取时长的音频跳过全量波形解码，仍可使用浏览器支持的播放预览和 FFmpeg 处理。

开发验证见 [音视频回归测试](tests/README.md)。

## 许可证

本仓库自有源码使用 MIT 许可证。见 [LICENSE](./LICENSE)。

通过资源管理加载的可选运行时文件，包括 FFmpeg.wasm 和 pdf-lib 资源，仍遵循其各自许可证。见
[THIRD_PARTY_NOTICES.md](./docs/THIRD_PARTY_NOTICES.md)。

## 开发验证

运行 npm ci 和 npm run check 可执行全项目类型、普通脚本及 TS/JS 同步检查；用户使用页面仍无需构建。参见[测试说明](./tests/README.md)和[性能与资源管理说明](./docs/OPTIMIZATION.md)。

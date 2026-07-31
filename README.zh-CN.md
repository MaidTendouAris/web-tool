[English](./README.md)    [中文](./README.zh-CN.md)

# web-tools (中文)

web-tools 是一个只依赖浏览器的本地工具集合。项目没有后端，也不要求启动服务器；在现代浏览器中打开 `index.html` 即可使用。

应用会在浏览器本地处理用户文件。图片、数据和音视频输入不会被本项目上传到远程服务。

该项目已托管至Github Pages，你可以访问该链接直接使用

https://maidtendouaris.github.io/web-tools/

## 使用要求

- 现代浏览器（建议使用 Chrome、Edge、Firefox 最新版本）。
- 只有修改源码时才需要 TypeScript。
- 视频处理需要 FFmpeg.wasm 核心文件：
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`
- PDF 工具需要 pdf-lib 静态文件：
  - `pdf-lib.min.js`

请在 `index.html` 的"资源管理"区域中导入本地运行文件，或下载到 IndexedDB 浏览器缓存。完成后，工具会自动加载缓存中的运行库。

## 本地运行

直接用浏览器打开 `index.html`。

普通使用不需要安装依赖。

## 许可证

本仓库自有源码使用 MIT 许可证。见 [LICENSE](./LICENSE)。

通过资源管理加载的可选运行时文件，包括 FFmpeg.wasm 和 pdf-lib 资源，仍遵循其各自许可证。见
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

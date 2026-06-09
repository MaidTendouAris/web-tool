# Web Tool

Web Tool is a browser-only collection of small utilities. It has no backend and no required server runtime: open `index.html` in a modern browser and the tools run locally.

The project keeps user files in the browser session. Image, data, and media inputs are not uploaded to a remote service by this application.

## Features

- Tool launcher with search, English and Chinese UI, system-language default, and manual language switching.
- Light and dark themes, following the system theme by default with a manual toggle.
- Resource Management for importing or downloading FFmpeg.wasm assets into browser cache.
- Image Processing: crop, stitch, and compress images with local preview and export.
- Data Unit Converter: convert common storage and transfer-rate units.
- Video Processing: read metadata, extract audio, remux containers, clip video ranges, stitch compatible videos, and generate GIFs with preview timelines.

## Requirements

- A modern desktop browser.
- TypeScript only when editing source files.
- FFmpeg.wasm core files for video processing:
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`

The repository does not include or depend on a `resources` directory. Use the Resource Management section on `index.html` to import local FFmpeg files or download them into IndexedDB browser cache. After that, the video tool loads the cached core automatically.

## Run Locally

Open `index.html` directly in your browser.

No install step is required for normal use.

## Development

The TypeScript source files are committed together with their compiled JavaScript files so the pages can run directly from the filesystem.

After editing TypeScript, compile the matching browser JavaScript:

```powershell
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\index.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\image-processing\image-processing.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\real-time-data-unit-converter\real-time-data-unit-converter.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\video-processing\video-processing.ts
```

For a quick type check:

```powershell
tsc --ignoreConfig --noEmit --strict false --noImplicitAny false --target ES2020 --module ES2020 --lib DOM,ES2020 .\index.ts .\image-processing\image-processing.ts .\real-time-data-unit-converter\real-time-data-unit-converter.ts .\video-processing\video-processing.ts
```

## Repository Notes

- FFmpeg.wasm runtime files are not vendored in this repository.
- Video processing expects `ffmpeg-core.js` and `ffmpeg-core.wasm` to be present in browser cache, managed from the entry page.
- This workspace currently does not require a package manager, bundler, or web server.

## License

MIT. See [LICENSE](./LICENSE).

---

# Web Tool (中文)

Web Tool 是一个只依赖浏览器的本地工具集合。项目没有后端，也不要求启动服务器；在现代浏览器中打开 `index.html` 即可使用。

应用会在浏览器本地处理用户文件。图片、数据和音视频输入不会被本项目上传到远程服务。

## 功能

- 带搜索的工具入口，支持中英文界面，默认跟随系统语言，也可手动切换。
- 亮色和黑色主题，默认跟随系统主题，也可手动切换。
- 资源管理：将 FFmpeg.wasm 资源导入或下载到浏览器缓存。
- 图片处理：裁剪、拼接、压缩，支持本地预览和导出。
- 数据单位转换：转换常见容量和传输速率单位。
- 视频处理：读取元数据、提取音频、转封装、截取片段、拼接兼容视频、生成 GIF，并支持预览时间轴。

## 使用要求

- 现代桌面浏览器。
- 只有修改源码时才需要 TypeScript。
- 视频处理需要 FFmpeg.wasm 核心文件：
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`

仓库不包含、也不依赖 `resources` 目录。请在 `index.html` 的“资源管理”区域中导入本地 FFmpeg 文件，或下载到 IndexedDB 浏览器缓存。完成后，视频处理工具会自动加载缓存中的本地核心。

## 本地运行

直接用浏览器打开 `index.html`。

普通使用不需要安装依赖。

## 开发

项目同时提交 TypeScript 源码和编译后的 JavaScript，这样页面可以直接从文件系统运行。

修改 TypeScript 后，请重新编译对应的 JavaScript 文件。命令见英文部分的 Development。

## 仓库说明

- 本仓库不内置 FFmpeg.wasm 运行文件。
- 视频处理需要先通过入口页将 `ffmpeg-core.js` 和 `ffmpeg-core.wasm` 放入浏览器缓存。
- 当前项目不依赖包管理器、打包器或 Web 服务器。

## 许可证

MIT。见 [LICENSE](./LICENSE)。

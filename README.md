[English](./README.md)    [中文](./README.zh-CN.md)

# web-tools

web-tools is a browser-only collection of local tools. The project has no backend and does not require starting a server; simply open `index.html` in a modern browser to use it.

The application processes user files locally in the browser. Images, data, and audio/video inputs are not uploaded to remote services by this project.

This project is hosted on GitHub Pages. You can visit the following link to use it directly:

https://maidtendouaris.github.io/web-tools/

## Requirements

- Modern browser (Chrome, Edge, or Firefox latest version recommended).
- TypeScript is only needed when modifying source code.
- Video processing requires FFmpeg.wasm core files:
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`
- PDF tools require the pdf-lib static file:
  - `pdf-lib.min.js`

Use the "Resource Management" section on `index.html` to import local runtime files or download them to the IndexedDB browser cache. Once done, the tools will automatically load the cached runtime libraries.

## Run Locally

Open `index.html` directly in your browser.

No dependency installation is required for normal use.

## License

This repository's own source code is licensed under the MIT License. See [LICENSE](./LICENSE).

Optional runtime files loaded through Resource Management, including FFmpeg.wasm and pdf-lib assets, remain governed by their own licenses. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

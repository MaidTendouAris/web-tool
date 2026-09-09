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

Download or import runtime files directly from each tool page, or use the homepage resource manager for centralized cache management.

## Run Locally

Open `index.html` directly in your browser.

No dependency installation is required for normal use.

## Local resources

Audio, video, and PDF pages check cached resources automatically. Their Local resources cards can download missing assets or import local files directly; runtimes load automatically when processing starts. The homepage also has a top navigation shortcut to centralized resource management, including cache removal.

## Media processing and progress

Audio and video share a dedicated FFmpeg Worker and a shared progress component. The UI reports loading, reading, processing, export, and terminal states, with a current-file count for audio batches and a cancel button. Percentages are estimates based on media time, adjusted for speed changes. Unknown durations (including some concatenation or custom timestamp filters) use indeterminate progress. Only a prepared output reaches 100%.

Cores with WORKERFS read input files on demand without copying the whole input into memory. The engine also has an in-worker memory-filesystem fallback for cores without WORKERFS. The engine is terminated after success, failure, or cancellation; subsequent tasks reload it from the local cache. Outputs still require browser memory, so very large outputs or demanding re-encoding can still fail.

Audio ZIP batches use chunked checksums and Blob composition; single outputs remain direct downloads. Full waveform decoding is skipped for audio over 32 MiB, over five minutes, or with an unknown duration. Browser-supported playback and FFmpeg processing remain available.

See [media regression tests](tests/README.md) for development checks.

## License

This repository's own source code is licensed under the MIT License. See [LICENSE](./LICENSE).

Optional runtime files loaded through Resource Management, including FFmpeg.wasm and pdf-lib assets, remain governed by their own licenses. See [THIRD_PARTY_NOTICES.md](./docs/THIRD_PARTY_NOTICES.md).

## Development

Run npm ci and npm run check for full type, classic-script and TS/JS parity checks. User-facing pages still require no build. See [test instructions](./tests/README.md) and [performance and resource notes](./docs/OPTIMIZATION.md).

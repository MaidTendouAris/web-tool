# Third-Party Notices

This repository's own source code is licensed under the MIT License. See
[LICENSE](./LICENSE).

Some tools can load optional third-party runtime files from the browser cache.
Those runtime files are not vendored in this repository. They are imported by
the user or downloaded from the Resource Management panel on `index.html`, and
they remain governed by their own licenses.

This notice is informational and is not legal advice.

## Runtime Assets

| Component | Files used by this project | Purpose | License | Source |
| --- | --- | --- | --- | --- |
| `@ffmpeg/core` / FFmpeg.wasm | `ffmpeg-core.js`, `ffmpeg-core.wasm` | Browser-local audio and video processing | `GPL-2.0-or-later` as declared by `@ffmpeg/core`; FFmpeg itself may be LGPL or GPL depending on build configuration | [`@ffmpeg/core`](https://github.com/ffmpegwasm/ffmpeg.wasm), [FFmpeg legal](https://ffmpeg.org/legal.html) |
| `pdf-lib` | `pdf-lib.min.js` | Browser-local PDF generation and editing | MIT | [`pdf-lib`](https://github.com/Hopding/pdf-lib) |

## Download URLs Used By Resource Management

- `ffmpeg-core.js`: <https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.10/umd/ffmpeg-core.js>
- `ffmpeg-core.wasm`: <https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm>
- `pdf-lib.min.js`: <https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js>

## Notes For Redistribution

- The MIT License in this repository applies to this project's own source code.
- Third-party runtime files keep their original licenses, even when imported or
  cached through this project.
- If you redistribute, bundle, mirror, or modify `ffmpeg-core.js` or
  `ffmpeg-core.wasm`, review the applicable GPL/LGPL obligations for that
  distribution.
- If you redistribute or bundle `pdf-lib.min.js`, include its MIT license notice.

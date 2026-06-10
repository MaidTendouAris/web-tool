[English](./README.md)    [中文](./README.zh-CN.md)

# web-tools

web-tools is a browser-only collection of small utilities. It has no backend and no required server runtime: open `index.html` in a modern browser and the tools run locally.

The project keeps user files in the browser session. Image, data, and media inputs are not uploaded to a remote service by this application.

This project has been hosted on GitHub Pages; you can visit the link to use it directly.

https://maidtendouaris.github.io/web-tools/

## Features

- Tool launcher with search, English and Chinese UI, system-language default, and manual language switching.
- Light and dark themes, following the system theme by default with a manual toggle.
- Resource Management for importing or downloading runtime libraries into browser cache.
- Password Generator: generate local random passwords and passphrases with length, character-set, similar-character exclusion, batch output, strength hints, and copy controls.
- Image Processing: crop, stitch, and compress images with local preview and export.
- Images to PDF: convert JPG/PNG images into a PDF with drag sorting, page sizing, fit modes, margins, and local download.
- Audio Processing: convert MP3/AAC/OGG/M4A and other formats, trim ranges, remux, edit metadata, preview waveforms, and apply gain.
- Data Unit Converter: convert common storage and transfer-rate units.
- Video Processing: read metadata, extract audio, remux containers, clip video ranges, stitch compatible videos, and generate GIFs with preview timelines.

## Requirements

- A modern desktop browser.
- TypeScript only when editing source files.
- FFmpeg.wasm core files for video processing:
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`
- pdf-lib static file for image-to-PDF generation:
  - `pdf-lib.min.js`

The repository does not include or depend on a `resources` directory. Use the Resource Management section on `index.html` to import local runtime files or download them into IndexedDB browser cache. After that, tools load cached libraries automatically.

## Run Locally

Open `index.html` directly in your browser.

No install step is required for normal use.

## Development

The TypeScript source files are committed together with their compiled JavaScript files so the pages can run directly from the filesystem.

After editing TypeScript, compile the matching browser JavaScript:

```powershell
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\index.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\audio-processing\audio-processing.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\image-to-pdf\image-to-pdf.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\image-processing\image-processing.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\real-time-data-unit-converter\real-time-data-unit-converter.ts
tsc --ignoreConfig --target ES2020 --module none --ignoreDeprecations 6.0 --lib DOM,ES2020 --strict false --noImplicitAny false .\video-processing\video-processing.ts
```

For a focused type check, pass the files you are editing. Example:

```powershell
tsc --ignoreConfig --noEmit --strict false --noImplicitAny false --target ES2020 --module ES2020 --lib DOM,ES2020 .\index.ts .\audio-processing\audio-processing.ts .\image-to-pdf\image-to-pdf.ts
```

## Repository Notes

- FFmpeg.wasm and pdf-lib runtime files are not vendored in this repository.
- Video processing expects `ffmpeg-core.js` and `ffmpeg-core.wasm` to be present in browser cache, managed from the entry page.
- Audio processing expects `ffmpeg-core.js` and `ffmpeg-core.wasm` to be present in browser cache, managed from the entry page.
- Image-to-PDF generation expects `pdf-lib.min.js` to be present in browser cache, managed from the entry page.
- This workspace currently does not require a package manager, bundler, or web server.

## License

MIT. See [LICENSE](./LICENSE).

---

## 中文文档

[中文文档](./README.zh-CN.md)

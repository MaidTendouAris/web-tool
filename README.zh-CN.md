[English](./README.md)    [中文](./README.zh-CN.md)

# web-tools (中文)

web-tools 是一个只依赖浏览器的本地工具集合。项目没有后端，也不要求启动服务器；在现代浏览器中打开 `index.html` 即可使用。

应用会在浏览器本地处理用户文件。图片、数据和音视频输入不会被本项目上传到远程服务。

该项目已托管至Github Pages，你可以访问该链接直接使用

https://maidtendouaris.github.io/web-tools/

## 功能

- 带搜索的工具入口，支持中英文界面，默认跟随系统语言，也可手动切换。
- 亮色和黑色主题，默认跟随系统主题，也可手动切换。
- 资源管理：将额外运行库导入或下载到浏览器缓存。
- 密码生成器：在本地生成随机密码和密码短语，支持长度、字符集、排除相似字符、批量生成、强度提示和复制。
- 图片处理：裁剪、拼接、压缩，支持本地预览和导出。
- 图片转 PDF：将 JPG/PNG 图片按拖拽排序合成为 PDF，支持页面尺寸、适配方式、边距和本地下载。
- 音频处理：支持 MP3/AAC/OGG/M4A 等格式转换、片段裁剪、转封装、元数据编辑、波形预览和音量增益。
- 数据单位转换：转换常见容量和传输速率单位。
- 视频处理：读取元数据、提取音频、转封装、截取片段、拼接兼容视频、生成 GIF，并支持预览时间轴。

## 使用要求

- 现代桌面浏览器。
- 只有修改源码时才需要 TypeScript。
- 视频处理需要 FFmpeg.wasm 核心文件：
  - `ffmpeg-core.js`
  - `ffmpeg-core.wasm`
- 图片转 PDF 需要 pdf-lib 静态文件：
  - `pdf-lib.min.js`

仓库不包含、也不依赖 `resources` 目录。请在 `index.html` 的"资源管理"区域中导入本地运行文件，或下载到 IndexedDB 浏览器缓存。完成后，工具会自动加载缓存中的运行库。

## 本地运行

直接用浏览器打开 `index.html`。

普通使用不需要安装依赖。

## 开发

项目同时提交 TypeScript 源码和编译后的 JavaScript，这样页面可以直接从文件系统运行。

修改 TypeScript 后，请重新编译对应的 JavaScript 文件。命令见 [英文文档的 Development 部分](./README.md#development)。

## 仓库说明

- 本仓库不内置 FFmpeg.wasm 或 pdf-lib 运行文件。
- 视频处理需要先通过入口页将 `ffmpeg-core.js` 和 `ffmpeg-core.wasm` 放入浏览器缓存。
- 音频处理需要先通过入口页将 `ffmpeg-core.js` 和 `ffmpeg-core.wasm` 放入浏览器缓存。
- 图片转 PDF 需要先通过入口页将 `pdf-lib.min.js` 放入浏览器缓存。
- 当前项目不依赖包管理器、打包器或 Web 服务器。

## 许可证

MIT。见 [LICENSE](./LICENSE)。

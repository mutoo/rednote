# mutoo 的工具收藏夹

用 Astro 构建的中文工具索引页，包含响应式布局、关键词搜索、分类筛选和保存在浏览器本地的收藏。

网站：<https://rednote.mutoo.im>

```sh
npm install
npm run dev
```

开发地址：`http://localhost:4321`。

```sh
npm run check
npm run build
npm run preview
```

构建产物在 `dist/`，可部署到任意静态网站托管服务。

## 发布

推送到 `main` 后，GitHub Actions 会安装依赖、进行类型检查、构建并发布到 GitHub Pages。

- 仓库：<https://github.com/mutoo/rednote>
- 自定义域名：`rednote.mutoo.im`
- DNS：`rednote.mutoo.im` 的 CNAME 指向 `mutoo.github.io`

域名同时配置在 `astro.config.mjs` 和 `public/CNAME` 中。

## 添加工具

编辑 `src/data/tools.ts` 中的 `tools` 数组，填写标题、描述、链接、标签和搜索关键词，数量与筛选结果会自动更新。8558 计算器使用专属插画，其他工具会自动使用通用预览，也可以在 `src/components/ToolCard.astro` 中定制。

收藏仅保存在当前浏览器的 localStorage 中，不需要账号或后端。

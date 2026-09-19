# Sanity 内容编辑入口

在本地运行网站后，进入 http://localhost:3001/studio 。

| 内容 | 后台位置 | 编辑范围 |
| --- | --- | --- |
| 首页品牌介绍 | Home Page → Brand Value | 小标题、标题（支持换行）、正文、按钮文字 |
| 首页底部 CTA | Home Page → Bottom CTA / Location / Inquiry | 标题、正文及按钮文字 |
| 素材常见问题 | Material → 对应素材 → Frequently Asked Questions | English / Japanese 分开编辑问题、回答和相关链接；可排序、增删 |
| 新闻 | News → 对应新闻 → Article Content | 英日正文、开场段落、分节标题、段落、图片、视频及相关链接 |
| 下载中心 | Download Center → Download Center | 页面文字、分组、文件标题、说明、顺序及文件 |
| 产品详情下载资料 | Product Type → 对应系列 → Downloads | 此系列详情页的资料及说明；与下载中心列表分别管理 |

新闻使用 Published Languages 控制发布语言。现有 4 篇新闻已完整迁移英日正文。旧 Legacy Body 不再用于前台。

现有图片、视频和 PDF 保留原路径；在新字段上传替换资源后，上传的 Sanity 资源优先。编辑说明不需要重新上传文件。媒体原路径仍由当前网站托管，迁移不是将所有媒体重新上传到 Sanity。

FAQ 删除全部条目后，该语言的 FAQ 区块会隐藏。新闻正文清空后，不会重新加载旧的本地正文。下载分组和文件可删除，前台不会自动补回旧条目。

## 国际市场和原厂色名

- Product Type 的 Target Markets 决定日文校验：仅 Global 的内容不因日文为空而报错；包含 Japan 时检查核心名称、摘要和 SEO 的日文。
- SKU 依据它关联的 Product Type 判断市场，不需要重复填写市场。
- Manufacturer Colour Name 的 English 保存原厂名称；Japanese 是可选别名。没有日文别名时，前台显示原厂名，不自动翻译色名或改动代码。
- 现有市场范围及 skai 英文专属详情路由保持不变。要将英文专属产品扩展到日本市场，还需要安排正式翻译并调整该系列的路由范围。

## 本次迁移与上线状态

2026-09-16 迁移了 31 份文档，包含首页的发布内容和既有草稿、4 类素材 FAQ、4 篇双语新闻、下载中心 29 个文件条目及 19 个产品系列的下载资料（另保留既有产品草稿）。草稿仍为草稿。

Sanity 数据已保存，本地前台已接入。代码尚未提交、推送或部署；线上后台新增字段和完整前台行为需要部署本轮代码后生效。

迁移脚本：`scripts/migrateEditorialContent.mjs`，默认仅预览计划，`--apply` 执行。脚本保留备份并防止重复覆盖编辑。

本次备份：`outputs/cms-editorial-migration/1789569327716/`，包含 `before.json`、`expected.json`、`after.json` 和 `plan.json`。

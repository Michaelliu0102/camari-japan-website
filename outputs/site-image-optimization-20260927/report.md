# 图片优化与验证 — 2026-09-27

已完成本地代码优化，尚未部署预览站或正式站。原始文件和 Sanity 原始素材均保留。

## 改动

- 材料 HERO、材料介绍、Aquapelle 应用卡片、Fabric 花纹库、About 图片、材料总览图片、产品列表与详情轮播统一使用已有 `EditorialImage` 响应式加载。
- 扩展图片组件的优先加载、样式和尺寸支持。HERO 的预加载与实际图片使用相同的 `srcset`、`sizes`，浏览器只选择需要的尺寸。卡片默认延迟加载。
- 全屏 HERO 按 `object-cover` 的放大比例选择尺寸，避免手机竖屏只按屏宽取图造成纹理模糊；HERO 最大宽度为 1920，产品详情仍可选择 2560。
- 材料总览的 CSS 背景图改为响应式图片，保留原布局、居中裁切、遮罩与 hover 动效。
- Fabric 页面发现 72 个旧本地图片路径，已在服务端解析到对应的 Sanity 原素材。完整媒体清单留在服务端，浏览器只接收该页使用的图片地址。
- 中国站保留既有图片加载路径；本轮没有部署或实测中国站。

实现依据：[React 响应式图片预加载](https://react.dev/reference/react-dom/preload)、[Sanity 图片变换](https://www.sanity.io/docs/apis-and-sdks/image-urls)。Sites 关闭 Next 图片优化，故继续使用项目已有的直接 CDN 响应式图片方案。

## 实测下载体积

原图数字来自上一轮线上检查，优化后数字来自本地页面使用真实 Sanity CDN 的响应。桌面 1440×1000、DPR 1，禁用浏览器缓存。以下为同一素材的实际响应字节，使用十进制 KB/MB；并非整页加载时间或 LCP。

| 图片 | 优化前 | 优化后 | 减少 |
| --- | ---: | ---: | ---: |
| Alcantara HERO | 186,473 B | 114,498 B | 38.6% |
| Fabric HERO | 983,702 B | 361,342 B | 63.3% |
| Leather HERO | 2,057,280 B | 118,452 B | 94.2% |
| Aquapelle 卡片 | 2,285,594 B | 10,092 B | 99.6% |
| About 三张能力图片合计 | 3,183,766 B | 72,282 B | 97.7% |
| 材料总览 Vegan Leather 卡片 | 807,033 B | 13,325 B | 98.3% |
| Products Lumbar Cushion 卡片 | 415,173 B | 23,774 B | 94.3% |

Fabric 长列表的补充检查：本轮最初仍使用旧本地卡片原图时，桌面滚动检查记录到约 29.94 MB 图片响应；解析到响应式 CDN 后，逐张检查记录到约 2.30 MB，74 个页面图片元素均完成加载。该数字包含 HERO、卡片及其他已完成图片响应，统计方法见验证脚本；不包含视频、脚本或未知响应长度。

手机 Fabric HERO 最终在 390×844、DPR 2 下选择 1920 宽版本，实测 513,462 B AVIF。Sanity 可能先返回 WebP，再生成 AVIF，同尺寸 WebP 抽测为 839,684 B，下载量会因缓存和格式而变化。验证中发现 2560 宽版本曾达到 1.50 MB，故最终将 HERO 上限调整为 1920；该中间结果保留在日志中，不能用作最终版本的结果。

## 验证

- TypeScript、12 个相关源码文件 ESLint、`git diff --check` 通过。
- 21 项相关测试通过，包含图片来源一致性、裁切与焦点保留、尺寸上限、中国站旁路及现有 CMS/日文回归测试。
- 浏览器覆盖 14 个页面/视口场景，含英文材料页、About、材料总览、产品页、Tech Accessories、首页及日文手机 About。合并各场景最近一次完整检查后为 104 项通过，另有 Fabric 悬停与最终手机 HERO 检查。
- 检查预加载一致性、图片加载、横向溢出、错误覆盖层、产品筛选、产品详情打开/关闭。Fabric 悬停测试确认卡片主图采用 480 宽、预览缩略图采用 64 宽，移开鼠标后恢复。
- 人工查看桌面 HERO、About 图片、材料总览及手机 Fabric HERO 截图。最终手机纹理清晰度优于仅按视口宽度选图的中间版本。
- 本地服务器使用 `SITES_PREVIEW=1` 和真实 CMS。没有进行代码部署或正式环境速度验收；页面服务端响应等待未在本轮改动。

## 过程记录与限制

- 第一次减弱动效模拟出现 `MaterialIntroImage` 原有运动样式初始化的水合提示，日志保留在 `server.log`。正常动效场景未记录页面脚本或控制台错误。本轮未修改该动画初始化逻辑。
- Fabric 首轮快速滚动时部分延迟加载图片尚未触发，因此“全部加载”检查失败；随后逐张滚动检查全部成功，保留首次记录，不将未下载资源计入完整页面结果。
- 中间版本的手机整页记录包含尚未限制为 1920 的 HERO，不作为最终手机整页流量结论。最终手机 HERO 有独立验证。

## 证据

- [验证汇总](verification-summary.json)、[最终手机 HERO](mobile-fabric-final-hero.json)、[Fabric 完整检查](fabric-complete-verification.json)、[Fabric 悬停](fabric-hover.json)
- [测试日志](tests-final.log)、[类型检查](typecheck-final.log)、[ESLint](lint-final.log)
- [原图一致性](source-integrity.json)、[Fabric 原图一致性](fabric-source-integrity.json)
- [最终手机 HERO 截图](mobile-fabric-final-hero.png)、[About 截图](desktop_en_about-content.png)、[材料总览截图](desktop_en_materials-content.png)
- [前一轮线上检查](../site-image-audit-20260927/report.md)、[前一轮 HERO 检查](../material-hero-diagnosis-20260927/report.md)

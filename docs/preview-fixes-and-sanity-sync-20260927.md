# 2026-09-27 预览修复与 Sanity 同步记录

用户授权：提交并推送当前已确认修改，同步到 Sanity。未执行网站发布、正式域名切换、DNS、Nameserver、企业邮箱配置修改或真实邮件测试。

## 提交范围

- Aquapelle PDF、导入表及网页备用数据：断裂伸长率 Warp 80% / Weft 150%；保留克重的 `≥` 和室内/家具应用描述。
- PDF 下载使用普通文件链接，避免 Next.js 路由预取。
- 预览站防收录：构建开关与指定临时站 URL 同时匹配时启用页面及响应头 noindex；正式域名不自动启用。
- 指定重复案例合并，旧路径保留跳转映射；保留所选案例的 CMS 产品关联，避免重新合入错误 Board FR 链接。
- 增加案例专用产品名称字段，使 Chopper 可显示 MASTER FR 并链接 MASTER 系列。产品名称及关联由 CMS 管理。
- 社交占位入口按用户决定暂缓；I07 性能优化仍未完成。

## 已执行的 CMS 同步

项目 `bfjhbpbx`，数据集 `production`。事务：`aw6JmePse24U4FLmO8nOux`。

7 条案例记录已修正，涵盖同一案例的旧导入与现有目录变体：

| 案例 | 产品关联 / 名称 |
| --- | --- |
| Weimo Alcantara 1112 | PANNEL |
| Chopper Alcantara 6422 MasterFR | 名称 MASTER FR，链接 MASTER |
| HIBY Alcantara 3096TH | ALCANTARA 0.4 |
| Wallpanel Alcantara Master 4175 6408 | 仅 MASTER |
| Louis Vuitton Alcantara Master 1234 | 保留正确记录，其原有关联已是 MASTER |

4 条重复记录取消发布，并完整保存为 `drafts.<原记录 ID>`，附 `replacedBy` 指向保留记录：

| 取消发布的 slug | 保留的 slug |
| --- | --- |
| aston-martin-heritage-5362 | leather-aston-martin-heritage-5362 |
| leather-juguar-heritage-5365 | jaguar-heritage-5365 |
| alcantara-louis-vitton-alcantara-master-1234 | louis-vuitton-alcantara-master-1234 |
| alcantara-hd2 | hd2 |

操作前确认无文档引用这 4 条重复记录。写入使用文档版本检查与单个事务；回读比对全部 16 条目标记录，只有计划中的内容发生变化。未删除图片或 PDF 资产。

Aquapelle 已在先前事务 `6qWiA0jQuHjMAo5gW2KRaT` 同步，本次再次回读确认 80% / 150% 和修正版 PDF 资产 `a2e2e6ad517cd5e44a1a5dbf59bcdd9311c6d94b`。

## 验证与边界

- 本次：14 项回归测试通过；TypeScript 检查通过；相关文件 ESLint 通过。
- 实际 Sanity 已发布视图查询通过：4 条重复记录不可见、保留记录存在、修正关联与 MASTER FR 标签可读取。
- 先前 v22 本地生产构建：45 项 HTTP/浏览器检查、6 项案例截图检查通过。该结果属于当时的 v22；本次新增 CMS 字段通过上述查询与适配器回归检查，未重新声称完成公网浏览器验收。
- 临时站本轮未重新发布。CMS 内容可能随现有站缓存刷新而更新；新字段的显示、路径跳转和防收录代码需要网站后续部署才会完整生效。公开站未重新验收，不标记为通过。
- Sanity Studio 的新增字段定义已纳入代码，未单独发布 Studio。

本机证据（原始备份未纳入 Git）：

- `outputs/sanity-project-sync-20260927/before.json`：变更前完整记录。
- 同目录 `plan.json`、`receipt.json`、`after.json`、`result.json`：精确计划、事务回执及回读结果。
- 同目录 `published-projection.json`、`tests.log`、`typecheck.log`、`lint.log`：实际查询与代码检查。
- `outputs/preview-p2-fixes-20260927/report.md`：v22 本地浏览器报告及截图。
- `outputs/aquapelle-spec-correction-20260927/report.md`：PDF 修改及网页核对证据。

## 恢复说明

本次未执行回退。需要恢复时，先对比最新 `_rev`，避免覆盖后续编辑：对 7 条修正记录只还原计划涉及的字段；对 4 条归档记录依据 `before.json` 恢复原已发布文档，并审阅对应草稿。不得批量覆盖整个 CMS 数据集。恢复操作应保存新的事务记录。Git 回退与 CMS 内容恢复是两个独立操作。

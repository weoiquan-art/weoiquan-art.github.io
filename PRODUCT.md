# PRODUCT.md — JIN Personal Site

> 本文件是本站点的产品权威文档（源：jin-web-director Phase 1）。
> 占位符一律标注 `[PLACEHOLDER: ...]`，上线前必须替换为真实内容；绝不编造业务声明。

## 受众 (Audience)

- 想快速了解 JIN 这个人的人：潜在合作方、雇主、同行、新认识的伙伴
- 入口场景：名片式分享（聊天中发链接、社交媒体个人页、GitHub profile）

## 网站类型 (Surface type)

- 品牌/营销页 — 个人介绍页（编辑性更强，允许个性化表达与炫技交互）
- 非产品/应用页 — 无仪表盘、无状态管理

## 一句话承诺 (One-line promise)

面向想快速了解 JIN 的访客，通过个人介绍、AI 文凭与 skill 实践案例，帮助 TA 在 2–3 分钟内判断"JIN 是谁、能做什么、怎么联系"。

## 唯一主 CTA (Primary CTA)

**Get in touch**（联系我）— 全站唯一主行动，Hero 与 Contact 区块均指向它。
- 实现：`mailto:` 链接（占位）`[PLACEHOLDER: email 地址]`

## 现有证明材料 (Proof)

| 内容 | 状态 |
|---|---|
| 3 个 AI 文凭/证书 | `[PLACEHOLDER: 文凭名称、颁发机构、图片或 PDF]` |
| jin-web-director skill | ✅ 事实：GitHub 开源仓库，面向 Agent 的建站方法论，含 6 个 toolkit 文档 |
| GPT 制作 skill 的使用经验 | `[PLACEHOLDER: 使用经验文字]` |
| 个人介绍 / 经历 | `[PLACEHOLDER: 自我介绍、背景、正在做的事]` |
| 业务（轻量区块） | `[PLACEHOLDER: 能提供什么服务/合作方向]` |
| 联系方式 | `[PLACEHOLDER: email / 微信 / GitHub 链接]` |
| 头像或个人形象图 | `[PLACEHOLDER: 可选]` |

## 成功信号 (Success signals)

- 访客能不滚动完也至少完成：知道 JIN 是谁 + 看到一个记忆点
- 访客点击 Get in touch（主 CTA 点击）
- 线上 URL 可访问，移动端可读可用

## 本次范围 (In scope)

- 单页站点，英文为主，GitHub Pages 托管
- 炫技交互：Hero 交互式记忆点 + 滚动进入动效（有沟通职责、有降级）

## 明确排除 (Out of scope)

- 博客/文章系统、评论、搜索
- 表单后端（联系用 mailto）、统计脚本、广告
- 独立业务站（业务成熟后拆分）

## 信息架构 (Phase 2 — 章节大纲，每个区块均支撑主 CTA)

| # | 区块 | 目的 | 对主 CTA 的支撑 |
|---|------|------|----------------|
| 1 | Hero | 3 秒知道 JIN 是谁 + 终端打字记忆点 | Get in touch 按钮直达 |
| 2 | About | 快速了解背景 + 3 张真实文凭（receipts） | 建立信任与能力背书 |
| 3 | Currently | 正在做的事（活着的感觉） | 保持新鲜感 |
| 4 | Contact | email / Instagram / GitHub | CTA 落点 |
| — | Footer | 版权与 jin-web-director 链接 | 次要 |

删除项：博客、测试imonials、价格表——不支撑本次目标。Selected Work 于 v0.2.1 应作者要求删除（项目描述未定，宁缺毋滥）。

## 未知项 (Unknowns — 占位待补，不得编造)

- 真实姓名显示方式、自我介绍文案、文凭细节、联系方式、业务描述

# CHANGELOG.md — JIN Personal Site

## 2026-08-30 · v0.1.0 · First release

- **用户可见**：单页个人站点上线 — Hero（glyph 粒子记忆点 + Get in touch 主 CTA）、About、Credentials（3 个 AI 文凭占位卡）、AI Skill Craft（jin-web-director 事实介绍）、What I can do（业务占位）、Contact（联系方式占位）、Footer
- **文档**：PRODUCT.md（产品意图 + 信息架构）、DESIGN.md（token 表 + 动效职责 + 三视口行为）、DEPLOY.md、CHANGELOG.md 齐备
- **验证**：本地 375 / 768 / 1440 三视口实测通过（qa-checklist + visual-audit + performance-checklist）；线上 URL 已确认 HTTP 200 与内容正确
- **QA 修复记录**：375px 导航溢出（隐藏锚点链接）、粒子字与文案重叠（宽屏移至右半区、降不透明度）、rAF 空转（落位后停循环，鼠标事件按需重绘）、锚点被粘性头部遮挡（scroll-margin-top）
- **构建证据**：commit `bc9d9da`，Pages build status: built
- **线上地址**：https://weoiquan-art.github.io/
- **已知遗留**：全部显式占位待真实内容替换（见 PRODUCT.md「现有证明材料」表）；文凭图片、真实联系方式、自我介绍文案、业务描述、使用经验文字

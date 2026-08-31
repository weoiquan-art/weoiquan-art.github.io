# CHANGELOG.md — JIN Personal Site

## 2026-08-30 · v0.1.0 · First release

- **用户可见**：单页个人站点上线 — Hero（glyph 粒子记忆点 + Get in touch 主 CTA）、About、Credentials（3 个 AI 文凭占位卡）、AI Skill Craft（jin-web-director 事实介绍）、What I can do（业务占位）、Contact（联系方式占位）、Footer
- **文档**：PRODUCT.md（产品意图 + 信息架构）、DESIGN.md（token 表 + 动效职责 + 三视口行为）、DEPLOY.md、CHANGELOG.md 齐备
- **验证**：本地 375 / 768 / 1440 三视口实测通过（qa-checklist + visual-audit + performance-checklist）；线上 URL 已确认 HTTP 200 与内容正确
- **QA 修复记录**：375px 导航溢出（隐藏锚点链接）、粒子字与文案重叠（宽屏移至右半区、降不透明度）、rAF 空转（落位后停循环，鼠标事件按需重绘）、锚点被粘性头部遮挡（scroll-margin-top）
- **构建证据**：commit `bc9d9da`，Pages build status: built
- **线上地址**：https://weoiquan-art.github.io/
- **已知遗留**：全部显式占位待真实内容替换（见 PRODUCT.md「现有证明材料」表）；文凭图片、真实联系方式、自我介绍文案、业务描述、使用经验文字

## 2026-08-30 · v0.2.0 · Identity redesign

- **改版简报**：按 lead designer 简报执行 — "interactive personal introduction"，非通用 AI 作品集
- **新 IA**：Hero（JIN + AI VISUAL DESIGNER / CREATIVE TECHNOLOGIST + 终端打字）→ About（含 3 张真实文凭 PDF：Google AI Professional Certificate、NVIDIA AI for All、AI Untuk Rakyat）→ Selected Work（Phoebe/Rin/Sera/AI Video/Web 实验）→ Currently → Contact
- **真实联系方式**：email jinmyaigc@gmail.com、Instagram @desjin0827、GitHub @weoiquan-art（证书持有人：Lee Woei Quan）
- **动效语言**：终端打字身份块、glyph 粒子 Hero、工作行 hover 反馈、Now 脉冲点；全部带 reduced-motion 降级
- **滚动**：Lenis 平滑滚动（CDN、有降级）；导航点击 = 260ms 遮罩过渡 → 即时落位 → 立即交还控制权，无滚动劫持、无强制吸附
- **QA**：375/1440 实测通过；导航过渡实测（点击→遮罩→workTop=56px 精确落位）；终端提速；窄屏幽灵字移位避让
- **已知遗留**：Phoebe/Rin/Sera/AI Video 的一行描述仍为显式占位，待真实内容

## 2026-08-31 · v0.2.1 · Remove Selected Work

- **用户可见**：删除 Selected Work 区块（Phoebe/Rin/Sera/AI Video 项目行）；导航与区块编号重排为 01 about / 02 now / 03 contact；Hero 副按钮改为 "About me"
- **原因**：项目描述未定，宁缺毋滥（作者决定）；未来项目就绪可随时恢复
- **同步**：移除 work 相关 CSS；PRODUCT.md 信息架构表更新为 4 区块
- **验证**：本地渲染检查 + 线上 200 验证

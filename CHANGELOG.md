# CHANGELOG.md — JIN Personal Site

## 2026-09-02 · v0.2.6 · Diagonal Raven Flow

- **用户可见**：根据作者提供的动线图，乌鸦改为近似平行的右下→左上斜向群飞。从下方、右方、右下方进入后，每只鸟沿同一总体方向自然穿出顶部或左侧边缘；不再汇聚到一个角落。

## 2026-09-02 · v0.2.5 · Top-left Raven Neighbourhood

- **用户可见**：乌鸦仍从下方、右方、右下方大面积进入，但离场终点现在集中在左上角附近的一片区域（而非同一个精确角落，也不会散到整条边缘）。

## 2026-09-02 · v0.2.4 · Distributed Raven Exits

- **用户可见**：保留 Hero 下方、右方、右下方三处同时入场，但移除所有乌鸦汇到同一个左上角的终点。现在每只乌鸦都向自身的左上方离场，并从不同上侧或左侧位置消失，形成连续而非收束的群飞。

## 2026-09-02 · v0.2.3 · Wider Raven Curtain

- **用户可见**：Hero 的乌鸦幕扩展为三处同时入场：下方上涌、右侧横切、右下斜掠。提高总数量与前景乌鸦比例，让飞行覆盖整个屏幕；所有路径仍自然汇向左上离场。
- **交互与性能**：仍是一次性入场 Canvas 动画；无滚动劫持，完成后停掉动画循环，`prefers-reduced-motion` 保持直接显示完整 Hero。

## 2026-09-01 · v0.2.2 · Midnight Hero

- **用户可见**：Hero 重构为午夜乌鸦幕。进入时，大量不同深度、尺寸、轨迹的矢量乌鸦从右下向左上掠过，完全遮住界面；离场后才显出巨型 JIN、身份、CTA 与低调的 Terminal 系统痕迹。
- **视觉方向**：首屏采用深靛午夜空间、轨道与微光；保留乌鸦作为 JIN 的视觉符号，但不复制 Discord 的黑玫瑰、界面或资产。内容区仍维持原有的编辑性信息结构。
- **交互与降级**：无滚动劫持；导航点击仍是短遮罩后即时落位；`prefers-reduced-motion` 直接显示完整 Hero。
- **验证**：本地 375 / 768 / 1280 视口检查；Hero 入场与稳定态、Terminal 完成、CTA 转场与滚动控制、横向溢出、控制台日志均已检查。GitHub Pages workflow #5 已对 `a8b29d0` 成功完成；本机浏览器对生产域名有已保存的访问阻止策略，故未绕过该限制执行线上视觉复查。

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

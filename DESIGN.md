# DESIGN.md — JIN Personal Site

> 源：jin-web-director Phase 3（视觉方向）+ Phase 4（交互导演）+ Phase 5（响应式）。
> Token 表按 `references/design-system.md` 结构建立，色彩值在本项目正式定值（补上 toolkit 中的"待定"项）。

## 1. 界面类型与品牌特质

- 类型：**品牌/营销页**（编辑性表达，允许个性）
- 品牌特质（3–5 个）：**沉稳、神秘、克制、手艺人气质、带有一处锋利**
- 单一最强观点：每屏只有一个视觉主角——Hero 是一个午夜身份场景；其余区块回到清晰、可读的内容本身

## 2. 反参考（明确不要）

- ❌ 通用 AI 风格的蓝紫渐变、玻璃拟态卡片、无意义的发光标题
- ❌ 假浏览器框、装饰性图标块、编造的社交证明
- ❌ 嵌套卡片、处处动效、加载动画遮罩
- ❌ Inter/Roboto 默认字体直接裸用

例外：Hero 的深靛紫光是“午夜乌鸦幕”的叙事环境，不作为全站通用 AI 渐变；不使用 Discord 的黑玫瑰、UI 或现成素材。

## 3. 设计 token（正式定值）

### 色彩（编辑风：暖白底 + 墨色字 + 单一强调色）

| 用途 | 变量 | HEX | 用在 |
|---|---|---|---|
| bg-light | `--color-bg` | `#FAF7F2` | 页面背景（暖白纸感） |
| bg-dark | `--color-ink` | `#16130E` | Footer/深色对比区、正文 |
| text-primary | `--color-text` | `#1F1B14` | 标题正文 |
| text-secondary | `--color-muted` | `#6B6459` | 辅助文本（对 #FAF7F2 对比度 ≥ 4.5:1） |
| primary | `--color-accent` | `#B4441C` | 主 CTA、强调、hover（赤陶色，避开蓝紫套路） |
| line | `--color-line` | `#E3DCD2` | 分隔线、卡片描边 |

### Hero 夜景 token（仅首屏）

| 用途 | 色彩 | 说明 |
|---|---|---|
| midnight base | `#07050D` | 近黑、非纯黑的 Hero 基底 |
| midnight violet | `#2E1B4B` | 深度与空间关系，不做通用渐变 |
| signal | `#C0A1F2` | 系统状态、Terminal prompt、微弱焦点 |
| type light | `#F0EAF6` | 巨型 JIN 与 Hero 主行动 |

### 排版

| 用途 | 字体 | 说明 |
|---|---|---|
| 标题 | `"Fraunces", Georgia, serif` | Google Fonts，编辑风衬线，可变光学尺寸 |
| 正文 | `"Inter", system-ui, sans-serif` | 仅 400/600 两档 |
| 等宽（标签） | `ui-monospace, "SF Mono", Menlo` | 小型大写标签用 |

- 尺寸按 `responsive-breakpoints.md` 文本规则：H1 clamp(2.4rem → 4rem)，正文 1rem→1.125rem，行高 1.6
- 字体族 ≤ 2（衬线 + 无衬线）✅

### 间距 / 圆角 / 阴影

- 间距：4/8/16/24/32/48/64（skill 系统表，无随意值）
- 圆角：卡片 8px、按钮 9999px（药丸）、图片 8px
- 阴影：仅 shadow-sm/md，编辑风以描边为主、阴影为辅

### 视觉密度 / 设计差异 / 动效强度（1–10）

- 全站视觉密度：**3**（内容区宽松，≥30% 留白）；Hero：**6**（乌鸦幕在短暂入场时高密度）
- 设计变化：**6**（Hero 是独立的午夜场景，其余内容维持编辑基底）
- 动效强度：**6**（Hero 一个强叙事时刻 + 滚动进入；完成后停止）

## 4. 交互导演（Phase 4 — 动效时刻及其职责）

| # | 时刻 | 沟通职责 | 实现 | 降级 |
|---|------|---------|------|------|
| 1 | 午夜乌鸦幕 → JIN | 进入后先建立一个完整场景，再把焦点交回 JIN；乌鸦离场后停止，不阻挡用户 | 原生 Canvas/JS + CSS 空间层次 | `prefers-reduced-motion`: 直接呈现最终 Hero |
| 2 | 滚动进入 | 引导阅读顺序：区块标题先于内容出现 | IntersectionObserver + CSS transition 一次性 | 同上：直接显示 |
| 3 | CTA hover | 反馈可点 | 颜色/位移 150ms | 无需降级 |

- 全站动效 ≤ 3 处；JS 禁用时全部内容静态可读（动效仅通过 JS 添加 class 启用）
- 无任何动效承载关键信息

## 5. 响应式行为（Phase 5 — 先定义后实现）

| 区块 | 375px | 768px | 1440px+ |
|---|---|---|---|
| 导航 | 名字 + Get in touch 紧凑行（无汉堡：单页锚点仅 4 个，横向滚动） | 同左 + 完整锚点 | 水平导航 |
| Hero | 一列：巨型 JIN、身份、CTA、系统痕迹依次阅读；入场 canvas 全视窗 | 同一场景，扩大 JIN 与轨道空间 | 巨型 JIN 居中，身份/CTA 左下、系统痕迹右下；canvas 全视窗 |
| Credentials | 1 列 | 2 列 | 3 列 |
| Skill Craft | 单栏 | 单栏 | 图文 40/60 |
| Contact | 垂直堆栈链接（触摸目标 ≥ 44px） | 同左 | 横排 |
| Footer | 单列 | 单列居中 | 行式 |

- 断点：768 / 1024 / 1440，移动优先
- 触屏无 hover 依赖

## 6. 图片与无障碍承诺

- 文凭图：`loading="lazy"` + 显式宽高比（CLS < 0.1）+ 占位图明确标 "Placeholder"
- 头像可选；一切 img 有 alt
- 对比度全部 ≥ 4.5:1；焦点态可见；语义化 landmark（header/main/section/footer）

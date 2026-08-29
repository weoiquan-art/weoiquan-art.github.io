# DEPLOY.md — JIN Personal Site

## 部署路线（唯一主路径）

| 项 | 值 |
|---|---|
| 仓库 | `https://github.com/weoiquan-art/weoiquan-art.github.io` |
| 默认分支 | `main`（main 即生产分支，无构建步骤） |
| 托管 | GitHub Pages（source: main 分支 `/` 根目录） |
| 生产 URL | `https://weoiquan-art.github.io/` |
| 技术 | 纯静态：HTML + CSS + 原生 JS；字体 Google Fonts（Fraunces + Inter） |

## 发布触发方式

`git push origin main` → GitHub Pages 自动构建（约 1–3 分钟，最长约 10 分钟）。
**无定时刷新**：只在推送时更新。

## 发布后验证（每次发布必做）

1. `curl -s -o /dev/null -w "%{http_code}" https://weoiquan-art.github.io/` 应为 `200`
2. 浏览器打开线上 URL，Ctrl+F5 强刷，确认变更已生效（CDN 缓存偶尔延迟几分钟）
3. 移动端视口（375px）抽查 Hero 与导航

## 回滚方法

```bash
git revert <bad-commit> && git push origin main
```
（或临时在 GitHub 仓库 Settings → Pages 切换到历史提交的部署）

## 环境变量 / 密钥

无。本站无任何后端、表单、统计脚本；**任何密钥都不得进入此仓库**。

## 域名

暂用 GitHub 默认域名。未来如绑自定义域名，在 Settings → Pages 配置 CNAME，并更新本文件与 DNS 续费记录。

## 更新历史

- 2026-08-30 · v0.1.0 · 首次上线（jin-web-director Director loop 全流程交付）

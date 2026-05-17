## Why

21 天上线压力下，前端会在 Home / Generate / Pricing / Model Detail / Tool Single / Use Cases / History 七类页面同时落地。如果没有先把设计 token 与页面骨架固化，每个页面都会就地发明色值、字号、间距，到联调期合并出十几种"差不多的灰"和"差一点的圆角"，回头返工至少损耗 2–3 天。本次提案在工作台开工前一口气把 Jdream.ai 的视觉系统（Apple 极简 · 浅/暗双主题 · 系统字 + Apple System Blue `#0071E3` 单一品牌色）落成可粘贴的代码资产，并在 Pencil 里出 7 张关键页面的高保真稿，作为后续前端开发的唯一视觉真源。

## What Changes

- **新增**：`brand.config.ts` —— 集中管理品牌色、字体族、圆角、阴影、动效曲线常量
- **新增**：`tailwind.config.ts` 中接入上述 token，扩展 colors/fontFamily/fontSize/spacing/borderRadius
- **新增**：`app/globals.css` 中 `:root` 与 `.dark` 两套 CSS 变量声明（color tokens + 字体栈）
- **新增**：`openspec/changes/design-system-jdream/specs/design-system/spec.md` —— 设计系统能力规格（change archive 后合并至 `openspec/specs/design-system/spec.md`，作为长期视觉真源）
- **新增**：7 张 Pencil 设计稿（Home / Generate / Model Detail / Tool Single / Pricing / Use Cases / History），保存在 `ai-video-aggregator.pen`
- **非目标（不做）**：
  - ❌ 不实现具体 UI 组件（Button / Input / Modal 等留给下一个 change `ui-components`）
  - ❌ 不出 Login / Account / 法律页设计稿（用基础组件套即可，无需高保真）
  - ❌ 不做移动端独立设计稿（响应式断点在 token 中预留即可）
  - ❌ 不引入运行时主题切换器（暗色模式仅预留 token，UI 入口下一期）

## Capabilities

### New Capabilities
- `design-system`: Jdream.ai 视觉规范的代码化资产（color / typography / spacing / radius / shadow / motion tokens 双主题）+ 6 张关键页面 Pencil 高保真稿，作为前端开发的唯一视觉真源。

### Modified Capabilities
<!-- 首次落地，无既有 spec 需要修改 -->

## Impact

- **代码库**：新增 `brand.config.ts`；改动 `tailwind.config.ts`、`app/globals.css`。前端代码尚未铺开，影响面仅限配置层。
- **规格库**：新增 `specs/design-system/spec.md`（change 内）→ archive 后落入 `openspec/specs/design-system/spec.md`，成为长期视觉真源。
- **设计资产**：新增 `ai-video-aggregator.pen`（Pencil），含 6 张高保真稿，纳入仓库版本管理。
- **基础设施**：无变更。
- **第三方服务**：无变更。
- **数据**：无变更。
- **成本**：$0。系统字（SF Pro / -apple-system）零授权费，无需付费 webfont。
- **风险**：
  - Pencil 与代码 token 漂移 → 由 `openspec/specs/design-system/spec.md` 作为单一真源，Pencil 设计稿引用同名 token，每次改设计先改 spec 再同步 Pencil 与 `brand.config.ts`
  - 系统字在非 Apple 设备退化 → fallback 链 `system-ui, "Segoe UI", Roboto, sans-serif` 已覆盖 Windows / Android
  - 单一品牌色被滥用 → 在 `docs/design-tokens.md` 明确列出"brand 色仅用于 primary CTA / 关键链接 / 品牌 logo 三处"的禁忌
- **依赖前置**：无。本 change 是 `launch-aggregator-mvp` 之下、所有前端实现 change 之上的视觉地基，建议第一个落地。

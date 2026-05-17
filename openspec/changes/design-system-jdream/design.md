## Context

`launch-aggregator-mvp` 已确立 21 天上线 Jdream.ai 的总目标。本 change 是其下游、所有前端实现 change 的上游，负责把"Apple 极简 · 浅/暗双主题 · 系统字 + Apple System Blue 单一品牌色"翻译为可粘贴的代码 token、可引用的 spec 文档、可对照实现的 Pencil 高保真稿。约束：

- 工具链：Next.js 15 + Tailwind CSS v4 + Pencil（设计稿）。
- 设计来源：用户已锁定 Apple 极简风格 + Apple System Blue `#0071E3` 主色 + 产品名 `Jdream.ai`（暂无 Logo）。
- 视觉感受目标：科技 + playful + 专业，三者权重大致 4:3:3——Apple 极简贡献"科技/专业"，单一品牌色与等距字 mono 点缀贡献"playful"。
- 时效：本 change 应在 1–2 天内完成，以解锁后续所有前端实现 change。

## Goals / Non-Goals

**Goals:**
- 一次性产出可粘贴的 `brand.config.ts` + `tailwind.config.ts` 片段 + `globals.css` 变量声明，覆盖 color / typography / spacing / radius / shadow / motion 六类 token，浅/暗双主题。
- 通过 `openspec/specs/design-system/spec.md` 把设计原则与 token 命名约定固化为长期规格，作为前端唯一视觉真源。
- 在 `ai-video-aggregator.pen` 出 7 张关键页面（Home / Generate / Model Detail / Tool Single / Pricing / Use Cases / History）的高保真稿，每张都引用同名 token，避免 Pencil 与代码漂移。
- 视觉调性"playful 而不喧闹"：通过等距字（SF Mono）在恰当位置点缀（credits、模型 ID、time、prompt label），而非靠装饰元素。

**Non-Goals:**
- 不实现具体 UI 组件（Button / Input / Modal 的 React 代码留给下一个 change `ui-components`）。
- 不出 Login / Account / 法律页设计稿（用基础组件套即可，无需高保真）。
- 不做移动端独立设计稿（响应式断点在 token 中预留，移动端走桌面端折叠适配）。
- 不引入运行时主题切换器入口（暗色 token 仅预留，UI 切换器留给后续 change）。
- 不引入第三方付费字体（系统字栈零授权费、零加载延迟）。
- 不在本 change 写组件库 / Storybook（仅 token + 设计稿）。

## Decisions

### D1 · 设计哲学：Apple 极简打底，playful 仅来自单一品牌色与 mono 字
- **选择**：主体走 Apple 风（大量留白 / 高对比 / 系统字 / 不用阴影 / hairline border），把"playful"的全部预算压在两处——`#0071E3` 主色 CTA 与 SF Mono 点缀。
- **理由**：Apple 极简天然偏冷峻，硬塞插画/渐变/emoji 装饰会破坏专业感（如同把蘑菇贴在西装上）。单一品牌色 + 等距字是 Linear / Vercel / Apple Developer 站点共通的"工程师 playful"语言，已被验证能同时达成"科技 + playful + 专业"。
- **替代**：堆渐变 / 玻璃质感 / 霓虹 → 视觉饱和但与 Apple 简洁背道而驰，且会让 AI 视频聚合站显得 "AI slop"。

### D2 · 色彩系统：浅色为底 + Apple System Blue 单一品牌色 + 暗色映射
- **选择**：以下 token 命名固定，所有页面与组件必须引用 token，不得硬编码 hex。

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--color-bg` | `#FFFFFF` | `#000000` | 页面底色 |
| `--color-surface` | `#FAFAFA` | `#1D1D1F` | 卡片底色 |
| `--color-elevated` | `#F5F5F7` | `#2C2C2E` | 悬浮卡片 / hover 态 |
| `--color-text` | `#1D1D1F` | `#F5F5F7` | 主文本（**禁纯黑/纯白**） |
| `--color-text-2` | `#6E6E73` | `#A1A1A6` | 次要文本 |
| `--color-text-3` | `#86868B` | `#6E6E73` | 三级文本 / placeholder |
| `--color-border` | `#D2D2D7` | `#3A3A3C` | hairline 1px |
| `--color-border-subtle` | `#E8E8ED` | `#2C2C2E` | 极弱分隔 |
| `--color-brand` | `#0071E3` | `#0A84FF` | 主 CTA / 关键链接（**全站仅此处用蓝**） |
| `--color-brand-hover` | `#0077ED` | `#409CFF` | brand hover |
| `--color-success` | `#30D158` | `#32D74B` | 成功状态 |
| `--color-warning` | `#FF9F0A` | `#FF9F0A` | 警告 |
| `--color-error` | `#FF3B30` | `#FF453A` | 错误 / 失败 |

- **理由**：色值取自 Apple HIG 系统色板，浅/暗对偶严格按 Apple 自身映射；`--color-brand` 暗色用 `#0A84FF`（System Blue Dark）保证可读对比度。
- **替代**：自创品牌色 → 失去 Apple 调性根基；多品牌色（紫 + 蓝）→ playful 过度，违背 D1。

### D3 · 字体系统：系统字栈 + SF Mono 等距点缀
- **Display / Body fallback 链**：
  ```
  -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Helvetica Neue", "Segoe UI", system-ui, Roboto, sans-serif
  ```
- **Mono fallback 链**：
  ```
  "SF Mono", ui-monospace, "JetBrains Mono", "Fira Code",
  Menlo, Consolas, monospace
  ```
- **字号梯度**（Apple 标配大字号 + 17px body）：

| Token | px | line-height | letter-spacing | 用途 |
| --- | --- | --- | --- | --- |
| `--text-display-xl` | 96 | 1.05 | -0.022em | Hero 主标题（仅 Home） |
| `--text-display-l` | 64 | 1.08 | -0.020em | 子页面 Hero |
| `--text-h1` | 48 | 1.10 | -0.018em | Section 大标题 |
| `--text-h2` | 32 | 1.20 | -0.012em | Section 标题 |
| `--text-h3` | 24 | 1.30 | -0.008em | 卡片标题 |
| `--text-body` | 17 | 1.47 | -0.003em | 正文（不是 16） |
| `--text-body-s` | 15 | 1.45 | 0 | 次要正文 |
| `--text-caption` | 13 | 1.40 | 0 | 元信息 |
| `--text-mono-m` | 13 | 1.40 | 0 | 等距点缀（credits / model id / time） |
| `--text-mono-s` | 11 | 1.40 | 0.02em | 标签（PROMPT / DURATION） |

- **mono 出现位置（铁律）**：模型 ID（如 `kling-2.5-turbo`）、Credits 数（如 `25 cr`）、生成时间（如 `00:42`）、prompt 区域 label（`PROMPT`）、价格小数（`$9.99/mo`）。**正文与按钮不用 mono**。
- **字重**：Regular 400 / Medium 500 / Semibold 600。**不用 700 Bold**（Apple 风很少用 Bold，靠字号与对比拉权重）。
- **理由**：系统字零加载延迟，Lighthouse 友好；SF Mono 在 Apple 设备原生可用，非 Apple 走 fallback 仍保等距感；mono 点缀是"科技 + playful"的核心来源。

### D4 · 间距 / 圆角 / 阴影 / 动效
- **基础网格**：8px。所有间距必须为 8 的倍数（移动端可降到 4px 倍数）。
- **间距梯度**：`0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 120 / 160 / 240`（13 级）。
- **页面节奏**：Hero 上下 padding `160–240px`；section 间距 `≥ 120px`；container max-width `1120px`，gutter `24px`；卡片内 padding `24–32px`。
- **圆角**：`--radius-sm 8px`（小标签）/ `--radius-md 12px`（按钮 / 输入框）/ `--radius-lg 18px`（卡片）/ `--radius-xl 24px`（大卡片 / 模态）/ `--radius-pill 999px`（pill 标签）。
- **阴影**：**默认不用 box-shadow**。深度只通过两条手段表达：
  1. `--color-elevated` 比 surface 浅 1 阶（hover / 选中态）
  2. `--color-border` 1px hairline
  唯一例外：模态/抽屉用 `--shadow-modal: 0 20px 60px -10px rgba(0,0,0,0.15)`（暗色 0.5）。
- **动效**：曲线统一 `--ease-apple: cubic-bezier(0.42, 0, 0.58, 1)`（Apple 标准 ease-in-out 微调）；时长 `instant 0 / fast 150ms / normal 220ms / slow 320ms`。**hover 态只变 ring 与 bg，不变 transform**（避免 jitter）。

### D5 · 浅/暗双主题策略
- **默认主题**：浅色（Apple 官网风格 + 大众 SaaS 用户偏好）。
- **暗色实现**：通过 `<html class="dark">` 切换 + `:root.dark` 覆盖同名变量；本 change **仅落 token，不出切换 UI**。
- **MVP 阶段**：发布时仅暴露浅色主题（让用户先稳定接受品牌调性）；暗色 token 提前预埋，下一个 change `ui-components` 完成切换器后开放。
- **理由**：浅色主题对 SEO 截图（Search Console / 社媒分享卡）更友好，转化率更高；暗色作为 power user 升级体验，留作后续运营钩子。

### D6 · 7 张 Pencil 设计稿的范围与排序
按依赖顺序产出（先打基础再展开）：

| # | 页面 | 关键信息呈现 | 推荐 Pencil 风格 |
| --- | --- | --- | --- |
| 1 | **Home（长页 7 屏）** | 顶部菜单 + Hero 一句话定位 + 生成面板 demo + 重点功能 + 场景介绍 + 信任度 + 使用步骤 + FAQ + Footer | Monumental Editorial（Hero）+ Modular Bento Showcase（功能） |
| 2 | **Generate**（产品工作台） | 左侧 prompt 输入 + 模型/参数下拉 + 右侧预览/结果列表 + 顶部 credits 余额 | Product Demo |
| 3 | **Model Detail**（如 `/m/sora`） | 模型大图 demo + 卖点 + Try Now CTA + 同类模型推荐 + 该模型 FAQ | Cinematic Alternating |
| 4 | **Tool Single**（如 `/ai-video-extender`） | 工具说明 + 上传/输入 + 输出示例 + 使用场景 + 价格说明 | Product Demo + Soft Bento |
| 5 | **Pricing** | Free / Lite / Pro / Premium 四档 + 月年切换 + Credits 包对照 + FAQ（**价格用占位 `$X.XX/mo`，待运营定后替换**） | Product Data Grid |
| 6 | **Use Cases**（场景介绍单页） | 8 个场景卡：广告 / 短剧 / 婚礼视频 / 电商 / 教育 / 游戏宣传 / 健身 / 美妆，每张连到对应工具/模型 | Modular Bento Showcase |
| 7 | **History**（我的生成 + 空态子稿） | 主稿：时间倒序网格 + 单条预览 + 下载/删除 + 状态标签；子稿：首次进入空态（友好引导 + 直跳 Generate 的 CTA） | Product Data Grid |

- **每张稿的强制要求**：
  - 顶部全局导航（一致结构），Logo 位置使用 wordmark `Jdream.ai`（SF Pro Display Semibold）作占位，待 Logo 资产到位后替换
  - 至少出现 1 处 SF Mono 点缀（验证 D3 铁律）
  - 至少出现 1 个 `--color-brand` CTA（验证单一品牌色铁律）
  - Footer 含模型列表 + 法律入口（出于 SEO/合规要求）
  - 仅出英文版（多语言适配靠 token 不靠重画稿）

### D7 · 规格归位：唯一真源走 openspec/specs/design-system/spec.md
- **流程**：本 change 期间，spec 写在 `openspec/changes/design-system-jdream/specs/design-system/spec.md`；archive 时由 openspec 工具合并到 `openspec/specs/design-system/spec.md`，作为长期视觉知识库。
- **改设计的标准动作**：
  1. 改 `specs/design-system/spec.md`（true source）
  2. 同步 `brand.config.ts` / `tailwind.config.ts` / `globals.css`
  3. 同步 `ai-video-aggregator.pen` 中 7 张稿
  4. 顺序不可调换；任何在 Pencil 里直接改 hex 的行为视作技术债。
- **替代**：把 token 写在 `docs/design-tokens.md` 或代码注释 → 与 openspec 工作流割裂，change archive 后无法沉淀为可被未来 change 引用的 spec。

## Risks / Trade-offs

| 风险 | 应对 |
| --- | --- |
| Pencil 设计稿与代码 token 漂移 | 严格走 D7 三步同步流程；PR 模板加一行勾选"已同步 Pencil"；Lint 规则禁止硬编码颜色 |
| Apple 极简过冷，丢失 playful 感 | 在 7 张稿评审时强制检查"是否有 mono 点缀 + brand 蓝 CTA + 模型预览有活力图像"三件套 |
| 系统字在 Windows / Android 退化为 Segoe / Roboto，调性偏移 | 接受这个 trade-off：90% 北美用户在 Apple/Chrome 字栈；Windows 退化到 Segoe UI 仍属 Apple 风的远亲，不会突兀 |
| Apple System Blue 与上游模型品牌色撞色（如 Sora 蓝、Kling 蓝） | 模型 logo / 模型卡片采用灰阶或品牌方原色，CTA 始终走 `#0071E3`，不混用 |
| 单一品牌色被滥用到一切链接、icon、徽章 | spec.md 写明铁律——brand 蓝仅用于：① primary CTA ② 文本中的关键超链 ③ 焦点环 |
| 不用阴影导致层次扁平、卡片找不到 | 用 `--color-elevated` 浅 1 阶 + 1px hairline 双手段做层次；Pencil 评审时强制检查每个卡片的 elevation 来源 |
| 17px body 在小屏过大 | 移动端断点（≤ 768px）body 降为 16px，token 用 `clamp(16px, 1vw + 14px, 17px)` 自适应 |
| 7 张稿同时铺开导致评审失焦 | 严格按 D6 顺序产出，每张交付后获得 ack 才推进下一张；不并行 |

## Migration Plan

> 该 change 是新建项目的视觉地基，不存在历史替换。"Migration"用于描述本 change 内部的产出节奏：

1. **第 1 天上半天**：完成 `specs/design-system/spec.md`（含本 design.md 中 D2/D3/D4 全部 token 表）+ `brand.config.ts` + `tailwind.config.ts` 片段 + `globals.css`。代码 token 必须先于 Pencil 设计稿成文。
2. **第 1 天下半天 ~ 第 2 天**：按 D6 表依次出 7 张 Pencil 稿，每张完成后给用户 review，ack 后推进下一张。Home（#1）作为风格定调稿，必须先出。
3. **交付检查清单**：
   - [ ] `brand.config.ts` 可被 `tailwind.config.ts` 直接 import
   - [ ] `globals.css` 包含 `:root` 与 `:root.dark` 双套变量
   - [ ] `ai-video-aggregator.pen` 含 7 个 Frame，每个 Frame 命名为页面英文名
   - [ ] 每张 Frame 至少 1 处 mono 点缀 + 1 个 brand CTA + 全局 Header/Footer
   - [ ] `specs/design-system/spec.md` 完成，能独立解释清"为什么这套 token"

4. **回退**：本 change 仅产出配置与设计稿，不影响运行时；任何阶段可放弃，前端 fallback 到 Tailwind 默认 preset，不阻塞业务功能（仅视觉折损）。

## Resolved Questions

1. **Logo**：本 change 期内 Logo 资产暂无，Pencil 稿全部使用 wordmark `Jdream.ai`（SF Pro Display Semibold）作占位，资产到位后通过修改 spec + Pencil 同步替换。
2. **暗色发布时点**：MVP 仅发布浅色主题；暗色 token 在本 change 完整预埋（D2 表中含 Dark 列），UI 切换器留到下一个 change `ui-components`。
3. **第二语言**：本 change 的 Pencil 稿仅出英文版，多语言适配靠 i18n token 不靠重画稿。
4. **Pricing 价格**：本 change 不锁定具体价格，Pencil 稿使用 `$X.XX/mo` 占位，待运营定档后由前端实现 change 替换。
5. **Use Cases 场景清单**：扩展为 8 个场景——广告 / 短剧 / 婚礼视频 / 电商 / 教育 / 游戏宣传 / 健身 / 美妆。
6. **History 空状态**：纳入本 change，作为 #7 的子状态稿（不另算一张），含友好引导文案 + 直跳 Generate 的 CTA。

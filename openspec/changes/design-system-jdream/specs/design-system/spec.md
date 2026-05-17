# Design System · Jdream.ai

> **唯一视觉真源**。任何前端代码、Pencil 设计稿、产品物料引用的色值/字体/间距/圆角/阴影/动效，必须以本文档为准。
> 修改流程：先改本文档 → 再同步 `brand.config.ts` 与 `globals.css` → 最后同步 `ai-video-aggregator.pen`。任何在 Pencil 直接改 hex 或在代码里硬编码颜色的行为均视为违规。

---

## 1. 概览与目标

Jdream.ai 是面向海外创作者的 AI 视频/图片多模型聚合 SaaS。视觉系统服务于"科技 + playful + 专业"三件事，权重 4:3:3。

| 维度 | 选择 | 出处 |
| --- | --- | --- |
| 设计哲学 | Apple 极简（大量留白 / 高对比 / 系统字 / 不用阴影 / hairline border） | 贡献"科技 / 专业" |
| 品牌色 | Apple System Blue `#0071E3`，全站唯一强调色 | 贡献"playful" |
| Mono 点缀 | SF Mono 等距字仅出现在 5 个固定位置 | 贡献"playful + 工程感" |
| 主题 | 浅色为默认；暗色 token 完整预埋，UI 切换器另一 change 实现 | 兼顾 SEO 截图友好 + 长期 power user |
| 字体策略 | 系统字栈，零授权费，零加载延迟 | 贡献 Lighthouse 分数 |

---

## 2. 设计原则

7 条原则，所有页面、组件、设计稿必须满足。违反任意一条视为 bug。

### P1 · 留白即层次
**定义**：用空间表达层级，不用阴影、不用边框装饰。
- ✓ Hero 上下 padding ≥ 160px；section 间距 ≥ 120px
- ✗ 用 `box-shadow` 营造"飘起来"的卡片感（除模态/抽屉外）

### P2 · 对比即重音
**定义**：每屏视觉重音不超过 2 个，重音由"字号差 + 颜色差 + 留白差"复合构成。
- ✓ Hero 单一 96px 标题 + 单一 brand CTA，其它皆灰
- ✗ 一屏出现 3 个相同尺寸的 H1 + 5 个 brand 蓝 CTA

### P3 · 单一品牌色铁律
**定义**：`--color-brand` (`#0071E3`) **仅用于** ① primary CTA ② 文本中的关键超链 ③ 焦点环（focus ring）三处，不得出现在 icon、徽章、装饰元素、背景渐变。
- ✓ Footer 链接灰色，hover 才显 brand 蓝
- ✗ 把 brand 蓝当主色铺背景或填整张卡片

### P4 · Mono 点缀铁律
**定义**：SF Mono 等距字 **仅用于** ① 模型 ID（`kling-2.5-turbo`） ② Credits 数（`25 cr`） ③ 生成时间（`00:42`） ④ Prompt 区域 label（`PROMPT`） ⑤ 价格小数（`$9.99/mo`） 五处。
- ✓ 顶部余额 `Credits: 1,250` 用 mono
- ✗ 正文段落、按钮文字、H1/H2 用 mono

### P5 · 系统字栈优先
**定义**：禁止引入任何付费 webfont；以 Apple 系统字为首，平滑退化到 Windows / Android。
- ✓ `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", system-ui, Roboto, sans-serif`
- ✗ 引入 Inter / Geist / Söhne 等 webfont

### P6 · 双手段做层次
**定义**：层次仅由两件事表达——`--color-elevated` 比 `--color-surface` 浅 1 阶，加 1px `--color-border` hairline。例外：模态/抽屉允许使用 `--shadow-modal`。
- ✓ Hover 卡片由 `surface` 切到 `elevated`，不变 transform
- ✗ 用 `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` 模拟"卡片浮起"

### P7 · 不用纯黑/纯白
**定义**：背景用 `#FFFFFF` / `#000000` 是允许的（Apple 自身做法），但**正文颜色禁纯黑/纯白**。文本用 `#1D1D1F` / `#F5F5F7`。
- ✓ Body 文字 `#1D1D1F`
- ✗ Body 文字 `#000000`

---

## 3. 色彩系统

### 3.1 完整 Token 表

所有色值必须以本表为准。命名稳定，不得在代码中起别名。

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--color-bg` | `#FFFFFF` | `#000000` | 页面底色 |
| `--color-surface` | `#FAFAFA` | `#1D1D1F` | 卡片底色 / section 分隔 |
| `--color-elevated` | `#F5F5F7` | `#2C2C2E` | 悬浮 / hover / 选中态 |
| `--color-text` | `#1D1D1F` | `#F5F5F7` | 主文本（禁纯黑/纯白） |
| `--color-text-2` | `#6E6E73` | `#A1A1A6` | 次要文本 |
| `--color-text-3` | `#86868B` | `#6E6E73` | 三级文本 / placeholder |
| `--color-border` | `#D2D2D7` | `#3A3A3C` | 默认 hairline 1px |
| `--color-border-subtle` | `#E8E8ED` | `#2C2C2E` | 极弱分隔（同色系内分组） |
| `--color-brand` | `#0071E3` | `#0A84FF` | 主 CTA / 关键超链 / focus ring |
| `--color-brand-hover` | `#0077ED` | `#409CFF` | brand hover |
| `--color-success` | `#30D158` | `#32D74B` | 成功状态 |
| `--color-warning` | `#FF9F0A` | `#FF9F0A` | 警告 |
| `--color-error` | `#FF3B30` | `#FF453A` | 失败 / 错误 |

### 3.2 色彩使用规则

- **Background 选用顺序**：默认 `--color-bg` → 卡片 `--color-surface` → 悬浮态 `--color-elevated`，不得跳级。
- **Text 选用顺序**：默认 `--color-text` → 次要 `--color-text-2` → 占位 `--color-text-3`。Body 段落不得使用 text-3。
- **Brand 色三处铁律**：见 P3。
- **Semantic 色**：仅用于状态指示（toast / badge / 表单错误 / 进度条）；不得用于品牌装饰。
- **暗色映射**：每个 token 必须有暗色对偶；新增 token 必须同时定义浅/暗两值。

### 3.3 对比度

- 主文本对背景 ≥ WCAG AA（4.5:1）；当前 `#1D1D1F` on `#FFFFFF` 对比度 17.4:1，远超标准。
- Brand CTA 文字（白）对 brand 背景（`#0071E3`）对比度 4.55:1，达标。
- 次要文本（`#6E6E73` on `#FFFFFF`）对比度 4.7:1，达标。

---

## 4. 字体系统

### 4.1 字体栈

```css
--font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display",
                "SF Pro Text", "Helvetica Neue", "Segoe UI",
                system-ui, Roboto, sans-serif;

--font-mono: "SF Mono", ui-monospace, "JetBrains Mono",
             "Fira Code", Menlo, Consolas, monospace;
```

display 与 body 共用同一字栈，靠字号 + 字重区分。

### 4.2 字号梯度

| Token | px | line-height | letter-spacing | 用途 |
| --- | --- | --- | --- | --- |
| `--text-display-xl` | 96 | 1.05 | -0.022em | Hero 主标题（仅 Home） |
| `--text-display-l` | 64 | 1.08 | -0.020em | 子页面 Hero |
| `--text-h1` | 48 | 1.10 | -0.018em | Section 大标题 |
| `--text-h2` | 32 | 1.20 | -0.012em | Section 标题 |
| `--text-h3` | 24 | 1.30 | -0.008em | 卡片标题 |
| `--text-body` | 17 | 1.47 | -0.003em | 正文（**Apple 标配，不是 16**） |
| `--text-body-s` | 15 | 1.45 | 0 | 次要正文 |
| `--text-caption` | 13 | 1.40 | 0 | 元信息 |
| `--text-mono-m` | 13 | 1.40 | 0 | mono 点缀（credits / id / time） |
| `--text-mono-s` | 11 | 1.40 | 0.02em | 标签（PROMPT / DURATION 全大写） |

### 4.3 字重

| 字重 | 数值 | 使用场景 |
| --- | --- | --- |
| Regular | 400 | 正文、说明文字 |
| Medium | 500 | 卡片标题、强调段落 |
| Semibold | 600 | 按钮文字、Section 标题、Hero |

**禁用 Bold (700)**。Apple 风靠字号差 + Semibold 拉权重，Bold 显得粗重不优雅。

### 4.4 移动端字号自适应

Body 字号在 `≤ 768px` 断点降为 16px，Display 系列降一档：

```css
--text-body: clamp(16px, 0.6vw + 14px, 17px);
--text-display-xl: clamp(48px, 8vw + 16px, 96px);
--text-display-l: clamp(40px, 6vw + 16px, 64px);
--text-h1: clamp(32px, 4vw + 16px, 48px);
```

### 4.5 Mono 出现位置（铁律）

仅以下 5 处使用 `--font-mono`：

1. 模型 ID：`kling-2.5-turbo`
2. Credits 数：`25 cr` / `1,250 credits`
3. 生成时间：`00:42` / `2024-04-30 14:23`
4. Prompt 区域 label：`PROMPT` / `DURATION`（全大写 + mono-s）
5. 价格小数：`$9.99/mo` / `$X.XX`

**正文、按钮文字、H1/H2/H3 一律不用 mono**。

---

## 5. 间距与布局

### 5.1 基础网格

8px。所有间距必须为 8 的倍数。移动端可降到 4px 倍数。

### 5.2 间距梯度

13 级：

```
0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 120 / 160 / 240
```

对应 Tailwind：`0 / 1 / 2 / 3 / 4 / 6 / 8 / 12 / 16 / 24 / 30 / 40 / 60`。

### 5.3 页面节奏

| 区域 | 间距 |
| --- | --- |
| Hero 上下 padding | 160–240px（Home 用 240，子页用 160） |
| Section 间距 | ≥ 120px |
| Container max-width | 1120px |
| Container gutter | 24px |
| 卡片内 padding | 24–32px |
| 表单控件之间 | 16px（同组）/ 32px（不同组） |

### 5.4 响应式断点

| 名称 | 宽度 | 用途 |
| --- | --- | --- |
| `sm` | 640px | 大手机 |
| `md` | 768px | 平板（body 字号切换点） |
| `lg` | 1024px | 笔记本 |
| `xl` | 1280px | 桌面（双栏布局触发点） |
| `2xl` | 1536px | 大屏（不变 max-width，仅留白增加） |

---

## 6. 圆角

| Token | 值 | 使用场景 |
| --- | --- | --- |
| `--radius-sm` | 8px | 小标签 / Badge |
| `--radius-md` | 12px | 按钮 / 输入框 / 下拉 |
| `--radius-lg` | 18px | 卡片（默认） |
| `--radius-xl` | 24px | 大卡片 / 模态框 |
| `--radius-pill` | 999px | Pill 标签 / 圆形按钮 |

**头像**用 `--radius-pill`；**图片**默认 `--radius-md`。

---

## 7. 阴影

| Token | 值 | 使用场景 |
| --- | --- | --- |
| `--shadow-modal` | `0 20px 60px -10px rgba(0,0,0,0.15)`（暗色 0.5） | 模态框 / 抽屉 |

**禁用其它 box-shadow**。卡片层次靠 `--color-elevated` + `--color-border` 表达（见 P6）。

---

## 8. 动效

### 8.1 缓动函数

```css
--ease-apple: cubic-bezier(0.42, 0, 0.58, 1);   /* 默认，所有过渡 */
--ease-out:   cubic-bezier(0, 0, 0.58, 1);      /* 入场 */
--ease-in:    cubic-bezier(0.42, 0, 1, 1);      /* 出场（少用） */
```

### 8.2 时长

| Token | 值 | 使用场景 |
| --- | --- | --- |
| `--duration-instant` | 0ms | 同步切换（无过渡） |
| `--duration-fast` | 150ms | hover / focus / press |
| `--duration-normal` | 220ms | tab 切换 / 折叠展开 |
| `--duration-slow` | 320ms | 模态出现 / 页面过渡 |

### 8.3 Hover 规则

Hover 态**只变 ring 与 background**，不变 transform。即：

- ✓ `bg: surface → elevated` + `ring: 1px brand`
- ✗ `transform: translateY(-2px)` 或 `scale(1.02)`

### 8.4 减少动效

尊重 `prefers-reduced-motion: reduce`，命中时所有过渡 duration 设为 0。

---

## 9. 主题策略

### 9.1 默认主题

浅色（`#FFFFFF` 底）。

### 9.2 暗色实现

通过 `<html class="dark">` + `:root.dark` 覆盖同名 CSS 变量。所有组件读 token，不直接读色值，因此组件代码不需要写"if dark"分支。

### 9.3 发布节奏

- MVP：仅启用浅色，暗色 token 完整预埋（参见第 3 节表格 Dark 列）
- 暗色 UI 切换器：留给下一个 change `ui-components`
- 暗色相关测试：本系统提供 token，组件 change 负责 visual regression

---

## 10. Token 命名约定

### 10.1 命名规则

- 所有 design token 用 CSS 变量形式 `--<category>-<role>[-<variant>]`
- 类别：`color` / `font` / `text` / `radius` / `shadow` / `duration` / `ease`
- 不用缩写：用 `--color-border-subtle` 不用 `--clr-bdr-sub`
- 暗色不另起 token；通过 `:root.dark` 覆盖同名值

### 10.2 在 Tailwind 中的暴露

通过 `tailwind.config.ts` 的 `theme.extend` 把 token 映射为 Tailwind 实用类：

- `bg-surface` / `bg-elevated` / `bg-brand`
- `text-default` / `text-2` / `text-3`
- `border-default` / `border-subtle`
- `rounded-md` / `rounded-lg` / `rounded-pill`
- 字号用 `text-display-xl` / `text-h1` / `text-body`

### 10.3 在 Pencil 中的暴露

Pencil 的 Variables 与本文档同名同值，不允许在 Pencil 内创建未在本文档登记的 token。

---

## 11. 禁忌清单

- ❌ 不用纯 `#000` 作正文颜色；用 `--color-text` (`#1D1D1F`)
- ❌ 不用 `box-shadow` 模拟卡片浮起（仅模态/抽屉除外）
- ❌ 不在 brand 蓝以外引入第二个强调色
- ❌ 不在 mono 5 个允许位置以外使用等距字
- ❌ 不在按钮上加 emoji
- ❌ 不让卡片同时有 `box-shadow` 与 `border`
- ❌ 不引入付费 webfont
- ❌ 不用 Bold (700)
- ❌ 不在 hover 上变 transform / scale
- ❌ 不硬编码 hex 颜色，必须走 token
- ❌ 不在 Pencil 直接改 hex（必须先改本文档）
- ❌ 不在 Tailwind config 中重新发明 spacing / radius，必须 import `brand.config.ts`
- ❌ 不在组件内写"if dark mode"分支（让 token 自动切换）

---

## 12. 改设计的标准动作

任何视觉改动按以下三步**有序**执行，顺序不可调换：

1. **改本文档** (`openspec/specs/design-system/spec.md`)
   - 修改 token 值或新增 token
   - 在文档下方增加 changelog 行
2. **同步代码 token**
   - `brand.config.ts` 中的常量
   - `tailwind.config.ts` 中的扩展
   - `app/globals.css` 中的 CSS 变量声明（浅/暗双套）
3. **同步设计稿**
   - 在 `ai-video-aggregator.pen` 中通过 `set_variables` 更新 Variables
   - 检查所有 7 张稿是否仍合规

跳过任一步视为技术债，必须在下一次 PR 内补齐。

---

## 13. 关联资产

| 资产 | 路径 | 角色 |
| --- | --- | --- |
| 设计 spec（本文档） | `openspec/specs/design-system/spec.md` | 唯一真源 |
| 代码常量 | `brand.config.ts` | 运行时 |
| Tailwind 扩展 | `tailwind.config.ts` | 实用类映射 |
| CSS 变量 | `app/globals.css` | 浏览器渲染 |
| 设计稿 | `ai-video-aggregator.pen` | 视觉对照 |
| 决策依据 | `openspec/changes/design-system-jdream/design.md` | 历史背景（archive 后保留） |

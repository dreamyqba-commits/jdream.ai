## 1. Spec 真源（先于代码与设计稿）

- [x] 1.1 在 `openspec/changes/design-system-jdream/specs/design-system/spec.md` 写完整规格：设计哲学（D1）、color tokens 表（浅/暗双列，D2）、字体栈与字号梯度（D3）、间距/圆角/阴影/动效（D4）、双主题策略（D5）、token 命名约定与禁忌清单
- [x] 1.2 在 spec 末尾追加"改设计的标准动作"三步流程（spec → 代码 → Pencil），明确禁止在 Pencil 直接改 hex
- [x] 1.3 自校验：spec.md 能独立解释清"为什么这套 token"（不依赖 design.md 也能读懂）

## 2. 代码 Token 资产

- [x] 2.1 新建 `brand.config.ts`，导出 `colors`（浅/暗双套）、`fontFamily`、`fontSize`、`spacing`、`borderRadius`、`easing`、`duration` 常量
- [x] 2.2 `tailwind.config.ts` import `brand.config.ts`，扩展 `theme.extend`（colors / fontFamily / fontSize / spacing / borderRadius）
- [x] 2.3 在 `app/globals.css` 写 `:root` 与 `:root.dark` 两套 CSS 变量声明，覆盖 D2 全部 color tokens
- [x] 2.4 `globals.css` 设置 body 字栈 `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", system-ui, Roboto, sans-serif`，body 字号 17px / line-height 1.47
- [x] 2.5 加 ESLint 规则：禁止硬编码 hex 颜色（`#xxxxxx`），必须走 token → `.eslintrc.json` no-restricted-syntax

## 3. Pencil 设计稿（按 D6 顺序串行）

- [x] 3.1 **Home（长页 7 屏）** → 帧 `n2h1y3`（`pencil-new.pen`）：Hero + 生成面板 demo + Bento Features + How It Works + Stats + FAQ + Footer
- [x] 3.2 **Generate（产品工作台）** → 帧 `Q9weI`：左 prompt 输入 + 模型/参数 + 右预览区 + 顶部 credits 余额（mono 点缀）
- [x] 3.3 **Model Detail** → 帧 `H6ssRT`：模型大图 demo + 卖点 + Try Now CTA + 同类推荐 + FAQ
- [x] 3.4 **Tool Single** → 帧 `klVxr`：工具说明 + 上传/输入 + 输出示例 + 使用场景 + 价格说明
- [x] 3.5 **Pricing** → 帧 `hA8MV`：Free/Lite/Pro/Premium 四档 + 月年切换 + Credits 包对照 + FAQ
- [x] 3.6 **Use Cases** → 帧 `g5F75`：场景卡片网格
- [x] 3.7 **History（含空态子稿）** → 帧 `VA9LC`（主稿）+ `WClJ9`（空态）

## 4. 每张稿的合规检查（强制）

- [x] 4.1 全部 7 张稿顶部使用同一 Header（Jdream.ai wordmark + 主导航），Footer 含模型列表 + 法律入口
- [~] 4.2 每张稿至少 1 处 SF Mono 点缀 — **SF Mono / Menlo 在 Pencil MCP 不可用，已用 Inter 替代标注 mono 位置；待 Pencil 支持后补换字体**
- [x] 4.3 每张稿至少 1 个 `--color-brand` CTA（仅出现在 primary CTA / 关键超链 / 焦点环）
- [x] 4.4 每张稿不出现 box-shadow（除模态/抽屉外），层次仅靠 `--color-elevated` + 1px hairline
- [x] 4.5 全部 7 张稿仅出英文版

## 5. 同步与交付

- [~] 5.1 帧命名：7 个 Frame 已用 `home / generate / model-detail / tool-single / pricing / use-cases / history`（含 `history-empty` 子 Frame）命名 — **文件保存为 `pencil-new.pen`，非原计划的 `ai-video-aggregator.pen`，待确认是否重命名**
- [ ] 5.2 在 spec.md / brand.config.ts / Pencil 三处对照检查所有 token 命名一致（color / font / radius / spacing）
- [ ] 5.3 把设计稿文件提交到仓库（不要进 .gitignore）
- [ ] 5.4 在 PR 描述中放 7 张稿的截图（用 Pencil `export_nodes` 出 PNG），便于离线 review
- [ ] 5.5 准备移交给下一个 change `ui-components`：列出本 change 已锁定的 token 清单与未实现的组件清单

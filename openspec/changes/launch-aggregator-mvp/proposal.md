## Why

独立开发者要在海外做 AI 视频/图片工具站，单模型订阅成本高、跳来跳去体验差，市场需要"一次订阅、覆盖所有主流模型"的聚合站。21 天内必须上线最小可付费产品，否则错过当下流量窗口、上游 API 价格也会持续变动。本次提案确立 MVP 的功能边界、技术方案与上线门槛，使后续设计/规格/任务可直接落地。

## What Changes

**前置 change `design-system-jdream` 已完成，本 change 直接继承其产出：**
- ✅ **已完成**：`brand.config.ts` — 浅/暗双套色值、字体栈、字号梯度、间距、圆角、动效曲线常量
- ✅ **已完成**：`tailwind.config.ts` — import brand.config，CSS 变量映射到所有 Tailwind token
- ✅ **已完成**：`app/globals.css` — `:root` + `:root.dark` 两套 CSS 变量（42 个），body 17px/1.47
- ✅ **已完成**：`.eslintrc.json` — 禁止硬编码 hex 颜色的 ESLint 规则
- ✅ **已完成**：`pencil-new.pen`（即 `ai-video-aggregator.pen`）— 8 张高保真 Pencil 稿作为前端唯一视觉真源：
  - `Home`（7 屏长页：Hero / Demo / Bento Features / How It Works / Stats / FAQ / Footer）
  - `Generate`（双栏工作台：左侧 Prompt + 参数，右侧预览 + 近期记录，顶部 credits 余额）
  - `ModelDetail`（暗色 Hero + 能力卡 + 相关推荐 + 模型专属 FAQ）
  - `ToolSingle`（Dropzone + 设置 + 输出预览 + 价格提示）
  - `Pricing`（4 档计划 + 月年切换 + credits 包对照）
  - `UseCases`（8 场景卡：广告 / 短剧 / 婚礼 / 电商 / 教育 / 游戏 / 健身 / 美妆）
  - `History`（侧边栏列表 + 大预览 + 状态标签 + Download/Delete 操作）
  - `history-empty`（空态友好引导 + 跳 Generate 的主 CTA）

**本 change 新增：**
- **新增**：完整可付费 Web 站点，覆盖 Google 登录、订阅与 Credits、多模型生成（视频 ≥5 / 图片 ≥3）、历史与下载、合规三件套。
- **新增**：异步生成管线（Webhook 主推 + 2s 轮询兜底 + 5 分钟超时主动查询 + 失败必退 Credits）。
- **新增**：Provider Adapter，至少接 2 家上游避免单点故障。
- **新增**：SEO/GEO 落地页矩阵（每模型/每工具独立页面 + sitemap/robots/hreflang/JSON-LD/llms.txt/ai.txt）。
- **新增**：Creem.io 主收款 + DodoPayments 备份；Postgres RPC `create_generation_atomic` 防 Credits 并发双扣。
- **非目标（不做）**：团队协作、对外 API、后台管理系统、原生 App、自建 GPU/模型。

## Capabilities

### New Capabilities
- `auth`: Google OAuth 登录、Supabase Auth 会话管理、跨页面持久化与登出。
- `multi-model-generation`: 统一 Prompt 面板、模型按"快速/标准/电影"分档路由、Provider Adapter 接入多家上游。
- `generation-pipeline`: 异步任务管线（Webhook 主推 + 轮询兜底 + 超时主动查询 + 失败退还 Credits + 并发限流）。
- `credits-billing`: Credits 余额、原子扣减 RPC、月清零、生成失败自动退还、对账流水。
- `subscription`: 月/年订阅套餐（Free/Lite/Pro/Premium）、Creem 主、Dodo 备、Webhook 幂等到账。
- `history-and-assets`: 用户历史记录列表、单条预览、24h 临时签名链接下载、删除、生命周期清理（Free 7 天）。
- `seo-geo`: 模型/工具/模板/对比文/FAQ 多页矩阵、sitemap/robots/hreflang/6 类 JSON-LD、llms.txt/ai.txt。
- `compliance-pages`: 用户协议、隐私政策、联系我们、Cookie 提示、DMCA 入口。

### Modified Capabilities
<!-- 项目首次落地，无既有 spec 需要修改 -->

## Impact

### 代码库
从零搭建 Next.js 15 + TypeScript 单仓项目，营销落地页（SSG/ISR）与工作台（RSC + Client Boundary）共享同一框架。设计 token 已由 `design-system-jdream` 提供，直接 import 无需重建。

### 基础设施（新增）
| 服务 | 用途 | 月固定成本 |
| --- | --- | --- |
| Vercel（免费版） | 部署 + 全球 CDN，推送即上线 | $0 |
| Supabase（免费版） | Postgres + Auth + RLS，≤ 500MB / 50K MAU | $0 |
| Cloudflare R2 | 视频/图片存储，出口流量 $0 | $0（≤10GB） |
| Cloudflare DNS | 域名解析 + DDoS 防护 | $0 |
| 域名 | 年付摊销 | ~$1–2/mo |

### 第三方服务（需提前注册）
| 服务 | 用途 | 备注 |
| --- | --- | --- |
| Google Cloud OAuth | 一键登录 | 需配 Consent Screen，"External + Testing"先上 |
| Creem.io | 主收款通道 | 需提交 ToS/Privacy/Contact 才能通过审核 |
| DodoPayments | 备用收款通道 | 与 Creem 并行申请，`BILLING_PRIMARY` 切换 |
| Wise | USD → CNY 提现 | 开户需护照 |
| piapi.ai / grsai / fal.ai | 上游模型 API | 至少接 2 家避免单点 |
| Sentry | 前后端错误追踪 | 免费 5K events/mo 起步 |
| Google Analytics 4 | 流量分析 | Cookie 同意后才加载 |

### 数据
新增 7 张核心 Postgres 表：`users`、`subscriptions`、`credits_transactions`、`generations`、`models`、`templates`、`webhooks_log`。关键原子函数：`create_generation_atomic`（防并发双扣）、`refund_generation`（幂等退款）。

### 视觉资产（已由 design-system-jdream 完成）
8 张 Pencil 高保真稿即开发视觉真源，具体帧 ID：
| 页面 | Pencil 帧 | 路由 |
| --- | --- | --- |
| Home | `n2h1y3` | `/` |
| Generate | `Q9weI` | `/app` |
| Model Detail | `H6ssRT` | `/m/{slug}` |
| Tool Single | `klVxr` | `/tool/{slug}` |
| Pricing | `hA8MV` | `/pricing` |
| Use Cases | `g5F75` | `/use-cases` |
| History | `VA9LC` | `/history` |
| History Empty | `WClJ9` | `/history`（空态） |

### 成本预估
| 阶段 | DAU | 月固定 | 月变动（API） | 合计 |
| --- | --- | --- | --- | --- |
| MVP | < 50 | ~$2 | < $20 | < $25 |
| 早期 | 50–500 | ~$2 | $20–100 | $25–105 |
| 成长 | 500–1000 | ~$5 | $100–200 | $105–205 |

### 合规红线
发布前必须上线 `/terms`、`/privacy`、`/contact` 三页并在 Footer 可达，否则 Creem 不予审核通过，影响整体上线时间。

### 风险摘要
| 风险 | 缓解策略 |
| --- | --- |
| 上游 Provider 单点故障 | 双 Provider + 连续 3 次 5xx 自动降级 |
| Creem 审核卡壳 | 并行申请 Dodo，`BILLING_PRIMARY` 一键切换 |
| Credits 并发双扣 | Postgres RPC 事务 + 行级锁 + 唯一索引 |
| 视频存储成本爆炸 | R2 Lifecycle Rules：Free 7 天清，退订 30 天清 |
| SEO 收录慢 | 上线即提交 Search Console；落地页矩阵 ≥ 8 模型页开局 |

## Dependencies

本 change 依赖以下前置条件全部满足后才能开始实施：

| 依赖项 | 状态 | 说明 |
| --- | --- | --- |
| `design-system-jdream` change | ✅ 已完成 | brand.config.ts / tailwind.config.ts / globals.css / 8 张 Pencil 稿 |
| Supabase 项目创建 | ⬜ 待完成 | 选 Singapore 或 US East Region，保存 DB 密码 |
| Cloudflare 账号 + R2 bucket | ⬜ 待完成 | 创建私有 bucket `zopc-media`，生成 Object R/W Token |
| Google Cloud OAuth Consent Screen | ⬜ 待完成 | External + Testing 模式先行，上线前改 Production |
| Creem.io 账号申请 | ⬜ 待完成 | 同时申请 DodoPayments 作备份 |
| 域名注册 + DNS 切 Cloudflare | ⬜ 待完成 | 影响 Vercel 自定义域名绑定 |
| 上游模型 API key（≥ 2 家） | ⬜ 待完成 | piapi.ai 和 fal.ai 各申请 + 充值测试额度 |

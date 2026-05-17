## Context

项目为 0 到 1 的 AI 视频/图片聚合 SaaS，独立开发者实施，21 天内必须上线可付费 MVP。详细产品口径见 `PRODUCT_SPEC.md`，本文档负责把那份产品规格翻译成可执行的工程方案。约束：

- 团队 1 人（≤ 3 人）；零运维带宽。
- MVP 月固定成本 < $30，1000 DAU 可控在 < $200。
- 上游模型多家、能力差异大、API 风格不统一。
- 海外目标市场，必须 SEO/GEO 友好且合规（GDPR/CCPA）。

## Goals / Non-Goals

**Goals:**
- 一个 Next.js 单仓同时承载营销落地页（SEO 入口）与工作台（产品功能），两类页面共享设计 token。
- 异步生成管线对前端透明：用户不感知 Webhook / 轮询的复杂度；失败必退 Credits。
- 数据一致性优先：Credits、订阅、Webhook 全部强幂等；数据库为唯一可信来源。
- Provider Adapter 模式让"接第二个模型"在数据表里加一行就完成。
- 上线即可被 Google / Bing 收录，AI 搜索引擎可识别站点定位。

**Non-Goals:**
- 不自建 GPU、不自训模型、不自营队列基础设施。
- 不做团队/协作空间、不开放对外 API、不做后台管理系统、不做原生 App。
- MVP 阶段不做 SSE / WebSocket（轮询足够），不做多 Region 部署。
- MVP 阶段不做 A/B 实验平台、不做用户行为细粒度埋点（仅 GA4 + Sentry 起步）。

## Decisions

### D1 · 框架与部署：Next.js 15 + Vercel
- **选择**：Next.js 15 App Router（Server Components 为主）+ Vercel 免费版部署，绑自定义域名 + Cloudflare DNS。
- **理由**：营销页用 SSG/ISR 吃 SEO，工作台用 RSC + Client Boundary，单一仓库省心；Vercel 免运维，绑 GitHub 推送即部署；免费额度足够 MVP。
- **替代**：Remix / Astro + 单独后端 → 多一份运维成本；自建 Node + Nginx → 不符合"21 天 + 1 人"约束。

### D2 · 数据库与 Auth：Supabase（Postgres + Auth + RLS）
- **选择**：Supabase 一站式（Postgres / Auth / Storage 不用 / Realtime 不用）；Auth 启用 Google OAuth；表权限走 Row Level Security。
- **理由**：免费 500MB DB + 50K MAU Auth；RLS 让"用户只看自己的数据"由数据库保证，避免业务层逻辑漏洞；带原生 Postgres，可以写 RPC 解决并发扣费。
- **替代**：Clerk + Neon → 可用但拆成两家服务，初期复杂度高；Auth0 → 价格不友好。

### D3 · Credits 原子扣减：Postgres RPC
- **选择**：所有"扣 Credits + 创建任务"走单个 RPC `create_generation_atomic(user_id, model_id, prompt, credits_to_deduct)`，事务内完成校验、扣减、流水、任务行；返回 `generation_id` 或抛 `INSUFFICIENT_CREDITS`。
- **理由**：行级锁 + 事务一次性解决双扣；业务代码不再处理"先查再扣"的竞态；流水可独立审计。
- **替代**：应用层乐观锁 → 多客户端时易失败重试；Redis 计数器 → 多一份依赖、对账复杂。

### D4 · 生成管线：Webhook 主推 + 2s 轮询兜底 + 5min 主动查询
- **选择**：MVP 走"前端轮询 + 后端 Webhook"双通道。前端每 2s 轮询 `/api/status/:id`，5 分钟超时由后端主动 `GET` 上游兜底；任何最终失败必退 Credits。
- **理由**：实现成本最低，Vercel Serverless 友好；500 DAU 内不会被轮询拖垮。
- **替代**：SSE → 长连接 + Vercel 不友好；Queue（Inngest / QStash）→ 工程量翻倍，留待 500 DAU 后再升级（已在 Risk 中标注阈值）。

### D5 · Provider Adapter 抽象
- **选择**：定义 `VideoProvider` / `ImageProvider` 接口（`submit / status / parseWebhook`），具体实现按上游一一写适配；`models` 表是配置中心（含 `provider`、`provider_model_id`、`credits_per_second`、`enabled`）。
- **理由**：聚合站灵魂；新增模型 INSERT 一行即可，业务代码零改动。
- **替代**：直接为每个上游写专用 API → 代码重复 + 路由策略难统一。

### D6 · 媒体存储：Cloudflare R2 + 24h 签名链接
- **选择**：上游回调成功后，由后端拉取产出 → 落 R2（私有 bucket）→ 对外仅暴露后端签发的 24h 签名 URL。
- **理由**：R2 出口流量 0 费，对视频站差异巨大；签名链接避免直链滥用；生命周期规则按用户类型自动清理。
- **替代**：S3 → 出口流量费用爆炸；Bunny → 控制面不如 R2 + Cloudflare 一体化。

### D7 · 收款双通道：Creem.io 主 + DodoPayments 备
- **选择**：主跑 Creem，发版前同时申请 Dodo；通过 `BILLING_PRIMARY` 环境变量切主。Webhook 双方都接，事件 `event_id` 落 `webhooks_log` 唯一索引保证幂等。
- **理由**：Creem 国内开发者友好但审核可能卡壳；Dodo 备份保障收款不停摆。
- **替代**：Stripe → 国内主体注册门槛高；Lemon Squeezy → 体验不错但费率与 Creem 类似，做备选可考虑替代 Dodo。

### D8 · 国际化与设计 Token  ✅ Token 部分已锁定（change `design-system-jdream` 完成）
- **选择**：next-intl + `/{locale}/*` 路由前缀；设计 token 集中在 `brand.config.ts` + `tailwind.config.ts` + `app/globals.css`；视觉真源为 `pencil-new.pen`（8 张高保真稿）。
- **已锁定产出**：
  - 品牌：**Jdream.ai**，wordmark 文字占位，暂无图形 logo
  - 品牌色：Apple System Blue **`#0071E3`**（浅色）/ `#0A84FF`（暗色），全站唯一强调色
  - 仅用于 3 处：primary CTA / 关键文本超链 / focus ring
  - 字体：系统字栈（`-apple-system … system-ui, Roboto`），零授权费，Lighthouse 零额外加载
  - Mono 点缀（`SF Mono` fallback 链）仅用于 5 处：model ID / credits 数 / 生成时间 / prompt label / 价格小数
  - 无 `box-shadow`（除模态/抽屉），层次仅靠 `--color-elevated` + 1px hairline
  - ESLint 规则禁止硬编码 hex，`brand.config.ts` 与 `globals.css` 豁免
  - 8 张 Pencil 稿（Home / Generate / ModelDetail / ToolSingle / Pricing / UseCases / History / history-empty）
- **未锁定（本 change 落地时确认）**：
  - Pricing 具体数字（设计稿以 `$X.XX` 占位，上线前由运营填写）
  - next-intl 第二语言时间点（MVP 期间英文 + `x-default`，不另设时间表）
- **理由**：URL 自带语言前缀利于 SEO；token 集中后换皮成本极低；Pencil 稿先于代码，PR 含截图对比。
- **替代**：直接 Tailwind hardcode → 被 ESLint 拦截；Figma → 无 Pencil MCP 工具链加成。

### D9 · 数据模型（7 张核心表）
- `users`、`subscriptions`、`credits_transactions`、`generations`、`models`、`templates`、`webhooks_log`。
- 关键约束：
  - `credits_transactions(user_id, ref_type, ref_id, reason)` 唯一索引（同一退款只发生一次）。
  - `generations.cost_usd` 必填（毛利分析）。
  - `webhooks_log.event_id` 全局唯一。
  - 全表启用 RLS：`generations`、`subscriptions`、`credits_transactions` 仅本人可读，`models`、`templates` 公开只读。

### D10 · SEO/GEO 静态化
- 落地页与博客 / 对比文 / FAQ 用 next-mdx-remote + gray-matter，编译期渲染；模型/工具单页采用 ISR（`models` 表更新后 1h 内重新生成）；sitemap.ts/robots.ts 自动产出；JSON-LD（6 类）通过 `<Script>` 注入；`/llms.txt`、`/ai.txt` 在 `app/` 目录暴露为 route handler。

### D11 · 观测与告警
- 前后端均接 Sentry；GA4 仅在用户接受 Cookie 后加载；关键事件（订阅成功/失败、生成失败、Webhook 重复、Provider 降级）打点到 Sentry breadcrumbs + GA4 自定义事件；初期不引入 PostHog（控成本）。

## Risks / Trade-offs

| 风险 | 应对 |
| --- | --- |
| 单一上游 Provider 故障导致核心功能瘫痪 | 至少接 2 家 Provider，连续 3 次 5xx 自动降级；运营可手动通过环境变量切主备 |
| 轮询在并发上升后拖垮 Vercel 配额 | 设阈值：500 DAU 时升级到 Inngest / Trigger.dev / QStash + Webhook 模式，前端改 SSE/WebSocket |
| Creem 审核未过或提现不通 | 同时申请 Dodo；上线前确保 Terms/Privacy/Contact 三件套已可访问 |
| 视频存储费用随用户规模爆炸 | R2 + Lifecycle Rules：Free 7 天清；付费用户退订 30 天清；监控月度存储增量 |
| Credits 并发双扣 | Postgres RPC 事务 + 行级锁；写入流水的同时由唯一索引兜底，杜绝双倍扣减或双倍退款 |
| Webhook 丢消息 | 5 分钟未到，后端主动 `GET` 上游查询 + `webhooks_log.event_id` 幂等保护 |
| Google 收录慢 / SEO 流量起不来 | 上线即提交 Search Console / Bing Webmaster；落地页矩阵开局就有 ≥ 8 个模型页 + ≥ 5 个工具页 + FAQ + JSON-LD |
| 上游内容审核结果不一致 | 失败必退 Credits + 前端明确文案；后续在站点侧加二级审核仅作为加固，不替代上游 |
| 多语言翻译质量 | MVP 仅上线英文 + 结构预留，避免半成品多语言伤 SEO |
| 设计 token 漂移 | 集中在 `brand.config.ts` + `tailwind.config.ts`，PR 级 lint 强制使用 token，不允许硬编码颜色/字体 |

## Migration Plan

> 该项目为新建项目，不存在历史数据迁移。"Migration"用于描述发布与回退策略。

**前置（change `design-system-jdream`）✅ 已完成**：
- `brand.config.ts` / `tailwind.config.ts` / `app/globals.css` / `.eslintrc.json` 已落库
- 8 张 Pencil 高保真稿已完成，可作视觉验收基准

**编码阶段（21 天计划）**：

1. **Day 0–2（前置准备）**：完成 task 0.1–0.8（域名 / Supabase / R2 / OAuth / 收款账号 / API key / 仓库 / 环境变量）。
2. **Day 3–7（脚手架）**：Next.js 15 初始化 + Supabase 建表迁移 + Provider Adapter 骨架；提交 `main` 触发 Vercel preview；能登录、能发出一次 hello world generation。
3. **Day 8–14（核心功能）**：生成管线 + Credits + Webhook + 订阅全链路；Sandbox key 走通 Creem；所有失败路径自动退还 Credits。
4. **Day 15–17（落地页 + SEO）**：首页七屏（对照 Pencil 帧 `n2h1y3`）+ 模型单页 ≥ 8 + 工具单页 ≥ 5 + sitemap/robots/JSON-LD；preview 通过 Lighthouse ≥ 80。
5. **Day 18–19（合规 + 收款切生产）**：`/terms`、`/privacy`、`/contact` 上线；切换 Creem 生产 key + Wise 收款验证。
6. **Day 20**：切换自定义域名到 Vercel production；灰度 24h（仅内测）。
7. **Day 21**：正式发布 → 提交 Google Search Console / Bing Webmaster sitemap → 公开推广。

**回退策略**：
- Vercel "Promote previous deployment" 一键回退，零停机。
- Supabase migrations 走幂等脚本，回退时仅停写新表，不需要 down 脚本（数据保留）。
- 收款通道：`BILLING_PRIMARY=dodo` 即可旁路 Creem，无需改代码。

## Open Questions

> 标注 ✅ 的问题已由 `design-system-jdream` change 锁定，无需再议。

1. ✅ **品牌名 / Logo**：品牌名 **Jdream.ai** 已确认，wordmark 文字占位，暂无图形 logo；`brand.config.ts` 与 OG image 模板以此为准。
2. **视频 / 图片模型首发清单**：Pencil 稿中已展示 5 个视频模型（Sora / Runway Gen-3 / Kling 1.6 / Pika 2.0 / Luma Dream Machine），需确认：① 图片模型 3 个具体清单；② 以上视频模型是否全部上线，还是精选其中有合规 API 的子集。影响 `models` seed 与 `/m/{slug}` 静态页。
3. ✅ **第二语言**：MVP 期间仅上线英文 + `x-default` 预留，不另设第二语言时间表，避免半成品伤 SEO。
4. **Pricing 具体数字**：设计稿中以 `$X.XX` 占位，4 档结构（Free / Lite / Pro / Premium）已确定。需确认：① 具体月价；② 年付折扣比例；③ 是否启用地区差异化定价。上线前填写替换占位符。
5. **Creem 主体注册**：个人还是公司注册？是否需等公司注册完成？影响 Day 19 支付切换时间点。
6. **客服/工单系统**：邮箱起步，还是直接接 Crisp / Intercom？MVP 期间建议邮箱起步控成本。
7. **模板（templates 表）**：是否作为 MVP 一部分？若是，首发模板数量目标？若否，MVP 期间该表保留但 `enabled=false`。

## 0. 前置准备（开始编码前必须全部完成）

- [ ] 0.1 注册域名（Spaceship / Porkbun），DNS 切到 Cloudflare，确认 A 记录可解析
- [ ] 0.2 创建 Supabase 项目，Region 选 Singapore 或 US East，保存 DB URL / anon key / service key
- [ ] 0.3 注册 Cloudflare R2，创建私有 bucket `zopc-media`，生成 Object R/W API Token
- [ ] 0.4 在 Google Cloud Console 创建项目 + OAuth Consent Screen（External + Testing），生成 Client ID / Secret
- [ ] 0.5 申请 Creem.io 账号（同时申请 DodoPayments 备份），获取 API key 与 Webhook secret
- [ ] 0.6 申请上游模型 API（piapi.ai + fal.ai 各充值测试额度），保存 key 到 `.env.local`
- [ ] 0.7 在 GitHub 建仓 `zopc`，在 Vercel 导入仓库并绑定自定义域名（preview + production）
- [ ] 0.8 在 Vercel 与本地配置全部环境变量，跑 `vercel env pull` 同步到 `.env.local`

## 1. 项目脚手架与基础设施

- [ ] 1.1 初始化 Next.js 15 + TypeScript + App Router（GitHub 仓库已由 0.7 建好，此步 `npx create-next-app`）
- [x] 1.2 接入 Tailwind CSS、shadcn/ui、Radix Primitives；**`brand.config.ts` / `tailwind.config.ts` / `app/globals.css` 已由 `design-system-jdream` 提供，直接复用，无需重建**
- [x] 1.3 配置 Prettier / 提交钩子（lint-staged）；**ESLint 禁止硬编码 hex 规则已写入 `.eslintrc.json`，本步骤补齐 Prettier + lint-staged 即可**
- [ ] 1.4 接入 next-intl，建立 `/[locale]/` 路由前缀，默认 `en`，预留第二语言结构
- [ ] 1.5 创建 Supabase 项目（Region 选 Singapore 或 US East），保存 DB 密码
- [x] 1.6 在 Supabase 写迁移：建表 `users / subscriptions / credits_transactions / generations / models / templates / webhooks_log`，加索引与约束 → `001_initial_schema.sql`
- [x] 1.7 在 Supabase 配置 RLS：`generations / subscriptions / credits_transactions` 仅本人可读，`models / templates` 公开只读 → `002_rls.sql`
- [x] 1.8 写 Postgres 函数 `create_generation_atomic` 与 `refund_generation`（含唯一约束防重复退款）→ `003_rpc_functions.sql` + `005_add_credits_rpc.sql`
- [x] 1.9 ~~注册 Cloudflare R2~~ → **已由 task 0.3 完成**，本步骤只需配置 R2 SDK（`@aws-sdk/client-s3` + custom endpoint）并写上传 / 签名 URL 工具函数 → `lib/r2/client.ts`
- [ ] 1.10 ~~注册域名 / DNS~~ → **已由 task 0.1 完成**，本步骤只需验证 Vercel 域名绑定 DNS 记录已生效
- [ ] 1.11 ~~Vercel 导入仓库~~ → **已由 task 0.7 完成**，本步骤只需确认 preview 部署成功并可访问
- [ ] 1.12 ~~配置环境变量~~ → **已由 task 0.8 完成**，本步骤只需验证 `process.env` 各 key 在 Vercel Functions 中可读

## 2. 认证（capability: auth）

- [ ] 2.1 ~~Google Cloud Console 建项目 + Consent Screen~~ → **已由 task 0.4 完成**
- [ ] 2.2 创建 OAuth Client ID（Web），回调填 Supabase callback URL（`https://{project}.supabase.co/auth/v1/callback`）
- [ ] 2.3 在 Supabase Authentication → Providers → Google 启用并粘贴 Client ID/Secret
- [ ] 2.4 在 Supabase URL Configuration 配置回调白名单（localhost + 生产域名）
- [x] 2.5 安装 `@supabase/supabase-js` 与 `@supabase/ssr`，创建浏览器端与服务端 client → `lib/supabase/client.ts` + `lib/supabase/server.ts`
- [x] 2.6 实现 Next.js middleware 校验受保护路由，未登录跳转携带 `redirectTo` → `middleware.ts`
- [x] 2.7 实现 `/auth/callback` route handler 完成 code exchange + upsert `users`（首登发放 50 Free Credits）→ `app/auth/callback/route.ts`
- [x] 2.8 实现登录按钮组件（`app/login/page.tsx` + `app/api/auth/google/route.ts`）
- [x] 2.9 实现 `/account` 页面与 `Sign out` 操作，验证退出后访问 `/app` 被重定向 → `app/account/page.tsx`

## 3. 数据模型与配置（capability: multi-model-generation 基础）

- [x] 3.1 编写 `models` seed：上线 ≥ 5 视频 + ≥ 3 图片，含 `provider / provider_model_id / credits_per_second / tier / enabled` → `004_models_seed.sql`
- [x] 3.2 编写 `Provider` 接口（TypeScript），定义 `submit / status / parseWebhook` 签名 → `lib/providers/types.ts`
- [x] 3.3 至少实现 2 家 Provider 适配（piapi + fal.ai），覆盖视频 → `lib/providers/piapi.ts` + `lib/providers/fal.ts`
- [x] 3.4 实现"档位 → 模型"路由表与降级策略（连续 3 次失败标记降级 + 自动 fallback）→ `lib/providers/index.ts`
- [ ] 3.5 写单元测试：路由表、扣费换算、降级触发条件

## 4. 生成管线（capability: generation-pipeline）

- [x] 4.1 实现 `POST /api/generate`：调 `create_generation_atomic` → 调上游 `submit` → 写回 `provider_job_id` → `app/api/generate/route.ts`
- [x] 4.2 实现 `GET /api/status/:id`：返回 `status / asset_url`，仅本人可读 → `app/api/status/[id]/route.ts`
- [x] 4.3 实现 `POST /api/webhook/[provider]`：验签 + `webhooks_log.event_id` 唯一索引保证幂等 + 拉资源落 R2 + 更新状态 → `app/api/webhook/[provider]/route.ts`
- [x] 4.4 实现"主动查询" cron（Vercel Cron 每分钟）→ `app/api/cron/route.ts` + `vercel.json`
- [x] 4.5 实现失败退款：上游 FAILED / 超时 → 调 `refund_generation` 写流水（webhook + cron 均已处理）
- [x] 4.6 实现并发限流：按 `users.plan` 计算当前 pending 数，超限返回 429 → `app/api/generate/route.ts`
- [ ] 4.7 端到端联调：成功路径、上游 5xx、超时、内容审核拒绝、Webhook 重复推送、并发提交

## 5. 工作台 UI（capability: multi-model-generation）

> 视觉真源：Pencil 帧 `Q9weI`（Generate），文件 `pencil-new.pen`。

- [x] 5.1 实现 `/app` 双栏布局（桌面：左输入栏 + 右预览区）+ 移动端垂直堆叠 → `app/app/page.tsx`
- [ ] 5.2 实现模型选择器（按"快速 / 标准 / 电影"分组下拉，禁用态灰显但可见）— 当前为平铺选择，待补分组
- [x] 5.3 实现 Prompt textarea / 时长 / 宽高比输入控件，实时估算信用消耗
- [x] 5.4 实现等待页/预览区：加载动画 + 状态文案 + 错误态 + `<video>` 播放器 + 下载按钮
- [ ] 5.5 Header 固定显示 `◆ {credits}` 实时余额（待接入用户 credits_balance）

## 6. Credits 与订阅（capability: credits-billing + subscription）

- [x] 6.1 实现 `/pricing` 页，月年切换 toggle + Free/Lite/Pro/Premium 四档 + credits 对照 → `app/pricing/page.tsx`
- [ ] 6.2 接入 Creem.io：创建产品、价格、获取 checkout URL，前端跳转
- [x] 6.3 实现 `POST /api/webhook/creem`：HMAC 验签 + 幂等 + 创建/更新 `subscriptions` + 发放 Credits → `app/api/webhook/creem/route.ts`
- [ ] 6.4 接入 DodoPayments 备份通道
- [x] 6.5 实现续订发放（`subscription.renewed` 事件 → top-up credits）
- [ ] 6.6 实现 `Cancel subscription` UI
- [x] 6.7 实现账户中心 Credits 流水视图（最近 20 条）→ `app/account/page.tsx`
- [ ] 6.8 sandbox 全链路测试

## 7. 历史与下载（capability: history-and-assets）

> 视觉真源：Pencil 帧 `VA9LC`（History 主稿）、`WClJ9`（history-empty 空态）。

- [ ] 7.1 实现 `/history` 双栏：左侧边栏含搜索 + 状态过滤 + 分页 — 当前为单栏列表，待补侧边栏与搜索
- [x] 7.2 空态（0 条记录）对照帧 `WClJ9`：居中文案 + "Start generating" 主 CTA → `app/history/page.tsx`
- [x] 7.3 每条记录展示模型名 + 时长 + 相对时间 + 状态徽章 → `app/history/page.tsx`
- [x] 7.4 实现 `Download` 按钮：后端签发 24h R2 预签名 URL → `app/api/download/route.ts`
- [ ] 7.5 实现 `Delete`：标记 `status='DELETED'` + 异步删除 R2 资源
- [ ] 7.6 配置 R2 Lifecycle Rules：Free 7 天清；付费用户退订 30 天清

## 8. SEO / GEO（capability: seo-geo）

- [ ] 8.1 首页对照 Pencil 帧 `n2h1y3`（Home，5207px 长页）完整复刻：Hero → Demo → Bento Features → How It Works → Stats → FAQ（≥ 8 条）→ Footer — 当前已有基础首页，待补 Bento / Stats / FAQ 区块
- [ ] 8.2 用 ISR 实现 `/m/{model-code}` 模型单页（≥ 8 个），对照 Pencil 帧 `H6ssRT`
- [ ] 8.3 实现 `/tool/{tool-slug}` 工具单页（≥ 5 个），对照 Pencil 帧 `klVxr`
- [ ] 8.4 用 next-mdx-remote 实现 `/blog` 与 `/compare/{a-vs-b}` 框架，至少 3 篇对比文上线
- [x] 8.5 实现 `app/sitemap.ts`（含全部公开页）与 `app/robots.ts` → 已完成
- [ ] 8.6 注入 6 类 JSON-LD：`Organization / WebSite / SoftwareApplication / Product+Offer / FAQPage / BreadcrumbList`
- [ ] 8.7 配置 hreflang（`en` + `x-default`）
- [x] 8.8 暴露 `/llms.txt` → `app/llms.txt/route.ts`（`/ai.txt` 待补）
- [ ] 8.9 提交 Google Search Console 与 Bing Webmaster

## 9. 合规（capability: compliance-pages）

- [x] 9.1 撰写 `/terms` → `app/terms/page.tsx`
- [x] 9.2 撰写 `/privacy` → `app/privacy/page.tsx`
- [ ] 9.3 实现 `/contact` 联系表单（含 reCAPTCHA + 入库 + 邮件通知）— 当前仅展示邮箱，待补表单
- [x] 9.4 提供 DMCA 投诉入口 → `app/dmca/page.tsx`
- [ ] 9.5 实现 EU IP Cookie banner（Accept all / Reject non-essential / Manage），未同意前不加载 GA4
- [x] 9.6 全站 Footer 固定 Terms / Privacy / Contact 链接 → `components/footer.tsx`

## 10. 观测与发布

- [ ] 10.1 接入 Sentry（前后端），打通 source map
- [ ] 10.2 接入 Google Analytics 4（仅在 Cookie 同意后加载）
- [ ] 10.3 关键事件埋点：注册 / 订阅成功 / 生成成功 / 生成失败 / Provider 降级 / Webhook 重复
- [ ] 10.4 端到端 Lighthouse：首页 ≥ 90，模型/工具页 ≥ 80
- [ ] 10.5 灰度 24h（仅自己 + 内测邀请），观察 Sentry / 收款 sandbox / Webhook 幂等
- [ ] 10.6 切换 Creem 生产 key + Wise 收款链路连通
- [ ] 10.7 上线，发布到 Search Console / Bing；首页提交收录
- [ ] 10.8 上线后 7 天内每日检查：首页是否被收录、Sentry P0 报错、收款到账延迟

## 11. 验收门槛（必须全部通过才算上线）

- [ ] 11.1 ≥ 5 视频 + ≥ 3 图片模型可正常生成；任一失败自动退款
- [ ] 11.2 Google OAuth 登录成功率 ≥ 99%（一周观察）
- [ ] 11.3 单次生成 P95 ≤ 60s
- [ ] 11.4 Creem Webhook 到账延迟 ≤ 60s，幂等无重复扣款
- [ ] 11.5 Lighthouse Performance：首页 ≥ 90、模型/工具页 ≥ 80
- [ ] 11.6 sitemap.xml / robots.txt / llms.txt / ai.txt 全部 200 可访
- [ ] 11.7 Terms / Privacy / Contact / DMCA 全部独立可达
- [ ] 11.8 主备 Provider 任一故障可手动切换并继续生成
- [ ] 11.9 Sentry 接入有效，前后端错误均能上报
- [ ] 11.10 R2 直链不暴露给前端，全部下载走 24h 签名 URL

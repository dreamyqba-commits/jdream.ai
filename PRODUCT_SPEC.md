# AI 视频/图片聚合站 · 产品规格文档（SPEC）

> 来源：基于 `阶段2 · 开始落地.docx` 提炼整理。
> 目标：21 天内可上线的 MVP，月固定成本 < $30，可扛 1000 DAU。
> 文档级别：Spec（可直接交给 Claude Code / Codex 进行开发实施）。

---

## 0. 产品概览

| 项 | 内容 |
| --- | --- |
| 产品类型 | AI 视频 + AI 图片 多模型聚合 SaaS（Web） |
| 核心卖点 | 一次订阅，使用全部主流生图/生视频模型 |
| 目标市场 | 海外（英文优先），国内开发者出海 |
| 商业模式 | 订阅制（月/年），积分（Credits）扣减 |
| 上线节奏 | MVP 21 天上线，上线后做亮点功能与 SEO/GEO 迭代 |
| 成功指标 | 自然流量月增长 ≥ 30%，付费转化 ≥ 1.5%，月毛利 > 0 |

---

## 1. 产品定位与原则

### 1.1 一句话定位
> 让创作者无需在 Pollo / Viddo / Krea 之间来回跳，**一个订阅、一个面板、覆盖所有主流 AI 视频/图片模型**。

### 1.2 设计原则
1. **聚合优先**：至少接入 5–10 个生图/生视频模型；只接一个等于不是聚合站。
2. **付费为先**：每个交互最终都要为订阅转化服务。
3. **够用 > 漂亮**：先上线，再精修，不追求 Figma 高保真。
4. **轻量优先**：能用 SaaS 不自建，能用托管不部署。
5. **SEO/GEO 双轨**：每个模型、每个工具都是独立落地页。

### 1.3 不做的事（边界）
- ❌ 不自建 GPU、不自训模型
- ❌ 不做协作 / 团队空间（MVP 不做）
- ❌ 不做对外 API 开放（MVP 不做）
- ❌ 不做后台审核运营系统（MVP 仅最小日志）
- ❌ 不做手机原生 App（响应式 Web 即可）

---

## 2. 目标用户

| 维度 | 主要画像 |
| --- | --- |
| 地域 | 北美 / 欧洲为主，东南亚次之 |
| 职业 | 内容创作者、营销人员、电商卖家、独立设计师 |
| 设备 | 桌面端为主（≥ 70%），移动端兼容 |
| AI 认知 | 中度玩家：用过 Midjourney / Sora，但不想为每个模型分别付费 |
| 付费心智 | 愿意为效率付费，价格敏感度中等，年付优惠敏感 |

### 用户主路径
```
落地页 → 看模型/Demo → Google 一键登录 → 试用免费 Credits
       → 升级订阅（年/月）→ 持续生成 → 历史回看与下载
```

---

## 3. 功能需求

### 3.1 必做功能（MVP 五件套）

| # | 模块 | 必做项 | 验收口径 |
| --- | --- | --- | --- |
| F1 | **多模型生成** | 至少 5 个视频模型 + 3 个图片模型；统一 Prompt 面板，左输入右预览 | 任一模型生成 < 60s，失败自动退 Credits |
| F2 | **基础体验** | 历史记录、单条预览、下载、删除 | 历史按时间倒序，下载链接 24h 过期 |
| F3 | **登录** | Google OAuth 一键登录（Supabase Auth） | 登录态跨页面持久化，中途无强制登出 |
| F4 | **订阅与 Credits** | 月/年会员，Credits 月清零，Webhook 自动到账 | 付款后 ≤ 60s 到账，失败可重试 |
| F5 | **过审三件套** | 用户协议、隐私政策、联系我们 | 落地页 footer 全部可达，含独立 URL |

### 3.2 模型路由策略

用户感知不到底层差异，按"快速 / 标准 / 电影"分档：

| 档位 | 视频模型示例 | 计费（每秒 Credits） | 备注 |
| --- | --- | --- | --- |
| 快速 | Seedance 2 Fast | 5 | 免费用户主用 |
| 标准 | Kling 2.5 Turbo | 15 | Lite 起 |
| 电影 | Veo 3.1 Fast | 25 | Pro 起 |

> Credits 单价 = 上游 API 成本 × 2–3 倍（毛利空间）。

### 3.3 网站结构（页面层级）

#### 3.3.1 顶层结构
- **首页**（`/`）：营销落地页，必须能跳转到每一个子页面。
- **生成工作台**（`/app`）：登录后主面板。
- **模型单页**（`/m/{model}`）：每个模型一个独立 SEO 页面。
- **工具单页**（`/tool/{tool}`）：每个工具/能力一个独立页面（例：`ai-video-extender`）。
- **定价页**（`/pricing`）。
- **历史记录**（`/history`）。
- **账户中心**（`/account`）。
- **法律/合规页**：`/terms`、`/privacy`、`/contact`。
- **博客**（`/blog/...`）：MDX 静态生成，做 SEO/GEO。

#### 3.3.2 首页七屏布局（强约束）
| 屏 | 内容 | 关键要素 |
| --- | --- | --- |
| 第 1 屏 | Hero | 一句话定位 + 顶部菜单栏 + 主 CTA |
| 第 2 屏 | 生成面板预览 | 左输入 / 右预览 |
| 第 3 屏 | 重点功能 | 图 + 文详细介绍 |
| 第 4 屏 | 使用场景 | 广告 / 短剧 / 婚礼视频 等 |
| 第 5 屏 | 信任度 | 优势卖点 或 用户评价 |
| 第 6 屏 | 使用步骤 | 简易 3–5 步说明 |
| 第 7 屏 | FAQs | 至少 8 条常见问答（GEO 友好） |
| Footer | 全模型、合规、博客 | 子页面入口必须齐全 |

#### 3.3.3 子页面"一页一事"原则
- 每个子页面只做**一件事**：单个模型 OR 单个工具。
- 参考 Pollo：`https://pollo.ai/m/sora`、`https://pollo.ai/ai-video-extender`。

### 3.4 亮点功能（自选，上线后再做）

> 原则：MVP 不做亮点；最多选 1 个，且在上线后迭代期实现。

候选思路：
1. **看竞品**：用 Similarweb 找 Pollo 近期增长快的着陆页 → Semrush 验证关键词难度（KD < 30、CPC > $1.5）→ 复刻。
2. **找趋势**：在 TikTok / Reddit 搜 `ai video`、`funny ai video` → 把热门视频特效转化为一个工具页（如 `ai cat video generator`）。

---

## 4. 域名规则

- 长度 6–14 字符，越短越好。
- 后缀优先级：`.com` > `.ai` > 国别（`.co`、`.cn`）。
- 雷区：连字符 `-`、数字、双写字母、易拼错单词。
- 关键词可自然融入品牌（如 `canva` 暗示 `canvas`），但**不为关键词牺牲品牌感**。

---

## 5. 技术方案

### 5.1 推荐技术栈（黄金栈）

| 层 | 选型 | 理由 / 月成本（MVP） |
| --- | --- | --- |
| 前端 | Next.js 15 + React 18 | 营销页 + 工作台同框架；SSR/SSG 利于 SEO |
| UI | Tailwind CSS + shadcn/ui + Radix Primitives | 复制粘贴成品组件，无障碍内建 |
| 设计 token | `brand.config.ts` + `tailwind.config.ts` + `design-tokens.md` | 集中管理，便于换皮 |
| i18n | next-intl 9.x + JSON + 强类型 key | URL 带语言前缀（`/en/...`），SEO 友好 |
| Auth | Supabase Auth + Google OAuth | 免费支持 50K MAU |
| 数据库 | Supabase Postgres + RLS | 一站式，行级权限免写 |
| Credits | Postgres RPC `create_generation_atomic` | 防并发双扣 |
| 媒体存储 | Cloudflare R2 + 24h 临时签名链接 | 出口流量 0 费 |
| 生成管线 | Webhook 主推 + 前端轮询兜底 | 详见 §5.3 |
| 上游模型 | piapi.ai / grsai.com / fal.ai 等多家 | 必须接 ≥ 2 家避免单点 |
| MDX 内容 | next-mdx-remote + gray-matter | 落地页/对比文/FAQ 静态生成 |
| SEO | sitemap.ts + robots.ts + hreflang + 6 类 JSON-LD | 全量结构化数据 |
| GEO | `llms.txt` + `ai.txt` | 让 AI 爬虫识别推荐内容 |
| 收款 | Creem.io（主）+ DodoPayments（备）+ Wise USD→CNY | 国内开发者友好 |
| 部署 | GitHub + Vercel 免费版 | 推送即部署，全球 CDN |
| 监控 | Google Analytics + Sentry + PostHog | 数据看板 + 错误追踪 |
| DNS | Cloudflare | 免费、稳定 |

> **MVP 月固定成本**：约 $0–30（仅域名摊销）。
> **1000 DAU 月成本**：$50–150（API 调用费占大头）。

### 5.2 架构图（文字版）

```
┌──────────────────────────────────────────────────────────┐
│  浏览器（Next.js 客户端 / 多语言 / Tailwind / shadcn/ui）   │
└────────────┬─────────────────────────────────────────────┘
             │ HTTPS
┌────────────▼─────────────────────────────────────────────┐
│  Vercel Edge / Next.js API Routes                         │
│  - /api/generate    （扣 Credits + 调上游 + 落 generations）│
│  - /api/webhook/*   （Creem 付款、上游完成回调）             │
│  - /api/status/:id  （前端轮询兜底）                         │
└────┬──────────────────┬───────────────────┬───────────────┘
     │                  │                   │
     ▼                  ▼                   ▼
 Supabase           Cloudflare R2        Provider Adapter
 (Auth / Postgres / RLS)  (视频/图片资源)   (fal.ai / piapi / ...)
```

### 5.3 视频生成管线（核心模块）

**MVP 路径：Webhook 主推 + 前端轮询兜底**

完整流程：
1. 用户点"生成" → 前端 `POST /api/generate`。
2. 后端 RPC `create_generation_atomic`：原子性地 (a) 校验余额 (b) 扣 Credits (c) 写一条 `generations` 记录 (status=PENDING)。
3. 后端调上游 API（指定 `webhook_url`）→ 返回 `provider_job_id`，写回数据库。
4. 前端跳到等待页，每 2s `GET /api/status/:id`。
5. 上游完成 → POST 我方 `webhook` → 验签 → 下载并落 R2 → 更新 `generations.status=SUCCESS, asset_url`。
6. 前端在下一次轮询拿到完成态 → 渲染结果。

**兜底机制**：
- Webhook 5 分钟未到 → 后端主动 `GET` 上游查询状态。
- 上游 5xx → 重试 1 次 → 失败降级到备用 Provider。
- 超时（>60s）→ 自动取消 + **退还 Credits**（红线）。
- 内容审核失败 → 不扣 Credits，提示用户改 prompt。

**Provider Adapter 接口骨架**：
```ts
interface VideoProvider {
  name: string;
  submit(input: GenerateInput): Promise<{ jobId: string }>;
  status(jobId: string): Promise<JobStatus>;
  parseWebhook(payload: unknown): { jobId: string; status: JobStatus; assetUrl?: string };
}
```
> 接第二个模型时**不改业务逻辑**，只新增一个实现。

**并发限流**：
| 等级 | 最大并行任务 |
| --- | --- |
| Free | 1 |
| Lite | 2 |
| Pro | 3 |
| Premium | 5 |

### 5.4 数据模型（Postgres，至少 7 张）

```sql
-- 简化字段，实际加 created_at/updated_at/索引
users(id, email, name, avatar, locale, plan, credits_balance, ...)
subscriptions(id, user_id, plan, status, current_period_end, creem_subscription_id, ...)
credits_transactions(id, user_id, delta, reason, ref_type, ref_id, ...)
generations(id, user_id, model_id, prompt, status, provider_job_id,
            asset_url, cost_usd, credits_spent, created_at, completed_at, ...)
models(id, code, name, type, default_seconds, credits_per_second, provider, enabled, ...)
templates(id, slug, title, prompt_template, cover, model_id, locale, ...)
webhooks_log(id, event_id UNIQUE, source, payload, processed_at, ...)
```

**关键约束**：
- `credits_transactions` 必须有，否则对账爆炸。
- `generations.cost_usd` 用于毛利分析。
- `webhooks_log.event_id` 唯一索引防重复消费。
- `models` 是配置表：新增模型 = INSERT 一行，不改代码。

### 5.5 存储与生命周期

| 用户量 | 视频量 | R2 月费 |
| --- | --- | --- |
| MVP（≤50 DAU） | 5 GB | $0（免费额度） |
| 早期（500 DAU） | 50 GB | ~$0.75 |
| 成长（5000 DAU） | 500 GB | ~$7.5 |
| 规模（>5K DAU） | 5 TB | ~$75 |

**生命周期策略**（R2 Lifecycle Rules）：
- Free 用户：生成后 7 天自动删除。
- 付费用户：长期保存（订阅期间）。
- 退订后 30 天清理。

### 5.6 容量与升级路径

| 阶段 | DAU | 关键阈值 | 升级动作 |
| --- | --- | --- | --- |
| MVP | <50 | API 并发 <5 | 维持 Polling |
| 早期 | 50–500 | 并发 5–20 | 维持 Polling，加监控 |
| 成长 | 500–5000 | 并发 >20 | 升级到 Queue（Inngest / Trigger.dev / QStash）|
| 规模 | >5000 | 单 Region 抖动 | 多 Region + 专用队列 |

---

## 6. 设计与 UI

### 6.1 路径选择
- **路径 A · 截图喂 AI**：90% 学员推荐。截 Pollo / Viddo 关键页面 → 喂 Claude Code → 输出 `design-tokens.md` → 直接实现。
- **路径 B · Pencil + Claude Code**：对视觉有强控制需求时使用，Pencil VS Code 插件 → MCP 调用出稿。

### 6.2 设计输出物（强制要求）
1. `design-tokens.md`：颜色 / 字体 / 间距 / 圆角 / 阴影 / 动效 / 组件规范，**Apple 工业级精度**。
2. `tailwind.config.ts`：可直接粘贴。
3. 关键组件：Button / Input / Card / Modal / Toast / Tabs / Progress + **聚合站专用三件套**：模型卡片、模板卡片、视频生成框。

### 6.3 设计禁忌
- 不用纯 `#000` 或 `#FFF`（用 neutral-950 / neutral-50）。
- CTA 不放 emoji。
- 卡片不同时有 shadow + border。
- 不用 `box-shadow` 模拟 glow（用 `ring` 或 `backdrop-filter`）。

---

## 7. SEO / GEO

### 7.1 SEO 基础
- `sitemap.ts` 自动生成，含模型/工具/模板/博客全量页面。
- `robots.ts` 屏蔽 `/api/*`、`/account/*`、`/history/*`。
- 多语言 `hreflang` 完整（首发英文，预留至少 1 种其他语言结构）。
- 6 类 JSON-LD 结构化数据：`Organization`、`WebSite`、`SoftwareApplication`、`Product`（含 Pricing）、`FAQPage`、`BreadcrumbList`。

### 7.2 落地页矩阵
- 首页：1 个。
- 模型单页：≥ 8 个（每个上线模型一个）。
- 工具单页：≥ 5 个（核心能力页）。
- 对比文：≥ 3 篇（如 `kling-vs-veo`），MDX 静态。
- FAQ：每个落地页底部至少 8 条。

### 7.3 GEO（AI 搜索引擎）
- 根目录 `llms.txt`：列出"我是谁、推荐内容是什么"。
- 根目录 `ai.txt`：声明 AI 抓取策略。
- 内容写作：FAQ 化、长尾问句化（如 "How to extend an AI video for free?"）。

### 7.4 收录与监控
- 上线即提交：Google Search Console、Bing Webmaster。
- 数据看板：Google Analytics 4。
- 错误监控：Sentry。
- 行为分析：PostHog（可选）。

---

## 8. 商业化

### 8.1 套餐设计

| 套餐 | 月价（建议） | 年价（建议） | Credits | 并行 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Free | $0 | — | 50 / 月 | 1 | 引流，限快速档 |
| Lite | $9.9 | $79（年付 33% off） | 1,000 / 月 | 2 | 标准档 |
| Pro | $19.9 | $159 | 3,000 / 月 | 3 | 全档 + 高优先级 |
| Premium | $39.9 | $319 | 8,000 / 月 | 5 | 大用量 + 长视频 |

**主推年付**（Pollo 模式），收益最大化。

### 8.2 收款链路
- 主：**Creem.io** → Wise（USD→CNY）→ 国内银行卡。
- 备：**DodoPayments**（建议同时申请，避免单点）。
- 费率成本估算：5.3%（含 Creem 3.9%+$0.40、Creem→Wise $7 或 1%、Wise USD→CNY ~0.5%）。
- 单年单人结汇限额：5 万美元。

### 8.3 红线
- 生成失败必须自动退 Credits。
- 退订当期 Credits 处理策略需在 ToS 写明（建议：订阅期内有效，到期清零）。
- 收款 webhook 必须验签 + 幂等（基于 `event_id` 唯一索引）。

---

## 9. 合规

- 用户协议（Terms of Service）
- 隐私政策（Privacy Policy，覆盖 GDPR/CCPA 关键条款）
- 联系我们（邮箱 + 表单）
- Cookie 提示（欧盟流量命中即弹）
- DMCA 投诉入口（生成内容侵权处理）
- 内容审核：依赖上游 Provider（fal.ai/piapi 等自带），自身记日志即可

---

## 10. 外部服务清单（上线前必备）

| # | 服务 | 用途 | 步骤要点 |
| --- | --- | --- | --- |
| 1 | GitHub | 代码托管 + Vercel 联动 | 建仓 → 邀请协作者 |
| 2 | Vercel | 部署 | 用 GitHub 登录，绑自定义域名 |
| 3 | Supabase | 数据库 + Auth | New Project，Region: Singapore / US East，DB 密码留存 |
| 4 | 域名 | Spaceship（首推）/ Porkbun | 支付宝可付，DNS 证书自带 |
| 5 | Google OAuth | 登录 | Google Cloud → OAuth Client ID，回调填 Supabase callback |
| 6 | Cloudflare R2 | 媒体存储 | 启用 R2 → 建 Bucket → 创建 API Token（Object R/W） |
| 7 | 视频/图片 API | 生成 | piapi / grsai / pic2api / apimart / apipod，**至少接 2 家** |
| 8 | Creem.io | 收款 | 个人主体，需站点已部署 + 三件套合规页 |
| 9 | Wise | 提现中转 | 中国身份证 + 86 手机号 + 人脸识别 |
| 10 | DodoPayments | 收款备份 | 4% + $0.40，与 Creem 同时申请 |

---

## 11. 21 天上线计划

| 日期 | 阶段 | 关键产出 |
| --- | --- | --- |
| Day 1–2 | 立项 | 选题 / 域名 / 竞品截图 |
| Day 3 | 设计 | `design-tokens.md` + 关键页面草稿 |
| Day 4 | 技术方案 | 跑 `tech-arch-planner`，输出 SPEC（即本文档定制版）|
| Day 5–7 | 脚手架 | Next.js + Tailwind + shadcn + Supabase + Auth 跑通 Hello World |
| Day 8–11 | 生成管线 | Provider Adapter + Webhook + 轮询，至少 2 个模型可生成 |
| Day 12–14 | Credits + 订阅 | RPC + Creem Webhook + Pricing 页 |
| Day 15–17 | 落地页矩阵 | 首页 7 屏 + 8 个模型单页 + FAQ + 法律页 |
| Day 18 | SEO/GEO | sitemap / robots / hreflang / JSON-LD / llms.txt |
| Day 19 | 收尾 | GA / Sentry / R2 生命周期 / 多语言基础 |
| Day 20 | 灰度 | 小范围测试，修关键 bug |
| Day 21 | 上线 | 提交 Google / Bing 收录，开放 |

---

## 12. 验收标准（上线门槛）

> 任一项不通过，**不上线**。

- [ ] 至少 5 个视频模型 + 3 个图片模型可正常生成、失败可退 Credits
- [ ] Google OAuth 登录成功率 ≥ 99%（一周观察）
- [ ] 单次生成 P95 时延 ≤ 60s
- [ ] 历史记录可查、可下载（24h 签名链接）
- [ ] Creem Webhook 到账延迟 ≤ 60s，幂等无重复扣款
- [ ] 全站 Lighthouse Performance ≥ 80（首页 ≥ 90）
- [ ] sitemap.xml / robots.txt / llms.txt 可访问
- [ ] 三件套（Terms / Privacy / Contact）全部独立页可达
- [ ] 任一上游 Provider 故障时，可手动切换到备用并继续生成
- [ ] Sentry 接入，前后端错误均能上报

---

## 13. 风险与对策（Top 5）

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| 上游 API 突然不可用 | 站点核心功能瘫痪 | 接 ≥ 2 家 Provider，Adapter 模式快速切换 |
| Creem 审核未过 / 提现卡壳 | 无法收款 | DodoPayments 备用同时申请 |
| 视频文件存储费用失控 | 月成本激增 | R2 + 生命周期清理 + 免费用户 7 天保留 |
| Credits 并发双扣 | 用户投诉 | Postgres RPC 原子事务 + 唯一约束 |
| Google 收录慢 / 流量不来 | 商业化失败 | 上线即提交收录 + 持续 SEO/GEO 内容产出 |

---

## 14. 待确认事项（请补充）

> 这些项需要你给出具体答案后，再细化对应章节。

1. **品牌名 / 域名**：是否已确定？
2. **首发主色 + Logo**：是否已有？影响 `design-tokens.md`。
3. **首发模型清单**：要接的具体 5–10 个模型名称（影响 §3.2 路由表与 §10 第 7 项）。
4. **目标语言**：英文为主，是否同时上线第二语言？哪一种？
5. **定价细节**：是否采用 §8.1 建议的四档定价，或自定义？
6. **公司主体 / 身份**：Creem 注册主体（个人 vs 公司）。
7. **亮点功能候选**：是否已经有想做的方向（看竞品 / 找趋势）？

---

## 附录 A · 与本指南的偏差说明

本 SPEC 为通用模板；以下条目在你确认 §14 之后会细化：
- 模型路由表的具体上游与单价
- 数据模型的索引与字段精确长度
- i18n 默认语言列表
- 首屏文案与品牌系统

> 文档版本：v1.0 · 2026-04-30 · 基于《阶段2 · 开始落地》整理。

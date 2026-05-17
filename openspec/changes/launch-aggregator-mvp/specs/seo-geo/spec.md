## ADDED Requirements

### Requirement: 落地页矩阵
系统 SHALL 在上线时提供以下静态/ISR 落地页：首页 1 个、模型单页 ≥ 8 个（每个上线模型一个）、工具单页 ≥ 5 个、对比文 ≥ 3 篇、博客可扩展。每页 SHALL 各自有独立 `<title>`、`<meta description>`、Open Graph、Twitter Card。

#### Scenario: 模型单页 SEO 元数据
- **WHEN** 爬虫抓取 `/m/kling-2-5`
- **THEN** 页面 `<title>` 含模型名与卖点，`<meta description>` ≤ 160 字符，OG image 为该模型专属预览图

#### Scenario: 对比文路由
- **WHEN** 访客访问 `/compare/kling-vs-veo`
- **THEN** 页面以 MDX 渲染对比内容，TOC、表格、CTA 齐全，`<link rel="canonical">` 自指

### Requirement: sitemap / robots
系统 SHALL 通过 `app/sitemap.ts` 与 `app/robots.ts` 自动产出 `sitemap.xml` 与 `robots.txt`；sitemap SHALL 包含全部公开页面（含动态生成的模型/工具/模板/博客），robots SHALL 屏蔽 `/api/*`、`/account/*`、`/history/*`、`/app`。

#### Scenario: sitemap 自动包含新模型
- **WHEN** `models` 表新增一行 `enabled=true` 的模型并 ISR 重生成
- **THEN** `/sitemap.xml` 在 1 小时内包含 `/m/{new-model-code}` 的 URL 条目

#### Scenario: robots 屏蔽内部页
- **WHEN** Googlebot 抓取 `https://example.com/robots.txt`
- **THEN** 文件包含 `Disallow: /api/`、`Disallow: /account/`、`Disallow: /history/`、`Disallow: /app`

### Requirement: hreflang 多语言基础
系统 SHALL 在所有公开页输出 `hreflang` 链接标签覆盖当前已上线语言；MVP 至少英文（`en`）+ 1 种第二语言结构预留（`x-default` 指向英文）。

#### Scenario: 英文页面 hreflang
- **WHEN** 爬虫抓取 `https://example.com/en/m/kling-2-5`
- **THEN** 页面 `<head>` 含 `<link rel="alternate" hreflang="en" href=".../en/m/kling-2-5">`、`<link rel="alternate" hreflang="x-default" href=".../en/m/kling-2-5">`

### Requirement: 6 类 JSON-LD 结构化数据
系统 SHALL 在合适的页面注入 JSON-LD：`Organization`（全站）、`WebSite`（首页 + sitelinks searchbox）、`SoftwareApplication`（模型/工具页）、`Product` + `Offer`（Pricing）、`FAQPage`（含 FAQ 的页面）、`BreadcrumbList`（深层页面）。

#### Scenario: Pricing 页结构化数据
- **WHEN** 爬虫抓取 `/pricing`
- **THEN** 页面包含 `Product` + 多个 `Offer` 节点，价格、币种、可用性字段齐全；Google Rich Results Test 通过

#### Scenario: FAQ 结构化数据
- **WHEN** 爬虫抓取任一含 FAQ 的模型/工具页
- **THEN** 页面含 `FAQPage` 节点，至少 8 条 `Question` + `Answer` 对

### Requirement: GEO（AI 搜索引擎）
系统 SHALL 在站点根目录提供 `/llms.txt` 与 `/ai.txt`：前者描述"我是谁、推荐内容是什么"，后者声明 AI 抓取策略；二者对所有 UA 公开可访问。

#### Scenario: AI 爬虫读取 llms.txt
- **WHEN** ChatGPT/Perplexity/Claude 的爬虫请求 `https://example.com/llms.txt`
- **THEN** 返回 200 + text/plain，内容包含产品定位、关键页面入口（首页/Pricing/各模型页）、推荐对话引导句

### Requirement: 站点收录
系统 SHALL 在上线当天提交 Google Search Console 与 Bing Webmaster；sitemap 提交后 7 天内首页应被收录。

#### Scenario: 上线日提交
- **WHEN** 部署到生产域名
- **THEN** 运维 SHALL 在 Search Console / Bing Webmaster 各完成一次 sitemap 提交并保存截图作为验收证据

## ADDED Requirements

### Requirement: 模型最少接入数量
系统 SHALL 在 MVP 上线时接入至少 5 个视频模型与 3 个图片模型，所有模型在 `models` 表中以 `enabled=true` 暴露给前端。

#### Scenario: 首页模型展示
- **WHEN** 任意访客打开首页底部"全部模型"区域
- **THEN** 页面渲染至少 8 个模型卡片，每个卡片包含名称、类型（视频/图片）、定档（快速/标准/电影）、跳转链接 `/m/{model-code}`

#### Scenario: 工作台模型选择
- **WHEN** 已登录用户在 `/app` 打开模型选择器
- **THEN** 列表中至少出现 5 个视频模型与 3 个图片模型，禁用状态的模型不出现

### Requirement: 统一 Prompt 面板（左输入 / 右预览）
系统 SHALL 在工作台采用左侧输入区（含 Prompt、模型、时长、参考图等）+ 右侧预览区（生成中态、结果态、错误态）的双栏布局；移动端 < 768px 自动堆叠为上下两栏。

#### Scenario: 桌面端布局
- **WHEN** 桌面用户打开 `/app`
- **THEN** 输入面板宽度占 ≤ 50%，右侧预览区始终可见，输入与预览均可独立滚动

#### Scenario: 移动端布局
- **WHEN** 视口宽度 < 768px
- **THEN** 输入面板在上、预览区在下，预览区保持 16:9 占位框，避免页面跳动

### Requirement: 模型路由分档
系统 SHALL 将模型按"快速 / 标准 / 电影"三档暴露给用户；每档对应一个或多个底层模型，单价（Credits/秒）由 `models.credits_per_second` 决定，毛利倍数 ≥ 2x（基于上游 USD 成本）。

#### Scenario: 用户选档生成
- **WHEN** 用户在工作台选"电影档"并点生成
- **THEN** 系统按路由表挑选当档默认模型（如 Veo 3.1 Fast），按 `credits_per_second × seconds` 估算扣费并展示在按钮上

#### Scenario: 档位下模型不可用
- **WHEN** "电影档"全部模型 `enabled=false`
- **THEN** 该档位在前端 disable 并提示 "Temporarily unavailable"，不阻断其他档位使用

### Requirement: Provider Adapter 接入
系统 SHALL 抽象统一的 `VideoProvider` / `ImageProvider` 接口，至少有 2 个上游实现接入，新增模型 SHALL 仅通过在 `models` 表 INSERT 一行配置完成，不修改业务代码。

#### Scenario: 单个 Provider 故障切换
- **WHEN** 当前主 Provider 连续 3 次返回 5xx
- **THEN** 系统自动将该 Provider 标记为降级，路由到备用 Provider 完成本次请求，并记录到 `webhooks_log` 与 Sentry

#### Scenario: 新增模型零代码变更
- **WHEN** 运营新增一行 `models` 记录（含 provider、provider_model_id、credits_per_second、enabled=true）
- **THEN** 重新部署或缓存刷新后，前端模型列表与路由表自动包含该模型，无需代码改动

### Requirement: 模型/工具 SEO 子页面
系统 SHALL 为每个上线模型生成 `/m/{model-code}` 页面、为每个工具能力生成 `/tool/{tool-slug}` 页面，遵循"一页一事"原则；这些页面 SHALL 由 SSG/ISR 渲染。

#### Scenario: 模型单页可达
- **WHEN** 访客在搜索引擎打开 `/m/kling-2-5`
- **THEN** 页面无登录即可访问，包含模型介绍、Demo、定价档位、CTA 跳 `/app?model=kling-2-5`、FAQ ≥ 8 条

#### Scenario: 工具单页可达
- **WHEN** 访客打开 `/tool/ai-video-extender`
- **THEN** 页面只展示与该工具相关的能力、用例、CTA，不混入其他工具

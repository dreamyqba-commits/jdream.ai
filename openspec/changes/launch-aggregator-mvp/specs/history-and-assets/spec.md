## ADDED Requirements

### Requirement: 历史记录列表
系统 SHALL 在 `/history` 提供当前用户全部 `generations` 记录，按 `created_at` 倒序分页（每页 24 条），仅展示 `status IN ('SUCCESS','FAILED','PENDING')` 的记录；行级权限 SHALL 通过 Supabase RLS 保证用户只能看到自己的数据。

#### Scenario: 用户查看自己的历史
- **WHEN** 已登录用户打开 `/history`
- **THEN** 页面渲染该用户的最新 24 条任务，每条卡片含缩略图、模型名、时长/分辨率、状态、创建时间

#### Scenario: 攻击者尝试查看他人历史
- **WHEN** 已登录用户构造请求带上其他 user_id 拉取列表
- **THEN** RLS 策略导致返回 0 行，前端展示空态而非他人数据

### Requirement: 单条预览
系统 SHALL 为成功的视频/图片提供内嵌预览：视频走 `<video>` 标签 + R2 签名 URL，图片走 `<img>`，预览资源不暴露 R2 直链。

#### Scenario: 预览成功视频
- **WHEN** 用户点击 SUCCESS 状态的视频卡片
- **THEN** 弹出 modal 在线播放，使用 24h 内有效的签名 URL，关闭 modal 后 URL 不再续期

### Requirement: 24h 临时签名链接下载
系统 SHALL 提供下载入口，下载链接由后端使用 R2 `getSignedUrl` 签发，TTL=24 小时；到期后链接 SHALL 失效。

#### Scenario: 用户点击下载
- **WHEN** 用户在历史卡片点击 "Download"
- **THEN** 后端返回新的签名 URL，前端触发下载，链接在 24 小时后再次访问返回 403

#### Scenario: R2 直链泄露防护
- **WHEN** 任何前端代码或 API 响应试图返回 `https://<bucket>.r2.cloudflarestorage.com/...` 形式的真实地址
- **THEN** 视为 bug；唯一对外形式必须是带签名参数的临时链接

### Requirement: 删除生成记录
系统 SHALL 允许用户删除自己的生成记录；删除 SHALL 同步从 R2 移除资源（异步任务），并将 `generations.status` 标为 `DELETED`。

#### Scenario: 用户主动删除
- **WHEN** 用户在历史卡片点击 "Delete" 并确认
- **THEN** 记录立即从前端列表消失；后台异步任务在 5 分钟内删除 R2 资源，删除失败 SHALL 重试至少 3 次并记录到 Sentry

### Requirement: 资源生命周期清理
系统 SHALL 通过 Cloudflare R2 Lifecycle Rules 自动清理：Free 用户的成功资源在 `created_at + 7 天`后删除；付费用户资源在订阅退订 30 天后删除。

#### Scenario: Free 用户资源 7 天到期
- **WHEN** Free 用户的视频在 7 天前生成成功且未升级订阅
- **THEN** R2 Lifecycle Rule 自动删除文件，`generations.status` 由 `SUCCESS` 自动变为 `EXPIRED` 或 asset_url 标空，前端历史卡片显示 "Expired — Upgrade to keep"

#### Scenario: 付费用户退订宽限
- **WHEN** Pro 用户取消订阅，30 天宽限期未升级
- **THEN** 31 天后资源被清理，订阅状态变为 `expired`，历史卡片提示 "Expired"

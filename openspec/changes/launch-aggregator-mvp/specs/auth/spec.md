## ADDED Requirements

### Requirement: Google OAuth 一键登录
系统 SHALL 提供 Google OAuth 作为唯一登录入口，登录流程通过 Supabase Auth 完成 code exchange，登录成功后写入 `users` 表。

#### Scenario: 首次使用 Google 登录
- **WHEN** 未登录用户点击 Hero 区域的 "Sign in with Google" 按钮并完成 Google 同意页
- **THEN** 系统在 Supabase Auth 中创建 user，并在 `users` 表 upsert 一条记录（含 email / name / avatar / locale / `plan='free'` / `credits_balance=50`），跳转至 `/app`

#### Scenario: 老用户再次登录
- **WHEN** 已注册用户使用同一 Google 账号再次登录
- **THEN** 系统不重复创建用户记录，仅刷新会话并更新最后登录时间

#### Scenario: OAuth 取消授权
- **WHEN** 用户在 Google 同意页点击"取消"
- **THEN** 系统返回首页并展示 toast "Login canceled"，不创建任何用户记录

### Requirement: 跨页面会话持久化
系统 SHALL 在所有受保护页面（`/app`、`/history`、`/account`）通过 Next.js middleware 校验会话；会话中断需自动跳回登录入口并保留 `redirectTo` 参数。

#### Scenario: 已登录访问受保护页
- **WHEN** 已登录用户在 30 分钟内访问 `/history`
- **THEN** 页面正常渲染，无需重新登录

#### Scenario: 会话过期访问受保护页
- **WHEN** 用户会话过期后访问 `/account`
- **THEN** 系统跳转到首页登录入口，URL 携带 `?redirectTo=/account`，登录成功后自动回到 `/account`

### Requirement: 登出
系统 SHALL 在账户中心提供 "Sign out" 操作，调用后立即终止会话并跳转回首页。

#### Scenario: 用户登出
- **WHEN** 用户在 `/account` 点击 "Sign out"
- **THEN** Supabase 会话被销毁，浏览器 cookie 清空，页面跳转到 `/`，再访问 `/app` 需要重新登录

### Requirement: OAuth 回调白名单
系统 SHALL 在 Supabase Authentication URL Configuration 中仅允许 `http://localhost:3000` 与生产域名作为回调白名单，其他来源的 code exchange MUST 被拒绝。

#### Scenario: 非白名单回调
- **WHEN** 攻击者构造的请求使用未在白名单的 redirect URI 触发回调
- **THEN** Supabase 拒绝交换 token，前端不创建会话

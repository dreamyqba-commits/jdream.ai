## ADDED Requirements

### Requirement: 异步生成主流程
系统 SHALL 以"Webhook 主推 + 前端轮询兜底"实现异步生成：前端 POST `/api/generate` → 后端原子扣费并落 `generations(status=PENDING)` → 调上游（携带 `webhook_url`）→ 写回 `provider_job_id` → 前端跳等待页 → 上游完成回调 → 后端落 R2 → 更新 `status=SUCCESS`。

#### Scenario: 生成成功
- **WHEN** 已登录用户在工作台提交一次合法请求且上游正常返回
- **THEN** `generations.status` 在 60 秒 P95 内变为 `SUCCESS`，`asset_url` 指向已上传到 R2 的资源，前端预览区渲染结果

#### Scenario: 生成失败（上游错误）
- **WHEN** 上游返回 5xx 或最终标记 FAILED
- **THEN** 系统重试 1 次；仍失败则降级到备用 Provider；最终失败则 `status=FAILED` 并触发退款

### Requirement: 前端轮询兜底
系统 SHALL 在等待页每 2 秒调用 `GET /api/status/:id`；前端轮询 SHALL 最多 5 分钟，期间使用骨架屏与进度提示，避免用户感知"卡死"。

#### Scenario: 正常轮询拿到结果
- **WHEN** Webhook 在 30 秒内回调成功
- **THEN** 前端在下一次轮询返回 `SUCCESS` 即停止轮询并渲染结果

#### Scenario: 轮询超时
- **WHEN** 5 分钟内既无 Webhook 也无 `SUCCESS`
- **THEN** 前端显示 "Still working — refresh later"，后端触发"超时主动查询"流程（见下条）

### Requirement: 超时主动查询
系统 SHALL 在 Webhook 5 分钟未到达时，由后端主动 `GET` 上游查询任务最终状态，并据此更新 `generations` 表与退款流程。

#### Scenario: 主动查询命中 SUCCESS
- **WHEN** 后端在 5 分 30 秒触发主动查询，上游返回 `succeeded` + asset_url
- **THEN** 后端按正常 SUCCESS 路径处理（落 R2、更新状态），用户下次访问历史页能看到结果

#### Scenario: 主动查询命中 FAILED
- **WHEN** 主动查询返回 `failed` 或仍 `pending` 超过 10 分钟
- **THEN** 后端将该任务标记为 FAILED 并退还 Credits，等待页前端通过下一次轮询拿到 FAILED 渲染失败态

### Requirement: 失败必退 Credits
系统 SHALL 在任何非用户主动取消的失败（上游 5xx、超时、内容审核拒绝、降级仍失败）下自动将该次扣费全额退还到用户 `credits_balance`，并在 `credits_transactions` 写入 `reason='refund'` 流水。

#### Scenario: 上游失败退款
- **WHEN** 一次扣 100 Credits 的请求最终 FAILED
- **THEN** `credits_balance` += 100，`credits_transactions` 新增 `delta=+100, reason='refund', ref_type='generation', ref_id=<job_id>`

#### Scenario: 内容审核拒绝
- **WHEN** 上游返回内容审核失败
- **THEN** 不扣 Credits（若已预扣则等额退还），前端展示 "Prompt rejected by safety filter, please modify"

### Requirement: Webhook 验签与幂等
系统 SHALL 校验上游 Webhook 签名；同一 `event_id` SHALL 只被处理一次（基于 `webhooks_log.event_id` 唯一索引），重复推送返回 200 但不再次更新业务状态。

#### Scenario: 上游重试推送
- **WHEN** 上游对同一任务推送 3 次 Webhook（同 event_id）
- **THEN** 首次写入 `webhooks_log` 并更新 `generations`；第 2、3 次返回 200 且不修改任何业务表

#### Scenario: 签名不合法
- **WHEN** 收到签名校验失败的 Webhook
- **THEN** 后端返回 401 且不写 `webhooks_log`，向 Sentry 上报安全事件

### Requirement: 并发限流
系统 SHALL 按用户套餐限制最大并行 PENDING 任务数：Free=1 / Lite=2 / Pro=3 / Premium=5；超限时拒绝新请求并提示用户。

#### Scenario: Free 用户并发提交
- **WHEN** Free 用户已有 1 个 PENDING 任务并尝试再次提交
- **THEN** API 返回 429，前端展示 "Please wait until your current generation finishes"，不扣 Credits

#### Scenario: Pro 用户达到上限
- **WHEN** Pro 用户已有 3 个 PENDING 任务再次提交
- **THEN** API 返回 429，前端按上一条提示

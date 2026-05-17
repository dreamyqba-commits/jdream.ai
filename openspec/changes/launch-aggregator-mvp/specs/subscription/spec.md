## ADDED Requirements

### Requirement: 套餐档位
系统 SHALL 提供 Free / Lite / Pro / Premium 四档订阅，每档支持月付与年付，年付折扣 SHALL ≥ 30% off 月付折算价。Pricing 页 SHALL 默认高亮年付。

#### Scenario: Pricing 页默认视图
- **WHEN** 访客打开 `/pricing`
- **THEN** 页面默认 toggle 在 "Annual"，三个付费档位按"建议"价位渲染（Lite $79/yr、Pro $159/yr、Premium $319/yr），Free 无价格显示 "Get started"

#### Scenario: 切换月付
- **WHEN** 访客点击 "Monthly" toggle
- **THEN** 价格切换到月付（Lite $9.9 / Pro $19.9 / Premium $39.9），并提示 "Save with annual billing"

### Requirement: Creem.io 主收款 + Webhook 到账
系统 SHALL 使用 Creem.io 作为主收款渠道，付款成功 Webhook 到账延迟 SHALL ≤ 60 秒；到账动作 SHALL 创建/更新 `subscriptions` 行、按套餐发放 Credits、写入流水。

#### Scenario: 用户首次订阅 Lite
- **WHEN** 用户在 Pricing 页选 Lite 年付并完成 Creem 支付
- **THEN** 60 秒内：`subscriptions` 新增 `plan='lite', status='active'`、`users.plan='lite'`、`credits_transactions` 新增 `delta=+1000, reason='subscription_grant'`、用户余额 +=1000

#### Scenario: 续订到账
- **WHEN** Lite 年付用户次年自动续费成功
- **THEN** `subscriptions.current_period_end` 推进 1 年；先清零旧"订阅类" Credits 再发放新 1000，流水齐全

### Requirement: Webhook 幂等
所有收款 Webhook（Creem / Dodo）SHALL 通过 `webhooks_log.event_id` 唯一索引保证幂等；重复事件 SHALL 返回 200 但不再次发放 Credits 或修改订阅状态。

#### Scenario: Creem 重复推送
- **WHEN** Creem 因网络抖动重发同一支付完成事件 3 次
- **THEN** 仅第一次发放 Credits 与变更订阅状态，后续两次仅记录 `webhooks_log` 中的尝试时间戳

### Requirement: DodoPayments 备份通道
系统 SHALL 同时接入 DodoPayments 作为备用渠道；当 Creem.io 整体不可用时，运营 SHALL 能在不发版的情况下将 Pricing 页 CTA 切换到 Dodo。

#### Scenario: Dodo 备用激活
- **WHEN** 运营通过环境变量或后台开关将 `BILLING_PRIMARY=dodo`
- **THEN** Pricing 页 CTA 跳转到 Dodo Checkout，订阅事件由 Dodo Webhook 完成到账，业务流程与 Creem 等价

### Requirement: 取消订阅
系统 SHALL 在账户中心提供 "Cancel subscription" 入口，取消生效策略为"本周期内继续可用，到期不再续费且 Credits 清零"。

#### Scenario: 用户取消订阅
- **WHEN** Pro 月付用户点击 Cancel 并确认
- **THEN** Creem/Dodo 关闭续订，`subscriptions.status='canceled'`，本周期 `current_period_end` 内仍享受 Pro 权益，到期后自动降级为 Free 且订阅类 Credits 清零

### Requirement: 套餐展示与并发权益
系统 SHALL 根据 `users.plan` 决定 §generation-pipeline 的并发上限与可用档位（电影档限 Pro+），订阅状态变更 SHALL 在 60 秒内生效到工作台。

#### Scenario: 升级后立即获得电影档
- **WHEN** Free 用户升级到 Pro 后回到 `/app`
- **THEN** 60 秒内"电影档"由禁用变为可用，并发上限由 1 提升到 3

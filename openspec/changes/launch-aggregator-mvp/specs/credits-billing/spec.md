## ADDED Requirements

### Requirement: Credits 余额展示
系统 SHALL 在工作台与账户中心显示用户当前 Credits 余额，余额变更后 SHALL 在 ≤ 5 秒内同步到前端。

#### Scenario: 工作台展示余额
- **WHEN** 已登录用户打开 `/app`
- **THEN** 顶部固定显示 "Credits: {balance}"，扣费/退款发生后该数字自动更新

### Requirement: 原子扣减（防并发双扣）
系统 SHALL 通过 Postgres RPC `create_generation_atomic(user_id, model_id, prompt, credits_to_deduct)` 在单一事务内完成 (a) 余额校验 (b) 扣减 (c) 写入 `credits_transactions` (d) 创建 `generations(status=PENDING)`；任何一步失败 SHALL 整体回滚。

#### Scenario: 单次正常扣减
- **WHEN** 用户余额 1000，提交一次需要 100 Credits 的生成
- **THEN** 事务提交后余额变为 900，`credits_transactions` 新增 `delta=-100, reason='generation', ref_id=<gen_id>`，`generations` 行已创建

#### Scenario: 余额不足
- **WHEN** 用户余额 50，提交一次需要 100 Credits 的生成
- **THEN** RPC 抛出 `INSUFFICIENT_CREDITS` 错误，余额、流水、任务表均不变，API 返回 402 并引导用户升级

#### Scenario: 并发双击
- **WHEN** 用户在 50ms 内连续提交两次同样的 100 Credits 请求
- **THEN** 仅一次扣减成功创建任务，另一次因行级锁失败回滚或排队，绝不出现"扣 200 创建 1 个任务"

### Requirement: 失败退款流水
系统 SHALL 在生成失败时通过同一 RPC 或专用 `refund_generation(generation_id)` 退款；退款 SHALL 写一条 `delta=+credits, reason='refund', ref_id=<gen_id>` 流水，且对同一 `generation_id` 仅退款一次。

#### Scenario: 重复退款防护
- **WHEN** 同一 FAILED 任务由超时主动查询与 Webhook 双路径都尝试退款
- **THEN** 仅第一次成功，第二次因 `(ref_type, ref_id, reason)` 唯一约束被拒绝，余额不变

### Requirement: Credits 月清零
系统 SHALL 在订阅周期切换时将订阅赠送的 Credits 清零并按新周期发放；非订阅赠送的额外 Credits（如客服补偿）SHALL 不清零。

#### Scenario: 月度续订发放
- **WHEN** Lite 用户的订阅周期到期并续订成功
- **THEN** 系统先清零本周期未用完的"订阅类" Credits（`reason='subscription_grant'` 累计），再按 Lite 套餐发放 1000 新 Credits（`reason='subscription_grant'`），并写入流水

#### Scenario: 客服补偿额度不清零
- **WHEN** 用户曾收到客服补偿 200 Credits（`reason='manual_grant'`）
- **THEN** 月度切换后这部分 Credits 仍保留

### Requirement: 流水可对账
所有 Credits 变化 SHALL 仅通过 `credits_transactions` 单一来源记录；账户中心 SHALL 提供过去 90 天流水查询，每条至少展示时间、类型、金额、关联对象。

#### Scenario: 用户查询流水
- **WHEN** 已登录用户访问 `/account` 流水 tab
- **THEN** 列表按时间倒序展示最近 90 天记录，每条点击可跳转到对应生成或订阅详情

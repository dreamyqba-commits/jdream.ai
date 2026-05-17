## ADDED Requirements

### Requirement: 三件套独立页
系统 SHALL 在 `/terms`、`/privacy`、`/contact` 提供独立页面，全站 footer SHALL 始终包含三者链接，页面无需登录即可访问。

#### Scenario: 未登录访客可达
- **WHEN** 访客在任意公开页 footer 点击 "Privacy Policy"
- **THEN** 跳转 `/privacy` 渲染完整内容，无登录墙、无重定向

#### Scenario: Pricing 页 footer 链接
- **WHEN** 访客打开 `/pricing` 滚动到底
- **THEN** footer 同时包含 Terms / Privacy / Contact 三个链接，且 hover 状态可见

### Requirement: ToS 与 Privacy 内容覆盖
`/terms` SHALL 至少覆盖：服务范围、订阅与退款规则、Credits 使用与到期、用户生成内容版权、禁止行为、责任限制、变更通知。`/privacy` SHALL 至少覆盖：收集的数据类别、用途、存储位置、第三方共享（Supabase / R2 / Creem / 上游模型）、用户权利（访问/删除/导出）、Cookie、未成年人、变更通知。

#### Scenario: Privacy 数据删除入口
- **WHEN** 用户在 `/privacy` 页面查找数据删除方式
- **THEN** 页面包含明确入口（联系邮箱或表单链接），保证 GDPR/CCPA 合规

### Requirement: Cookie 同意提示
系统 SHALL 对欧盟来源访问者展示 Cookie 同意 banner，包含 "Accept all" / "Reject non-essential" / "Manage" 三选项；未同意前 SHALL 不加载非必要的分析/营销脚本。

#### Scenario: 欧盟访客首次访问
- **WHEN** 来自 EU IP 的访客首次进入站点
- **THEN** 底部弹出 Cookie banner，未操作前 GA4 等非必要脚本延迟加载

#### Scenario: 用户拒绝非必要 Cookie
- **WHEN** 访客点击 "Reject non-essential"
- **THEN** 系统记录偏好，仅加载会话与登录所需的 essential cookie，GA4 不触发

### Requirement: 联系入口
`/contact` SHALL 至少提供一个有效的联系邮箱与一个表单（提交后写入数据库或邮件）；表单 SHALL 含 reCAPTCHA 或等效防垃圾措施。

#### Scenario: 用户提交联系表单
- **WHEN** 访客填写表单并提交
- **THEN** 系统通过验证后将工单入库 + 发送通知到运营邮箱，5 个工作日内回复

### Requirement: DMCA 与内容侵权入口
系统 SHALL 在 `/terms` 或独立 `/dmca` 页提供版权侵权投诉入口（邮箱、必要信息列表），并在内部约定 5 个工作日响应。

#### Scenario: 收到 DMCA 投诉
- **WHEN** 第三方通过 DMCA 入口邮箱提交合规投诉
- **THEN** 运营在 5 个工作日内确认收到并启动下架审核流程

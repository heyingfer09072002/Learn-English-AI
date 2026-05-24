# Requirements Document

## Introduction

本需求文档定义 EnglishAI 平台的 API 完整对接、用户认证系统、错误处理和单元测试的完整需求。目标是实现前后端的完整数据交互，提供安全的用户认证机制，建立健壮的错误处理体系，并确保代码质量通过全面的测试覆盖。

## Glossary

- **EnglishAI**: AI 驱动的英语学习平台系统
- **API**: 前后端通信的 RESTful 接口
- **JWT**: JSON Web Token，用于用户身份认证
- **前端**: Vue 3 构建的 Web 应用
- **后端**: Node.js + Express 构建的 API 服务
- **PostgreSQL**: 关系型数据库
- **EARS**: Easy Approach to Requirements Syntax，需求编写规范

## Requirements

### Requirement 1: 用户注册功能

**User Story:** AS 新用户，I WANT 通过邮箱和密码注册账号，SO THAT 我可以使用平台的学习功能

#### Acceptance Criteria

1. WHEN 用户提交注册表单，系统 SHALL 验证邮箱格式是否符合 RFC 5322 标准
2. WHEN 用户提交的邮箱已存在，系统 SHALL 返回 400 错误并提示"该邮箱已注册"
3. WHEN 用户提交的密码长度少于 8 位，系统 SHALL 返回 400 错误并提示密码长度要求
4. WHEN 用户提交有效的注册信息，系统 SHALL 对用户密码进行 bcrypt 加密（cost factor = 10）
5. WHEN 用户注册成功，系统 SHALL 生成 JWT 令牌并返回用户信息（不含密码）
6. IF 注册过程中发生数据库错误，系统 SHALL 返回 500 错误并记录错误日志

### Requirement 2: 用户登录功能

**User Story:** AS 已注册用户，I WANT 通过邮箱和密码登录，SO THAT 我可以访问我的学习数据和进度

#### Acceptance Criteria

1. WHEN 用户提交登录表单，系统 SHALL 验证邮箱和密码格式
2. WHEN 用户邮箱不存在，系统 SHALL 返回 401 错误并提示"邮箱或密码错误"
3. WHEN 用户密码错误，系统 SHALL 返回 401 错误并提示"邮箱或密码错误"
4. WHEN 用户登录成功，系统 SHALL 生成 JWT 令牌（有效期 7 天）并返回用户信息
5. WHILE 用户持有有效令牌，系统 SHALL 允许用户访问受保护的 API 接口
6. IF 连续登录失败 5 次，系统 SHALL 锁定账户 15 分钟并记录安全日志

### Requirement 3: Token 刷新机制

**User Story:** AS 已登录用户，I WANT 在令牌过期前自动刷新，SO THAT 我的使用体验不被中断

#### Acceptance Criteria

1. WHEN 客户端请求刷新令牌，系统 SHALL 验证当前令牌的有效性
2. WHEN 令牌有效且在有效期内，系统 SHALL 生成新的令牌并返回
3. WHEN 令牌已过期但未超过宽限期（24 小时），系统 SHALL 允许刷新
4. WHEN 令牌无效或超过宽限期，系统 SHALL 返回 401 错误
5. IF 刷新令牌过程中用户已被删除，系统 SHALL 返回 401 错误并提示"用户不存在"

### Requirement 4: 用户登出功能

**User Story:** AS 已登录用户，I WANT 安全登出，SO THAT 我的账户信息不会被未授权访问

#### Acceptance Criteria

1. WHEN 用户请求登出，系统 SHALL 将当前令牌加入黑名单（使用 Redis 缓存，有效期为令牌剩余有效期）
2. WHEN 用户使用已登出的令牌访问 API，系统 SHALL 返回 401 错误
3. WHILE 用户登出成功，系统 SHALL 清除客户端存储的令牌信息
4. IF 登出时 Redis 不可用，系统 SHALL 记录警告日志但仍返回登出成功响应

### Requirement 5: API 认证中间件

**User Story:** AS 系统开发者，I WANT 统一的认证中间件，SO THAT 受保护的 API 接口可以安全访问

#### Acceptance Criteria

1. WHEN 请求包含有效 JWT 令牌，中间件 SHALL 解析令牌并将用户信息附加到请求对象
2. WHEN 请求缺少 Authorization 头，中间件 SHALL 返回 401 错误并提示"未提供认证令牌"
3. WHEN 请求包含无效的 JWT 令牌，中间件 SHALL 返回 401 错误并提示"无效的令牌"
4. WHEN 请求的令牌已过期，中间件 SHALL 返回 401 错误并提示"令牌已过期"
5. WHERE 令牌存在于黑名单中，中间件 SHALL 返回 401 错误并提示"令牌已失效"
6. WHILE 请求通过认证，中间件 SHALL 将用户 ID 和邮箱信息传递给下游处理器

### Requirement 6: 前后端 API 对接 - 课程模块

**User Story:** AS 学习者，I WANT 获取课程列表和详情，SO THAT 我可以选择和开始学习课程

#### Acceptance Criteria

1. WHEN 前端请求课程列表，后端 SHALL 返回所有可用课程的摘要信息（id、title、description、level、lessons_count、icon）
2. WHEN 前端请求课程详情，后端 SHALL 返回课程完整信息包括句子列表和单词解析
3. IF 请求的课程 ID 不存在，后端 SHALL 返回 404 错误并提示"课程不存在"
4. WHILE 后端处理请求， SHALL 使用参数化查询防止 SQL 注入攻击
5. IF 数据库查询超时（超过 5 秒），后端 SHALL 返回 503 错误并记录性能日志

### Requirement 7: 前后端 API 对接 - 学习进度模块

**User Story:** AS 学习者，I WANT 同步我的学习进度，SO THAT 我可以追踪我的学习轨迹

#### Acceptance Criteria

1. WHEN 用户完成一个句子的学习，前端 SHALL 发送进度更新请求到后端
2. WHEN 后端收到进度更新请求，后端 SHALL 验证用户身份和课程有效性
3. WHEN 进度更新成功，后端 SHALL 返回更新后的总进度统计数据
4. WHEN 用户请求获取个人进度，后端 SHALL 返回用户所有课程的学习进度
5. IF 用户未登录尝试访问进度，后端 SHALL 返回 401 错误

### Requirement 8: 前后端 API 对接 - AI 功能模块

**User Story:** AS 学习者，I WANT 使用 AI 辅助学习功能，SO THAT 我可以获得智能化的学习反馈

#### Acceptance Criteria

1. WHEN 用户发送 AI 对话请求，后端 SHALL 调用 OpenAI API 并转发响应
2. WHEN 用户提交写作评估请求，后端 SHALL 返回包含语法、用词、表达建议的评估报告
3. WHEN 用户请求句子分析，后端 SHALL 返回词汇、语法、句型的详细分析
4. IF OpenAI API 调用失败，后端 SHALL 返回 503 错误并提示"AI 服务暂时不可用"
5. WHILE AI 请求处理中，后端 SHALL 设置请求超时为 30 秒

### Requirement 9: 统一错误处理机制

**User Story:** AS 前端开发者，I WANT 统一的错误响应格式，SO THAT 我可以一致地处理和展示错误信息

#### Acceptance Criteria

1. WHEN 发生任何错误，系统 SHALL 返回统一的 JSON 响应格式：`{ success: false, error: { code: string, message: string, details?: object } }`
2. WHEN 发生认证错误（401），错误代码 SHALL 使用 `AUTH_*` 前缀（如 `AUTH_TOKEN_MISSING`, `AUTH_TOKEN_INVALID`）
3. WHEN 发生验证错误（400），错误代码 SHALL 使用 `VALIDATION_*` 前缀并包含具体字段信息
4. WHEN 发生服务端错误（500），系统 SHALL 记录详细错误日志但只返回通用错误消息给用户
5. WHEN 发生网络错误，前端 SHALL 捕获并显示友好的网络异常提示
6. IF 错误是预期的业务异常，系统 SHALL 使用对应的 HTTP 状态码和错误码
7. IF 错误是未预期的系统异常，系统 SHALL 返回 500 并通知管理员

### Requirement 10: 错误分类和响应码

**User Story:** AS API 消费者，I WANT 清晰的错误分类，SO THAT 我可以根据错误类型采取正确的处理策略

#### Acceptance Criteria

1. 400 Bad Request SHALL 用于客户端验证错误（输入格式错误、必填字段缺失）
2. 401 Unauthorized SHALL 用于认证失败（无效令牌、未登录）
3. 403 Forbidden SHALL 用于授权失败（权限不足、资源不属于当前用户）
4. 404 Not Found SHALL 用于资源不存在
5. 409 Conflict SHALL 用于资源冲突（邮箱已存在、重复提交）
6. 429 Too Many Requests SHALL 用于请求频率限制
7. 500 Internal Server Error SHALL 用于服务端未知错误
8. 503 Service Unavailable SHALL 用于外部依赖不可用（数据库、OpenAI API）

### Requirement 11: 后端单元测试

**User Story:** AS 后端开发者，I WANT 全面的单元测试覆盖，SO THAT 我可以确保代码变更不会破坏现有功能

#### Acceptance Criteria

1. 所有控制器（auth、user、lesson、ai）SHALL 拥有单元测试，覆盖率达到 90% 以上
2. 测试框架 SHALL 使用 vitest（已有）配合 supertest 进行 HTTP 测试
3. 所有模型方法 SHALL 拥有单元测试，包括成功和失败场景
4. 认证中间件 SHALL 拥有独立的单元测试
5. 错误处理逻辑 SHALL 拥有测试用例验证错误响应格式
6. 测试数据库 SHALL 使用独立的测试实例，测试完成后自动清理数据
7. WHEN 执行测试命令，所有测试 SHALL 在 60 秒内完成

### Requirement 12: 前端组件测试

**User Story:** AS 前端开发者，I WANT 组件级别的测试，SO THAT 我可以验证组件的渲染和交互逻辑

#### Acceptance Criteria

1. 所有页面组件（Home、Learning、Chat、Lesson、Writing、Progress、Profile）SHALL 拥有组件测试
2. 测试框架 SHALL 使用 vitest + @vue/test-utils + jsdom
3. API 调用 SHALL 使用 Mock 方式模拟响应
4. 用户交互（点击、输入）SHALL 拥有对应的测试用例
5. 关键组件（登录表单、注册表单、课程卡片）SHALL 拥有事件触发测试

### Requirement 13: API 集成测试

**User Story:** AS QA 工程师，I WANT 端到端的 API 集成测试，SO THAT 我可以验证整个系统的协同工作

#### Acceptance Criteria

1. 所有 API 路由 SHALL 拥有集成测试用例
2. 集成测试 SHALL 覆盖完整的业务流程（注册→登录→获取课程→学习→查看进度）
3. 集成测试 SHALL 验证 JWT 认证流程
4. 集成测试 SHALL 验证错误处理的正确性
5. 集成测试 SHALL 在独立的测试数据库上执行

### Requirement 14: 测试执行和报告

**User Story:** AS 开发团队，I WANT 自动化测试执行和报告，SO THAT 我们可以持续监控代码质量

#### Acceptance Criteria

1. WHEN 执行 `npm test` 命令，所有测试 SHALL 自动运行并生成测试报告
2. WHEN 测试失败，报告 SHALL 显示详细的失败原因和堆栈信息
3. WHEN 测试覆盖率低于 80%，测试命令 SHALL 返回失败状态
4. WHILE CI/CD 流程运行，测试 SHALL 作为质量门禁强制执行
5. IF 测试失败，CI/CD 流程 SHALL 阻止代码合并和部署

---

## 非功能性需求

### Performance

1. 所有 API 接口的响应时间 SHALL 小于 500ms（P95）
2. 登录接口响应时间 SHALL 小于 200ms（P95）
3. 数据库查询 SHALL 使用索引优化，避免全表扫描
4. API 并发处理能力 SHALL 支持至少 100 请求/秒

### Security

1. 用户密码 SHALL 使用 bcrypt 加密存储（cost factor >= 10）
2. JWT 密钥 SHALL 使用至少 256 位的强随机字符串
3. 所有用户输入 SHALL 进行验证和清理，防止 SQL 注入和 XSS
4. HTTPS SHALL 在生产环境强制使用
5. 敏感信息（密码、密钥）SHALL 存储在环境变量中，不在代码库中硬编码

### Maintainability

1. 所有新增代码 SHALL 拥有 TypeScript 类型定义
2. 所有公共 API SHALL 拥有完整的文档注释
3. 错误日志 SHALL 包含足够的上下文用于问题诊断
4. 测试代码 SHALL 遵循 AAA 模式（Arrange-Act-Assert）

---

**文档状态**: 草稿
**最后更新**: 2026-05-24
**版本**: 1.0

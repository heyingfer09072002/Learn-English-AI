# API 对接、认证与测试实施计划

- [x] 1. 完善后端错误处理中间件
  - [x] 1.1 创建统一错误类 (`middleware/errors.ts`)
    - 定义 AppError 基类，包含 statusCode、errorCode、isOperational 属性
    - 创建认证错误、验证错误、资源错误等子类
    - 实现错误序列化方法

  - [x] 1.2 实现错误处理中间件 (`middleware/error.middleware.ts`)
    - 实现 operational error 处理逻辑
    - 实现 programmer error 处理逻辑
    - 添加错误日志记录（包含上下文信息）
    - 统一错误响应格式 { success: false, error: { code, message, details } }

  - [x] 1.3 添加 404 处理中间件
    - 捕获未匹配的路由
    - 返回标准 404 错误响应

- [x] 2. 创建路由定义文件
  - [x] 2.1 创建主路由文件 (`routes/index.ts`)
    - 定义路由分组（auth、users、lessons、ai、vocabulary）
    - 配置路由前缀 /api
    - 导出路由合并逻辑

  - [x] 2.2 导出所有控制器路由
    - 导入 auth、user、lesson、ai、vocabulary 控制器
    - 将各控制器路由挂载到主路由

- [x] 3. 增强认证中间件
  - [x] 3.1 实现 JWT 令牌黑名单机制
    - 创建 TokenBlacklistCache 类
    - 实现 addToBlacklist 方法（设置 TTL 为令牌剩余有效期）
    - 实现 isInBlacklist 检查方法

  - [x] 3.2 增强认证中间件 (`middleware/auth.middleware.ts`)
    - 验证 JWT 格式和签名
    - 检查令牌是否在黑名单中
    - 解析用户信息并附加到 req.user
    - 处理令牌过期、无效等情况
    - 定义 AUTH_* 前缀的错误码

  - [x] 3.3 实现可选认证中间件
    - 对于部分公开接口，允许无令牌访问
    - 有令牌时附加用户信息，无令牌时继续

- [ ] 4. 完善认证控制器
  - [ ] 4.1 增强注册验证 (`controllers/auth.controller.ts`)
    - 邮箱格式验证（RFC 5322）
    - 密码强度验证（最少 8 位）
    - 用户名长度验证（3-20 字符）
    - 使用 Zod 定义注册请求 schema

  - [ ] 4.2 实现账户锁定机制
    - 在 users 表添加 failed_login_attempts 和 locked_until 字段
    - 登录失败时增加计数
    - 连续 5 次失败锁定 15 分钟
    - 登录成功时重置计数

  - [ ] 4.3 实现刷新令牌宽限期
    - 令牌过期后 24 小时内允许刷新
    - 实现 token 刷新逻辑的宽限验证

  - [ ] 4.4 实现登出加入黑名单
    - 调用 Redis 将令牌加入黑名单
    - 设置 TTL 为令牌剩余有效期

- [ ] 5. 实现用户控制器
  - [ ] 5.1 实现用户信息获取 (`controllers/user.controller.ts`)
    - GET /api/users/profile 获取当前用户信息
    - 从 req.user 获取 userId
    - 返回脱敏用户数据

  - [ ] 5.2 实现用户信息更新
    - PUT /api/users/profile 更新用户名、头像
    - 验证更新数据
    - 调用 UserModel.update 方法

  - [ ] 5.3 实现学习进度获取
    - GET /api/users/progress 获取用户学习进度
    - 返回所有课程的完成度和词汇掌握情况

  - [ ] 5.4 实现学习统计获取
    - GET /api/users/statistics 获取统计数据
    - 计算学习天数、总时长、掌握词汇量等

- [ ] 6. 实现课程控制器
  - [ ] 6.1 实现课程列表获取 (`controllers/lesson.controller.ts`)
    - GET /api/lessons 获取所有课程
    - 返回课程摘要信息

  - [ ] 6.2 实现课程详情获取
    - GET /api/lessons/:id 获取课程详情
    - 包含句子列表和单词解析

  - [ ] 6.3 实现句子列表获取
    - GET /api/lessons/:id/sentences 获取句子
    - 支持分页和排序

  - [ ] 6.4 实现学习进度更新
    - POST /api/lessons/:id/progress 更新进度
    - 记录学习时间和完成情况

- [ ] 7. 实现 AI 控制器
  - [ ] 7.1 实现 AI 对话接口 (`controllers/ai.controller.ts`)
    - POST /api/ai/chat 调用 OpenAI API
    - 实现 30 秒超时
    - 处理 API 调用失败

  - [ ] 7.2 实现写作评估接口
    - POST /api/ai/writing-assessment
    - 返回包含语法、用词、表达建议的报告

  - [ ] 7.3 实现句子分析接口
    - POST /api/ai/sentence-analysis
    - 返回词汇、语法、句型分析

- [ ] 8. 完善前端 API 客户端
  - [ ] 8.1 增强 API 类型定义 (`src/api/index.ts`)
    - 定义 ApiResponse<T> 泛型接口
    - 定义统一错误响应类型

  - [ ] 8.2 实现完整的 API 方法
    - 添加所有后端接口对应的前端方法
    - 为每个方法定义请求和响应类型

  - [ ] 8.3 实现请求拦截器
    - 自动添加 JWT Token 到 Authorization 头
    - 添加请求超时处理

  - [ ] 8.4 实现响应拦截器
    - 统一错误处理
    - 401 时清除 token 并跳转登录
    - 显示用户友好的错误消息

- [ ] 9. 创建前端认证模块
  - [ ] 9.1 实现 useAuth 组合函数 (`src/composables/useAuth.ts`)
    - 定义 authState 响应式状态
    - 实现 login 方法（调用 API 并存储 token）
    - 实现 register 方法
    - 实现 logout 方法（清除 token）
    - 实现 refresh 方法（刷新令牌）

  - [ ] 9.2 实现认证守卫
    - 创建路由守卫检查登录状态
    - 受保护路由自动跳转登录

  - [ ] 9.3 实现登录页面组件
    - 邮箱和密码输入
    - 表单验证
    - 调用 login 方法
    - 错误提示展示

  - [ ] 9.4 实现注册页面组件
    - 邮箱、密码、用户名输入
    - 实时表单验证
    - 调用 register 方法

- [ ] 10. 实现前端错误处理
  - [ ] 10.1 创建错误处理工具 (`src/lib/errorHandler.ts`)
    - 定义错误配置映射（错误码 -> 用户消息）
    - 实现错误分类处理逻辑
    - 实现错误日志记录

  - [ ] 10.2 创建错误提示组件
    - Toast 通知组件
    - 根据错误级别显示不同样式
    - 自动消失和手动关闭

- [x] 11. 检查点 - 验证 API 对接
  - 确保所有测试通过，如有疑问请询问用户

- [ ] 12. 后端单元测试
  - [ ] 12.1 配置测试数据库
    - 创建测试数据库配置
    - 实现测试前清理和测试后清理

  - [ ] 12.2 实现认证控制器测试 (`tests/auth.controller.test.ts`)
    - 注册成功场景
    - 邮箱已存在场景
    - 登录成功场景
    - 密码错误场景
    - 刷新令牌场景
    - 登出场景

  - [ ] 12.3 实现认证中间件测试 (`tests/auth.middleware.test.ts`)
    - 有效令牌场景
    - 令牌缺失场景
    - 令牌无效场景
    - 令牌过期场景
    - 令牌在黑名单场景

  - [ ] 12.4 实现错误处理中间件测试
    - 测试各类错误响应格式
    - 测试日志记录

- [ ] 13. 后端集成测试
  - [ ] 13.1 配置集成测试环境 (`tests/integration/setup.ts`)
    - 创建测试 Express 应用
    - 配置测试数据库连接
    - 实现 supertest 封装

  - [ ] 13.2 实现认证流程集成测试
    - 注册->登录->访问受保护资源->登出 完整流程
    - 验证令牌刷新流程

  - [ ] 13.3 实现课程 API 集成测试
    - 测试课程列表、详情接口
    - 测试学习进度更新

- [ ] 14. 前端组件测试
  - [ ] 14.1 配置前端测试环境
    - 安装 @vue/test-utils 和 jsdom
    - 配置 vitest 前端测试

  - [ ] 14.2 实现 LoginForm 组件测试
    - 表单验证测试
    - 登录成功场景
    - 登录失败场景

  - [ ] 14.3 实现 RegisterForm 组件测试
    - 表单验证测试
    - 注册成功场景
    - 注册失败场景

- [ ] 15. 检查点 - 验证测试覆盖率
  - 确保后端测试覆盖率达到 80% 以上，如有疑问请询问用户

- [ ] 16. 配置开发和测试脚本
  - [ ] 16.1 更新 package.json 脚本
    - 添加测试命令
    - 添加覆盖率报告命令
    - 添加测试监听命令

  - [ ] 16.2 创建 .env.test 环境变量
    - 配置测试数据库
    - 配置测试 JWT 密钥

---

**创建时间**: 2026-05-24
**关联设计**: `.monkeycode/specs/api-integration-auth/design.md`

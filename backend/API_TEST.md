# EnglishAI API 测试指南

## 环境准备

```bash
# 确保后端服务运行
cd backend
npm run dev
```

## 测试脚本

### 1. 健康检查

```bash
curl -s http://localhost:3001/health | jq .
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### 2. 用户注册

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "Test User"
  }' | jq .
```

预期响应：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "Test User"
    }
  }
}
```

### 3. 用户登录

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

echo "Token: $TOKEN"
```

### 4. 获取用户信息

```bash
curl -s http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 5. 获取学习进度

```bash
curl -s http://localhost:3001/api/users/progress \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 6. 获取课程列表

```bash
curl -s http://localhost:3001/api/lessons | jq .
```

### 7. 获取句子列表

```bash
curl -s http://localhost:3001/api/lessons/1/sentences | jq .
```

### 8. AI 对话（需要配置 OpenAI API Key）

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How to improve my English speaking skills?",
    "context": "english_learning"
  }' | jq .
```

## 完整测试脚本

保存为 `test-api.sh`：

```bash
#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "🧪 开始测试 EnglishAI API..."
echo ""

# 健康检查
echo "1️⃣  健康检查..."
curl -s $BASE_URL/health | jq '.status'

# 注册
echo ""
echo "2️⃣  用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$RANDOM'@example.com",
    "password": "password123",
    "username": "Test User"
  }')

echo $REGISTER_RESPONSE | jq '.success'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')

# 登录
echo ""
echo "3️⃣  用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq '.success'
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

# 获取用户信息
echo ""
echo "4️⃣  获取用户信息..."
curl -s $BASE_URL/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.success'

# 获取课程
echo ""
echo "5️⃣  获取课程列表..."
curl -s $BASE_URL/lessons | jq '.data | length'

# 获取句子
echo ""
echo "6️⃣  获取句子列表..."
curl -s $BASE_URL/lessons/1/sentences | jq '.data | length'

echo ""
echo "✅ API 测试完成！"
```

赋予执行权限并运行：

```bash
chmod +x test-api.sh
./test-api.sh
```

## Postman 集合

导入以下 JSON 到 Postman：

```json
{
  "info": {
    "name": "EnglishAI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/../health"
      }
    },
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"username\": \"Test User\"\n}"
        },
        "url": "{{baseUrl}}/auth/register"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": "{{baseUrl}}/auth/login"
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "var jsonData = pm.response.json();",
              "pm.collectionVariables.set('token', jsonData.data.token);"
            ]
          }
        }
      ]
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/users/profile"
      }
    },
    {
      "name": "Get Lessons",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/lessons"
      }
    }
  ]
}
```

## 错误处理

### 常见错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（令牌无效或缺失） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述"
}
```

### 参数验证错误

```json
{
  "success": false,
  "message": "请求参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "无效的邮箱格式"
    }
  ]
}
```

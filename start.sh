#!/bin/bash

echo "🚀 启动句乐部游戏化英语学习系统..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：Node.js 未安装"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 启动后端
echo "📦 启动后端服务..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ 后端进程 ID: $BACKEND_PID"

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ 前端进程 ID: $FRONTEND_PID"

echo ""
echo "=========================================="
echo "🎉 服务启动成功！"
echo "=========================================="
echo "📊 后端地址：http://localhost:3001"
echo "🎨 前端地址：http://localhost:5173"
echo "=========================================="
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待进程
wait

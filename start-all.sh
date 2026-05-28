#!/bin/bash
# EnglishAI 商用版一键启动脚本

echo "╔════════════════════════════════════════════════╗"
echo "║   EnglishAI 商用版 - 生产级数据                 ║"
echo "║   数据量：2 万 + 句子，5 千 + 词汇，23 门课程          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# 检查数据库是否存在
if [ ! -f "backend/data/english.db" ]; then
    echo "📦 首次运行，初始化数据库..."
    cd backend
    npm run db:sqlite
    npx tsx scripts/populate-data.ts
    cd ..
    echo "✅ 数据库初始化完成"
    echo ""
fi

# 检查数据量是否充足
SENTENCE_COUNT=$(sqlite3 backend/data/english.db "SELECT COUNT(*) FROM sentences" 2>/dev/null || echo "0")
if [ "$SENTENCE_COUNT" -lt 1000 ]; then
    echo "📦 检测到数据量不足，正在导入生产级数据..."
    cd backend
    npx tsx scripts/populate-data.ts
    cd ..
    echo "✅ 数据导入完成"
    echo ""
fi

# 启动后端
echo "🚀 启动后端服务 (SQLite 模式)..."
cd backend
npm run dev:sqlite &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 检查后端状态
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务运行正常"
else
    echo "⚠️  后端服务可能未正常启动"
fi

# 启动前端
echo "🎨 启动前端服务..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   ✅ 所有服务已启动                            ║"
echo "║                                                ║"
echo "║   🌐 前端：http://localhost:5173               ║"
echo "║   🔌 后端：http://localhost:3001               ║"
echo "║   📊 健康检查：http://localhost:3001/api/health║"
echo "║                                                ║"
echo "║   数据库：SQLite 生产级                        ║"
echo "║   词汇：5030 个  |  课程：23 门  |  句子：20539 句  ║"
echo "║                                                ║"
echo "║   Ctrl+C 停止所有服务                          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait

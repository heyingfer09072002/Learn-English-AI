import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { createClient } from 'redis';

/**
 * PK 对战房间接口
 */
export interface PKRoom {
  roomId: string;
  player1: PKPlayer;
  player2?: PKPlayer;
  status: 'waiting' | 'playing' | 'finished';
  totalRounds: number;
  currentRound: number;
  answers: Record<string, { playerId: number; answer: string; isCorrect: boolean; timeSpent: number }[]>;
}

export interface PKPlayer {
  id: number;
  username: string;
  score: number;
  accuracy: number;
  combo: number;
  isReady: boolean;
}

/**
 * WebSocket 服务
 * 处理 PK 对战的实时通信
 */
export class WebSocketService {
  private static io: SocketIOServer | null = null;
  private static redisClient: ReturnType<typeof createClient> | null = null;
  private static rooms: Map<string, PKRoom> = new Map();

  /**
   * 初始化 WebSocket 服务器
   */
  static init(httpServer: Server) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      },
    });

    // 初始化 Redis (可选)
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      this.redisClient = createClient({
        url: redisUrl,
      });

      this.redisClient.on('error', (err) => {
        console.warn('Redis Client Error - using in-memory storage instead');
      });

      // 异步连接，不阻塞启动
      this.redisClient.connect().catch(() => {
        console.warn('Redis unavailable, using in-memory storage');
        this.redisClient = null;
      });
    } else {
      console.log('Redis not configured, using in-memory storage');
    }

    this.setupEventHandlers();

    console.log('✅ WebSocket 服务已启动');
  }

  /**
   * 设置事件处理器
   */
  private static setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`🔌 用户连接：${socket.id}`);

      // 创建 PK 房间
      socket.on('pk:create', async (data: { username: string }, callback) => {
        const roomId = `PK_${Date.now()}_${socket.id.substring(0, 8)}`;
        const room: PKRoom = {
          roomId,
          player1: {
            id: Math.floor(Math.random() * 10000), // TODO: 实际应该从 JWT 获取
            username: data.username,
            score: 0,
            accuracy: 0,
            combo: 0,
            isReady: false,
          },
          status: 'waiting',
          totalRounds: 10,
          currentRound: 0,
          answers: {},
        };

        this.rooms.set(roomId, room);
        socket.join(roomId);

        // 缓存到 Redis（5 分钟过期）
        await this.redisClient?.setEx(`pk:room:${roomId}`, 300, JSON.stringify(room));

        callback({ success: true, roomId, room });
      });

      // 加入 PK 房间
      socket.on('pk:join', async (data: { roomId: string; username: string }, callback) => {
        const room = this.rooms.get(data.roomId);
        
        if (!room || room.status !== 'waiting') {
          callback({ success: false, error: '房间不存在或已开始' });
          return;
        }

        if (room.player2) {
          callback({ success: false, error: '房间已满' });
          return;
        }

        room.player2 = {
          id: Math.floor(Math.random() * 10000),
          username: data.username,
          score: 0,
          accuracy: 0,
          combo: 0,
          isReady: false,
        };

        this.rooms.set(room.roomId, room);
        socket.join(data.roomId);

        // 通知房间内所有玩家
        this.io?.to(data.roomId).emit('pk:player_joined', { room });

        callback({ success: true, room });
      });

      // 玩家准备
      socket.on('pk:ready', (data: { roomId: string }, callback) => {
        const room = this.rooms.get(data.roomId);
        if (!room) {
          callback({ success: false, error: '房间不存在' });
          return;
        }

        // 更新玩家准备状态
        if (room.player1 && socket.rooms.has(data.roomId)) {
          room.player1.isReady = true;
        }
        if (room.player2 && socket.rooms.has(data.roomId)) {
          room.player2.isReady = true;
        }

        // 检查是否双方都准备好
        if (room.player1?.isReady && room.player2?.isReady) {
          room.status = 'playing';
          this.io?.to(data.roomId).emit('pk:start', { room });
        }

        callback({ success: true, room });
      });

      // 提交答案
      socket.on('pk:submit', async (data: { roomId: string; answer: string; timeSpent: number }, callback) => {
        const room = this.rooms.get(data.roomId);
        if (!room || room.status !== 'playing') {
          callback({ success: false, error: '比赛未开始' });
          return;
        }

        const roundKey = `round_${room.currentRound}`;
        if (!room.answers[roundKey]) {
          room.answers[roundKey] = [];
        }

        // 判断答案正确性（简化实现）
        const isCorrect = data.answer && data.answer.trim().length > 0;
        const score = isCorrect ? 100 : 0;

        // 找到当前玩家
        const player = room.player1 && socket.rooms.has(data.roomId) ? room.player1 : room.player2;
        if (player) {
          player.score += score;
          player.combo = isCorrect ? player.combo + 1 : 0;
          
          // 计算准确率
          const totalAnswers = room.answers[roundKey].length + 1;
          const correctAnswers = room.answers[roundKey].filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
          player.accuracy = correctAnswers / totalAnswers;
        }

        room.answers[roundKey].push({
          playerId: player?.id || 0,
          answer: data.answer,
          isCorrect,
          timeSpent: data.timeSpent,
        });

        // 检查是否所有玩家都提交了答案
        if (room.answers[roundKey].length >= 2) {
          // 双方都提交了，发送结果并进入下一轮
          this.io?.to(data.roomId).emit('pk:round_result', {
            round: room.currentRound,
            answers: room.answers[roundKey],
            player1: room.player1,
            player2: room.player2,
          });

          room.currentRound++;

          // 检查是否结束
          if (room.currentRound >= room.totalRounds) {
            room.status = 'finished';
            const winner = room.player1!.score > room.player2!.score ? room.player1 : room.player2;
            
            this.io?.to(data.roomId).emit('pk:finished', {
              winner,
              player1: room.player1,
              player2: room.player2,
            });

            // 清理房间
            this.rooms.delete(roomId);
            await this.redisClient?.del(`pk:room:${roomId}`);
          } else {
            // 下一题
            setTimeout(() => {
              this.io?.to(data.roomId).emit('pk:next_round', { round: room.currentRound });
            }, 2000);
          }
        }

        callback({ success: true, score, isCorrect });
      });

      // 断开连接
      socket.on('disconnect', () => {
        console.log(`🔌 用户断开：${socket.id}`);
        // 清理房间逻辑略
      });
    });
  }

  /**
   * 广播消息到房间
   */
  static broadcastToRoom(roomId: string, event: string, data: any) {
    this.io?.to(roomId).emit(event, data);
  }

  /**
   * 获取房间数量
   */
  static getRoomCount(): number {
    return this.rooms.size;
  }
}

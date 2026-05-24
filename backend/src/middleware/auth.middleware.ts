import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import {
  TokenMissingError,
  TokenInvalidError,
  TokenExpiredError as AppTokenExpiredError,
  AuthenticationError,
} from './errors.js';
import { asyncHandler } from './error.middleware.js';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

/**
 * Redis 工具类（用于令牌黑名单）
 * 注意：这是简化实现，实际项目中应该使用真正的 Redis 客户端
 */
class TokenBlacklistCache {
  private cache: Map<string, number> = new Map();

  /**
   * 将令牌加入黑名单
   * @param token JWT 令牌
   * @param ttlSeconds 过期时间（秒）
   */
  async addToBlacklist(token: string, ttlSeconds: number): Promise<void> {
    this.cache.set(token, Date.now() + ttlSeconds * 1000);
    
    // 定期清理过期条目（简化实现，实际应该使用 Redis 的 TTL）
    setTimeout(() => {
      this.cache.delete(token);
    }, ttlSeconds * 1000);
  }

  /**
   * 检查令牌是否在黑名单中
   */
  async isInBlacklist(token: string): Promise<boolean> {
    const expireTime = this.cache.get(token);
    if (!expireTime) return false;
    
    // 如果已过期，删除并返回 false
    if (Date.now() > expireTime) {
      this.cache.delete(token);
      return false;
    }
    
    return true;
  }
}

// 单例缓存实例
export const tokenBlacklist = new TokenBlacklistCache();

/**
 * JWT 认证中间件
 * 验证令牌格式、签名、有效期和黑名单
 */
export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TokenMissingError();
  }
  
  const token = authHeader.substring(7);
  
  // 检查令牌是否在黑名单中
  const isBlacklisted = await tokenBlacklist.isInBlacklist(token);
  if (isBlacklisted) {
    throw new AuthenticationError('令牌已失效', 'AUTH_TOKEN_BLACKLISTED');
  }
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; email: string };
    
    // 附加用户信息到请求
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppTokenExpiredError();
    }
    throw new TokenInvalidError();
  }
});

/**
 * 可选认证中间件
 * 对于部分公开接口，允许无令牌访问
 * 有令牌时附加用户信息，无令牌时继续
 */
export const optionalAuthMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 没有令牌，继续但不附加用户信息
    return next();
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; email: string };
    req.user = decoded;
  } catch (error) {
    // 令牌无效但继续（不抛出错误）
    // 这样可以允许访问公开内容，但用户未认证
  }
  
  next();
});

/**
 * 将令牌加入黑名单（用于登出）
 */
export const blacklistToken = async (token: string): Promise<void> => {
  try {
    // 解码令牌获取过期时间
    const decoded = jwt.decode(token) as { exp?: number };
    const now = Math.floor(Date.now() / 1000);
    
    if (decoded.exp && decoded.exp > now) {
      // 计算剩余有效期（秒）
      const ttlSeconds = decoded.exp - now;
      await tokenBlacklist.addToBlacklist(token, ttlSeconds);
    }
  } catch (error) {
    // 如果解码失败，使用默认 TTL（7 天）
    await tokenBlacklist.addToBlacklist(token, 7 * 24 * 60 * 60);
  }
};

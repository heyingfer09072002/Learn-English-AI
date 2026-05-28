import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '7d'
};

// 验证 Schema
const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位'),
  username: z.string().min(2, '用户名至少 2 位').optional()
});

const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码')
});

export class AuthController {
  /**
   * 用户注册
   */
  static async register(req: Request, res: Response) {
    try {
      // 验证输入
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error.errors[0].message
        });
      }
      
      const { email, password, username } = result.data;
      
      // 检查邮箱是否已存在
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: '该邮箱已被注册'
        });
      }
      
      // 加密密码
      const passwordHash = await bcrypt.hash(password, 10);
      
      // 创建用户
      const user = db.prepare(`
        INSERT INTO users (email, password_hash, username)
        VALUES (?, ?, ?)
        RETURNING id, email, username, avatar_url, level, exp, is_vip, created_at
      `).get(email, passwordHash, username || `User_${Date.now().toString().slice(-6)}`);
      
      // 生成 JWT Token
      const token = jwt.sign(
        { userId: (user as any).id, email: (user as any).email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: (user as any).id,
            email: (user as any).email,
            username: (user as any).username,
            avatar_url: (user as any).avatar_url,
            level: (user as any).level,
            exp: (user as any).exp,
            is_vip: (user as any).is_vip
          },
          token
        },
        message: '注册成功'
      });
      
    } catch (error: any) {
      console.error('注册失败:', error.message);
      res.status(500).json({
        success: false,
        error: '注册失败，请稍后重试'
      });
    }
  }

  /**
   * 用户登录
   */
  static async login(req: Request, res: Response) {
    try {
      // 验证输入
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error.errors[0].message
        });
      }
      
      const { email, password } = result.data;
      
      // 查找用户
      const user: any = db.prepare(`
        SELECT id, email, username, password_hash, avatar_url, level, exp, is_vip, vip_expire_at
        FROM users
        WHERE email = ?
      `).get(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: '邮箱或密码错误'
        });
      }
      
      // 验证密码
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: '邮箱或密码错误'
        });
      }
      
      // 更新最后登录时间
      db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
      
      // 生成 JWT Token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );
      
      // 移除密码哈希
      delete user.password_hash;
      
      // 检查 VIP 是否过期
      const now = new Date();
      const vipExpire = user.vip_expire_at ? new Date(user.vip_expire_at) : null;
      if (vipExpire && vipExpire < now) {
        db.prepare('UPDATE users SET is_vip = 0 WHERE id = ?').run(user.id);
        user.is_vip = 0;
      }
      
      res.json({
        success: true,
        data: {
          user,
          token
        },
        message: '登录成功'
      });
      
    } catch (error: any) {
      console.error('登录失败:', error.message);
      res.status(500).json({
        success: false,
        error: '登录失败，请稍后重试'
      });
    }
  }

  /**
   * 获取当前用户信息
   */
  static getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      const user: any = db.prepare(`
        SELECT id, email, username, avatar_url, level, exp, is_vip, 
               vip_expire_at, total_practice_time, created_at, last_login
        FROM users
        WHERE id = ?
      `).get(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      // 检查 VIP 是否过期
      const now = new Date();
      const vipExpire = user.vip_expire_at ? new Date(user.vip_expire_at) : null;
      if (vipExpire && vipExpire < now) {
        db.prepare('UPDATE users SET is_vip = 0 WHERE id = ?').run(user.id);
        user.is_vip = 0;
      }
      
      res.json({
        success: true,
        data: user
      });
      
    } catch (error: any) {
      console.error('获取用户信息失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取用户信息失败'
      });
    }
  }

  /**
   * 更新用户信息
   */
  static updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { username, avatar_url } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      const updates: string[] = [];
      const values: any[] = [];
      
      if (username) {
        updates.push('username = ?');
        values.push(username);
      }
      if (avatar_url) {
        updates.push('avatar_url = ?');
        values.push(avatar_url);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: '没有要更新的内容'
        });
      }
      
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);
      
      db.prepare(`
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
      `).run(...values);
      
      res.json({
        success: true,
        message: '更新成功'
      });
      
    } catch (error: any) {
      console.error('更新用户信息失败:', error.message);
      res.status(500).json({
        success: false,
        error: '更新失败'
      });
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { oldPassword, newPassword } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: '请输入旧密码和新密码'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: '新密码至少 6 位'
        });
      }
      
      // 获取用户当前密码
      const user: any = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      // 验证旧密码
      const isValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: '旧密码错误'
        });
      }
      
      // 更新密码
      const newHash = await bcrypt.hash(newPassword, 10);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newHash, userId);
      
      res.json({
        success: true,
        message: '密码修改成功'
      });
      
    } catch (error: any) {
      console.error('修改密码失败:', error.message);
      res.status(500).json({
        success: false,
        error: '修改密码失败'
      });
    }
  }
}

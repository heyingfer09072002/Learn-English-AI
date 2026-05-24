import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { UserModel } from '../models/User.model.js';
import { User } from '../models/User.model.js';

/**
 * 用户注册
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已注册'
      });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = await UserModel.create({
      email,
      username,
      passwordHash: hashedPassword
    });
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败'
    });
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
};

/**
 * 刷新令牌
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: '未提供令牌'
      });
    }
    
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; email: string };
    
    // 验证用户是否存在
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '无效的令牌'
    });
  }
};

/**
 * 用户登出
 */
export const logout = async (req: Request, res: Response) => {
  // TODO: 将令牌加入黑名单（使用 Redis）
  res.json({
    success: true,
    message: '登出成功'
  });
};

import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';

// VIP 套餐配置
const vipPlans = [
  {
    id: 'monthly',
    name: '月度 VIP',
    duration_days: 30,
    price: 29.9,
    original_price: 39.9,
    features: [
      '解锁所有课程内容',
      'AI 发音评测',
      '离线下载',
      '学习数据统计'
    ]
  },
  {
    id: 'quarterly',
    name: '季度 VIP',
    duration_days: 90,
    price: 79.9,
    original_price: 119.7,
    saving: '省 33%',
    features: [
      '解锁所有课程内容',
      'AI 发音评测',
      '离线下载',
      '学习数据统计',
      '专属客服'
    ]
  },
  {
    id: 'yearly',
    name: '年度 VIP',
    duration_days: 365,
    price: 299.9,
    original_price: 478.8,
    saving: '省 37%',
    popular: true,
    features: [
      '解锁所有课程内容',
      'AI 发音评测',
      '离线下载',
      '学习数据统计',
      '专属客服',
      '优先更新'
    ]
  }
];

export class VipController {
  /**
   * 获取 VIP 套餐列表
   */
  static getPlans(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: vipPlans
      });
    } catch (error: any) {
      console.error('获取 VIP 套餐失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取 VIP 套餐失败'
      });
    }
  }

  /**
   * 创建 VIP 订单
   */
  static createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { planId } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      // 查找套餐
      const plan = vipPlans.find(p => p.id === planId);
      if (!plan) {
        return res.status(400).json({
          success: false,
          error: '无效的套餐 ID'
        });
      }
      
      // 生成订单号
      const orderNo = `VIP${Date.now()}${Math.random().toString(36).slice(-6).toUpperCase()}`;
      
      // 创建订单
      const order = db.prepare(`
        INSERT INTO vip_orders (user_id, order_no, amount, duration_days, status)
        VALUES (?, ?, ?, ?, 'pending')
        RETURNING id, order_no, amount, duration_days, status, created_at
      `).get(userId, orderNo, plan.price, plan.duration_days);
      
      res.json({
        success: true,
        data: {
          order: order,
          plan: {
            name: plan.name,
            duration_days: plan.duration_days,
            price: plan.price
          },
          // 模拟支付链接（实际应接入支付宝/微信支付）
          paymentUrl: `/api/vip/pay/${(order as any).order_no}`
        },
        message: '订单创建成功，请完成支付'
      });
      
    } catch (error: any) {
      console.error('创建订单失败:', error.message);
      res.status(500).json({
        success: false,
        error: '创建订单失败'
      });
    }
  }

  /**
   * 模拟完成支付（开发环境使用）
   */
  static completePayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { orderNo } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      // 查找订单
      const order: any = db.prepare(`
        SELECT * FROM vip_orders WHERE order_no = ? AND user_id = ?
      `).get(orderNo, userId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: '订单不存在'
        });
      }
      
      if (order.status === 'completed') {
        return res.status(400).json({
          success: false,
          error: '订单已支付'
        });
      }
      
      // 更新订单状态
      db.prepare(`
        UPDATE vip_orders 
        SET status = 'completed', paid_at = CURRENT_TIMESTAMP
        WHERE order_no = ?
      `).run(orderNo);
      
      // 更新用户 VIP 状态
      const now = new Date();
      const expireDate = new Date(now.getTime() + order.duration_days * 24 * 60 * 60 * 1000);
      
      db.prepare(`
        UPDATE users 
        SET is_vip = 1, 
            vip_expire_at = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(expireDate, userId);
      
      res.json({
        success: true,
        message: '支付成功，VIP 已激活',
        data: {
          vip_expire_at: expireDate
        }
      });
      
    } catch (error: any) {
      console.error('完成支付失败:', error.message);
      res.status(500).json({
        success: false,
        error: '完成支付失败'
      });
    }
  }

  /**
   * 检查用户 VIP 状态
   */
  static checkStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      const user: any = db.prepare(`
        SELECT is_vip, vip_expire_at FROM users WHERE id = ?
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
      
      if (vipExpire && vipExpire < now && user.is_vip) {
        db.prepare('UPDATE users SET is_vip = 0 WHERE id = ?').run(userId);
        user.is_vip = 0;
      }
      
      res.json({
        success: true,
        data: {
          is_vip: !!user.is_vip,
          vip_expire_at: user.vip_expire_at,
          days_remaining: vipExpire ? Math.max(0, Math.ceil((vipExpire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0
        }
      });
      
    } catch (error: any) {
      console.error('检查 VIP 状态失败:', error.message);
      res.status(500).json({
        success: false,
        error: '检查 VIP 状态失败'
      });
    }
  }

  /**
   * 获取用户订单历史
   */
  static getOrderHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '未登录'
        });
      }
      
      const orders = db.prepare(`
        SELECT order_no, amount, duration_days, status, paid_at, created_at
        FROM vip_orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
      `).all(userId);
      
      res.json({
        success: true,
        data: orders,
        total: orders.length
      });
      
    } catch (error: any) {
      console.error('获取订单历史失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取订单历史失败'
      });
    }
  }
}

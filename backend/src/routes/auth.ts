import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { VipController } from '../controllers/vip.controller.js';
import { ProgressController } from '../controllers/progress.controller.js';
import { FavoritesController } from '../controllers/favorites.controller.js';
import { DailyTasksController } from '../controllers/daily-tasks.controller.js';
import { StatisticsController } from '../controllers/statistics-sqlite.controller.js';
import { AchievementsController } from '../controllers/achievements.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// ============ 认证相关 ============
/**
 * @api {post} /api/auth/register 用户注册
 * @apiBody {String} email 邮箱
 * @apiBody {String} password 密码（至少 6 位）
 * @apiBody {String} [username] 用户名（可选）
 */
router.post('/auth/register', AuthController.register);

/**
 * @api {post} /api/auth/login 用户登录
 * @apiBody {String} email 邮箱
 * @apiBody {String} password 密码
 */
router.post('/auth/login', AuthController.login);

/**
 * @api {post} /api/auth/logout 用户登出
 */
router.post('/auth/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
});

/**
 * @api {get} /api/auth/profile 获取个人信息
 */
router.get('/auth/profile', authMiddleware, AuthController.getProfile);

/**
 * @api {put} /api/auth/profile 更新个人信息
 */
router.put('/auth/profile', authMiddleware, AuthController.updateProfile);

/**
 * @api {post} /api/auth/change-password 修改密码
 */
router.post('/auth/change-password', authMiddleware, AuthController.changePassword);

// ============ VIP 相关 ============
/**
 * @api {get} /api/vip/plans 获取 VIP 套餐
 */
router.get('/vip/plans', VipController.getPlans);

/**
 * @api {get} /api/vip/status 检查 VIP 状态
 */
router.get('/vip/status', authMiddleware, VipController.checkStatus);

/**
 * @api {post} /api/vip/order 创建 VIP 订单
 */
router.post('/vip/order', authMiddleware, VipController.createOrder);

/**
 * @api {post} /api/vip/pay/:orderNo 完成支付
 */
router.post('/vip/pay/:orderNo', authMiddleware, VipController.completePayment);

/**
 * @api {get} /api/vip/orders 订单历史
 */
router.get('/vip/orders', authMiddleware, VipController.getOrderHistory);

export default router;

// ============ 学习进度相关 ============
/**
 * @api {post} /api/progress/save 保存学习进度
 */
router.post('/progress/save', authMiddleware, ProgressController.saveProgress);

/**
 * @api {get} /api/progress/course/:courseId 获取课程进度
 */
router.get('/progress/course/:courseId', authMiddleware, ProgressController.getCourseProgress);

/**
 * @api {get} /api/progress/all 获取所有课程进度
 */
router.get('/progress/all', authMiddleware, ProgressController.getAllProgress);

/**
 * @api {get} /api/progress/sentence/:sentenceId 获取句子进度
 */
router.get('/api/progress/sentence/:sentenceId', authMiddleware, ProgressController.getSentenceProgress);

/**
 * @api {post} /api/progress/course/:courseId/reset 重置课程进度
 */
router.post('/progress/course/:courseId/reset', authMiddleware, ProgressController.resetCourseProgress);

// ============ 错题本相关 ============
/**
 * @api {post} /api/favorites/add 收藏句子
 */
router.post('/favorites/add', authMiddleware, FavoritesController.addFavorite);

/**
 * @api {delete} /api/favorites/:id 取消收藏
 */
router.delete('/favorites/:id', authMiddleware, FavoritesController.removeFavorite);

/**
 * @api {get} /api/favorites 获取所有收藏
 */
router.get('/favorites', authMiddleware, FavoritesController.getFavorites);

/**
 * @api {put} /api/favorites/:id/note 更新笔记
 */
router.put('/favorites/:id/note', authMiddleware, FavoritesController.updateNote);

/**
 * @api {get} /api/favorites/stats 获取收藏统计
 */
router.get('/favorites/stats', authMiddleware, FavoritesController.getFavoritesStats);

// ============ 每日任务相关 ============
/**
 * @api {get} /api/daily-tasks 获取今日任务
 */
router.get('/daily-tasks', authMiddleware, DailyTasksController.getTodayTasks);

/**
 * @api {post} /api/daily-tasks/progress 更新任务进度
 */
router.post('/daily-tasks/progress', authMiddleware, DailyTasksController.updateTaskProgress);

/**
 * @api {post} /api/daily-tasks/checkin 打卡
 */
router.post('/daily-tasks/checkin', authMiddleware, DailyTasksController.checkin);

/**
 * @api {get} /api/daily-tasks/history 获取积分流水
 */
router.get('/daily-tasks/history', authMiddleware, DailyTasksController.getPointsHistory);

/**
 * @api {get} /api/daily-tasks/calendar 获取打卡日历
 */
router.get('/daily-tasks/calendar', authMiddleware, DailyTasksController.getCheckinCalendar);

// ============ 学习统计相关 ============
/**
 * @api {get} /api/statistics/overview 获取学习概览
 */
router.get('/statistics/overview', authMiddleware, StatisticsController.getOverview);

/**
 * @api {get} /api/statistics/trend 获取学习趋势
 */
router.get('/statistics/trend', authMiddleware, StatisticsController.getLearningTrend);

/**
 * @api {get} /api/statistics/courses 获取课程分布
 */
router.get('/statistics/courses', authMiddleware, StatisticsController.getCourseDistribution);

/**
 * @api {get} /api/statistics/difficulty 获取难度分布
 */
router.get('/statistics/difficulty', authMiddleware, StatisticsController.getDifficultyDistribution);

/**
 * @api {get} /api/statistics/heatmap 获取学习热力图
 */
router.get('/statistics/heatmap', authMiddleware, StatisticsController.getWeeklyHeatmap);

/**
 * @api {get} /api/statistics/grammar 获取语法点统计
 */
router.get('/statistics/grammar', authMiddleware, StatisticsController.getSentenceTypeStats);

// ============ 成就系统相关 ============
/**
 * @api {get} /api/achievements 获取成就列表
 */
router.get('/achievements', authMiddleware, AchievementsController.getAchievements);

/**
 * @api {get} /api/achievements/level 获取用户等级
 */
router.get('/achievements/level', authMiddleware, AchievementsController.getUserLevelInfo);

/**
 * @api {get} /api/achievements/levels 获取等级配置
 */
router.get('/achievements/levels', AchievementsController.getLevelConfig);

/**
 * @api {post} /api/achievements/exp 增加经验值
 */
router.post('/achievements/exp', authMiddleware, AchievementsController.addExp);

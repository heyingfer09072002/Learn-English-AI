import { Request, Response, NextFunction } from 'express';
import {
  AppError,
  ValidationError,
  NotFoundError,
  InternalError,
  DatabaseError,
  ServiceUnavailableError,
} from './errors.js';

/**
 * 错误日志接口
 */
interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn';
  errorCode: string;
  message: string;
  stack?: string;
  context: {
    userId?: number;
    requestPath: string;
    requestMethod: string;
    userAgent?: string;
    ip?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * 记录错误日志
 */
function logErrorLog(error: AppError, req: Request): ErrorLog {
  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    level: error.isOperational ? 'warn' : 'error',
    errorCode: error.errorCode,
    message: error.message,
    stack: error.stack,
    context: {
      userId: (req as any).user?.userId,
      requestPath: req.originalUrl,
      requestMethod: req.method,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.socket.remoteAddress || undefined,
    },
    metadata: error.details,
  };

  // 生产环境脱敏敏感信息
  if (process.env.NODE_ENV === 'production') {
    if (log.context.userAgent) {
      log.context.userAgent = log.context.userAgent.substring(0, 100) + '...';
    }
    // 脱敏邮箱和 token
    if (log.metadata) {
      Object.keys(log.metadata).forEach(key => {
        const value = log.metadata[key];
        if (typeof value === 'string' && (value.includes('@') || value.startsWith('eyJ'))) {
          log.metadata[key] = value.substring(0, 3) + '***';
        }
      });
    }
  }

  // 输出日志
  if (error.isOperational) {
    console.warn('⚠️  Operational Error:', JSON.stringify(log, null, 2));
  } else {
    console.error('❌  Programmer Error:', JSON.stringify(log, null, 2));
  }

  return log;
}

/**
 * 错误处理中间件
 * 统一处理所有错误并返回标准格式响应
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 默认错误
  let error: AppError;

  // 处理已知的应用错误
  if (err instanceof AppError) {
    error = err;
  } 
  // 处理 Mongoose 验证错误
  else if (err.name === 'ValidationError') {
    error = new ValidationError(err.message);
  } 
  // 处理 Mongoose  CastError
  else if (err.name === 'CastError') {
    error = new NotFoundError('资源 ID 格式无效');
  } 
  // 处理 PostgreSQL 错误
  else if (err.name === 'DatabaseError') {
    error = new DatabaseError(err.message);
  } 
  // 处理 JSON 解析错误
  else if (err instanceof SyntaxError && (err as any).status === 400) {
    error = new ValidationError('请求 JSON 格式无效');
  } 
  // 处理未捕获的异步错误
  else if (err.message.includes('timeout')) {
    error = new ServiceUnavailableError('外部服务超时');
  } 
  // 其他未知错误
  else {
    console.error('❌  Unhandled error:', err);
    error = new InternalError('服务器内部错误');
  }

  // 记录错误日志
  logErrorLog(error, req);

  // 返回统一格式的错误响应
  const errorResponse = {
    success: false,
    error: {
      code: error.errorCode,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
    },
  };

  res.status(error.statusCode).json(errorResponse);
};

/**
 * 404 处理中间件
 * 捕获所有未匹配的路由
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError('接口', {
    path: req.originalUrl,
    method: req.method,
  });
  
  next(error);
};

/**
 * 异步处理器包装器
 * 自动捕获 async 函数中的错误并传递给 next
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 应用错误基类
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    isOperational: boolean = true,
    details?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 认证错误 (401)
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = '认证失败',
    errorCode: string = 'AUTH_CREDENTIALS_INVALID',
    details?: Record<string, string>
  ) {
    super(message, 401, errorCode, true, details);
  }
}

/**
 * 令牌缺失错误
 */
export class TokenMissingError extends AppError {
  constructor() {
    super(
      '未提供认证令牌',
      401,
      'AUTH_TOKEN_MISSING',
      true
    );
  }
}

/**
 * 令牌无效错误
 */
export class TokenInvalidError extends AppError {
  constructor() {
    super(
      '无效的令牌',
      401,
      'AUTH_TOKEN_INVALID',
      true
    );
  }
}

/**
 * 令牌过期错误
 */
export class TokenExpiredError extends AppError {
  constructor() {
    super(
      '令牌已过期',
      401,
      'AUTH_TOKEN_EXPIRED',
      true
    );
  }
}

/**
 * 账户锁定错误
 */
export class AccountLockedError extends AppError {
  constructor(until?: Date) {
    super(
      '账户已锁定，请稍后重试',
      401,
      'AUTH_ACCOUNT_LOCKED',
      true,
      until ? { lockedUntil: until.toISOString() } : undefined
    );
  }
}

/**
 * 验证错误 (400)
 */
export class ValidationError extends AppError {
  constructor(
    message: string = '验证失败',
    details?: Record<string, string>
  ) {
    super(message, 400, 'VALIDATION_FAILED', true, details);
  }
}

/**
 * 邮箱格式错误
 */
export class InvalidEmailError extends AppError {
  constructor() {
    super(
      '邮箱格式无效',
      400,
      'VALIDATION_EMAIL_INVALID',
      true
    );
  }
}

/**
 * 密码强度不足错误
 */
export class WeakPasswordError extends AppError {
  constructor() {
    super(
      '密码长度不能少于 8 位',
      400,
      'VALIDATION_PASSWORD_WEAK',
      true
    );
  }
}

/**
 * 必填字段缺失错误
 */
export class FieldRequiredError extends AppError {
  constructor(fieldName: string) {
    super(
      `${fieldName}为必填项`,
      400,
      'VALIDATION_FIELD_REQUIRED',
      true,
      { field: fieldName }
    );
  }
}

/**
 * 邮箱已存在错误
 */
export class EmailExistsError extends AppError {
  constructor() {
    super(
      '该邮箱已注册',
      400,
      'VALIDATION_EMAIL_EXISTS',
      true
    );
  }
}

/**
 * 资源不存在错误 (404)
 */
export class NotFoundError extends AppError {
  constructor(
    resourceName: string = '资源',
    details?: Record<string, string>
  ) {
    super(
      `${resourceName}不存在`,
      404,
      'RESOURCE_NOT_FOUND',
      true,
      details
    );
  }
}

/**
 * 资源冲突错误 (409)
 */
export class ConflictError extends AppError {
  constructor(
    message: string = '资源冲突',
    details?: Record<string, string>
  ) {
    super(message, 409, 'RESOURCE_CONFLICT', true, details);
  }
}

/**
 * 请求频率限制错误 (429)
 */
export class RateLimitError extends AppError {
  constructor() {
    super(
      '请求过于频繁，请稍后重试',
      429,
      'RATE_LIMIT_EXCEEDED',
      true
    );
  }
}

/**
 * 数据库错误 (500)
 */
export class DatabaseError extends AppError {
  constructor(message?: string) {
    super(
      message || '数据库操作失败',
      500,
      'SYSTEM_DATABASE_ERROR',
      false
    );
  }
}

/**
 * 服务不可用错误 (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(serviceName?: string) {
    super(
      serviceName ? `${serviceName}暂时不可用` : '服务暂时不可用',
      503,
      'SYSTEM_SERVICE_UNAVAILABLE',
      false
    );
  }
}

/**
 * 内部服务器错误 (500)
 */
export class InternalError extends AppError {
  constructor(message: string = '内部服务器错误') {
    super(message, 500, 'SYSTEM_INTERNAL_ERROR', false);
  }
}

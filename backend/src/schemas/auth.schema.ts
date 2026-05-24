import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  password: z.string().min(6, '密码至少 6 位')
});

export const registerSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  password: z.string().min(6, '密码至少 6 位'),
  username: z.string().min(2, '用户名至少 2 位').max(50, '用户名不能超过 50 位')
});

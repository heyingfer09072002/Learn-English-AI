import { pool } from '../database/index.js';

export interface User {
  id?: number;
  email: string;
  username: string;
  passwordHash: string;
  avatar?: string;
  level?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel {
  /**
   * 创建用户表
   */
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        level VARCHAR(20) DEFAULT 'A1',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('✅ Users 表创建成功');
  }

  /**
   * 根据邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * 根据 ID 查找用户
   */
  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 创建用户
   */
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const query = `
      INSERT INTO users (email, username, password_hash, avatar, level)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      userData.email,
      userData.username,
      userData.passwordHash,
      userData.avatar || null,
      userData.level || 'A1'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 更新用户信息
   */
  static async update(id: number, updates: Partial<User>): Promise<User | null> {
    const allowedFields = ['username', 'avatar', 'level'];
    const updatesList: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updatesList.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updatesList.length === 0) {
      return this.findById(id);
    }

    updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${updatesList.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
}

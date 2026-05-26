import OpenAI from 'openai';
import { pool } from '../database/index.js';

/**
 * AI 助手服务
 * 提供智能答疑、句子分析等功能
 */
export class AIService {
  private static openai: OpenAI | null = null;

  /**
   * 初始化 OpenAI 客户端
   */
  private static getOpenAIClient(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY 环境变量未设置');
      }
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  /**
   * 分析句子
   */
  static async analyzeSentence(sentenceEn: string): Promise<{
    grammar: string;
    vocabulary: Array<{ word: string; pos: string; definition: string }>;
    usage: string;
    examples: string[];
  }> {
    const client = this.getOpenAIClient();
    
    const prompt = `请分析这个英语句子：${sentenceEn}
    
请提供：
1. 语法结构分析
2. 重点词汇（单词、词性、释义）
3. 用法说明
4. 3 个类似用法的例句

请用 JSON 格式返回。`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  /**
   * 回答问题
   */
  static async askQuestion(
    question: string,
    context?: { sentenceId?: number; courseId?: number }
  ): Promise<{
    answer: string;
    sources?: string[];
    examples?: string[];
  }> {
    const client = this.getOpenAIClient();
    
    const contextStr = context 
      ? `当前学习上下文：句子 ID ${context.sentenceId}, 课程 ID ${context.courseId}。`
      : '';

    const prompt = `${contextStr}请回答这个英语学习问题：${question}

请用简洁、易懂的中文回答，并提供相关例子。`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const answer = response.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';
    
    return {
      answer,
      examples: [],
    };
  }

  /**
   * 评估作文
   */
  static async evaluateWriting(essay: string): Promise<{
    score: number;
    grammar: Array<{ error: string; suggestion: string }>;
    vocabulary: string;
    structure: string;
    suggestions: string[];
  }> {
    const client = this.getOpenAIClient();
    
    const prompt = `请评估这篇英语作文：
${essay}

请提供：
1. 总体评分（0-100）
2. 语法错误及修改建议
3. 词汇使用评价
4. 结构评价
5. 改进建议

请用 JSON 格式返回。`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  /**
   * 记录 AI 使用日志
   */
  static async logUsage(
    userId: number,
    question: string,
    answer: string,
    tokenUsed: number,
    responseTime: number,
    sentenceId?: number
  ): Promise<void> {
    const query = `
      INSERT INTO ai_assistant_logs (
        user_id, sentence_id, question, answer, token_used, response_time
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await pool.query(query, [
      userId,
      sentenceId || null,
      question,
      answer,
      tokenUsed,
      responseTime,
    ]);
  }

  /**
   * 检查用户今日提问次数
   */
  static async getDailyQuestionCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM ai_assistant_logs
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE
    `;
    
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * 检查是否超出每日限制
   */
  static async checkDailyLimit(userId: number, limit: number = 2): Promise<boolean> {
    const count = await this.getDailyQuestionCount(userId);
    return count < limit;
  }
}

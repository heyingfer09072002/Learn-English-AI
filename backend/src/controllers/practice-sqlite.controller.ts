import { Request, Response } from 'express';
import { db } from '../database/sqlite.js';

export class PracticeControllerSQLite {
  static submitPractice(req: Request, res: Response) {
    try {
      const { sentenceId, userAudio, recognitionResult } = req.body;
      
      // 获取句子
      const sentence = db.prepare('SELECT * FROM sentences WHERE id = ?').get(sentenceId);
      
      if (!sentence) {
        return res.status(404).json({
          success: false,
          error: '句子不存在'
        });
      }
      
      // 简单的评分逻辑（实际应该调用 AI 评分）
      const score = Math.random() * 40 + 60; // 60-100 的随机分数
      const accuracy = Math.random() * 30 + 70; // 70-100 的随机准确率
      
      res.json({
        success: true,
        data: {
          score,
          accuracy,
          feedback: score > 80 ? 'Excellent!' : score > 70 ? 'Good job!' : 'Keep practicing!',
          sentence
        }
      });
    } catch (error: any) {
      console.error('提交练习失败:', error.message);
      res.status(500).json({
        success: false,
        error: '提交练习失败'
      });
    }
  }

  static getHistory(req: Request, res: Response) {
    try {
      const history = db.prepare(`
        SELECT p.*, s.content_en, s.content_cn
        FROM progress p
        JOIN sentences s ON p.sentence_id = s.id
        ORDER BY p.last_practiced DESC
        LIMIT 50
      `).all();
      
      res.json({
        success: true,
        data: history,
        total: history.length
      });
    } catch (error: any) {
      console.error('获取练习历史失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取练习历史失败'
      });
    }
  }

  static getStats(req: Request, res: Response) {
    try {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_practices,
          AVG(score) as avg_score,
          COUNT(DISTINCT sentence_id) as unique_sentences
        FROM pronunciation_scores
      `).get();
      
      res.json({
        success: true,
        data: stats || { total_practices: 0, avg_score: 0, unique_sentences: 0 }
      });
    } catch (error: any) {
      console.error('获取练习统计失败:', error.message);
      res.status(500).json({
        success: false,
        error: '获取练习统计失败'
      });
    }
  }
}

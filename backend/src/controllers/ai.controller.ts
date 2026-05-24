import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { config } from '../config/index.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

/**
 * AI 对话
 */
export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context = 'english_learning' } = req.body;
    
    if (!config.openaiApiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI 服务未配置'
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: [
        {
          role: 'system',
          content: `你是一个专业的英语教学助手。请用友好、鼓励的方式回复用户，${context === 'english_learning' ? '尽量使用简单的英语，并提供中文翻译' : ''}。`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0].message.content || '';
    
    res.json({
      success: true,
      data: {
        message: reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI 服务暂时不可用'
    });
  }
};

/**
 * 写作评估
 */
export const assessWriting = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!config.openaiApiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI 服务未配置'
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语写作评估教师。请评估用户的英语写作，包括语法错误、词汇使用、表达建议，并给出总体评分（0-100）。'
        },
        {
          role: 'user',
          content: `请评估以下英语写作：\n\n${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });
    
    const assessment = completion.choices[0].message.content || '';
    
    res.json({
      success: true,
      data: {
        assessment,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Writing assessment error:', error);
    res.status(500).json({
      success: false,
      message: '评估失败'
    });
  }
};

/**
 * 句子分析
 */
export const analyzeSentence = async (req: AuthRequest, res: Response) => {
  try {
    const { sentence } = req.body;
    
    if (!config.openaiApiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI 服务未配置'
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语语法教师。请分析句子的语法结构，包括词性、句子成分、语法规则。'
        },
        {
          role: 'user',
          content: `请分析这个句子：${sentence}`
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    });
    
    const analysis = completion.choices[0].message.content || '';
    
    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Sentence analysis error:', error);
    res.status(500).json({
      success: false,
      message: '分析失败'
    });
  }
};

/**
 * 口语评估
 */
export const evaluateSpeaking = async (req: AuthRequest, res: Response) => {
  try {
    const { audioUrl, transcript } = req.body;
    
    // TODO: 集成语音识别服务
    // 目前只评估文本转录
    
    return res.status(501).json({
      success: false,
      message: '口语评估功能开发中'
    });
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    res.status(500).json({
      success: false,
      message: '评估失败'
    });
  }
};

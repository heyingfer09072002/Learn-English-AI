/**
 * 课程创建服务
 * AI 驱动的课程自动生成
 */
export class CourseCreatorService {
  /**
   * 自动分句（文本）
   */
  static async splitTextIntoSentences(text: string): Promise<Array<{
    contentEn: string;
    contentCn?: string;
    sortOrder: number;
  }>> {
    // 简单的分句实现（按句号、问号、感叹号分割）
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return sentences.map((sentence, index) => ({
      contentEn: sentence.trim(),
      sortOrder: index,
    }));
  }

  /**
   * 估算学习时长
   */
  static estimateDuration(sentenceCount: number, avgWordCount: number): number {
    // 每个句子平均学习时间：30 秒 + 每多 5 个单词加 10 秒
    const timePerSentence = 30 + Math.floor((avgWordCount / 5)) * 10;
    return Math.ceil((sentenceCount * timePerSentence) / 60); // 转换为分钟
  }

  /**
   * 统计单词数
   */
  static countWords(sentence: string): number {
    return sentence.trim().split(/\s+/).length;
  }

  /**
   * 估算难度级别
   */
  static estimateDifficulty(sentences: string[]): 'beginner' | 'intermediate' | 'advanced' {
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const avgWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    
    if (avgLength < 30 || avgWords < 6) return 'beginner';
    if (avgLength < 60 || avgWords < 12) return 'intermediate';
    return 'advanced';
  }

  /**
   * 验证课程内容
   */
  static validateCourse(data: {
    title: string;
    content: string;
    courseType: 'text' | 'audio' | 'video' | 'music';
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.length < 1 || data.title.length > 200) {
      errors.push('课程标题长度为 1-200 字符');
    }

    if (!data.content || data.content.length === 0) {
      errors.push('课程内容不能为空');
    }

    const validTypes = ['text', 'audio', 'video', 'music'];
    if (!validTypes.includes(data.courseType)) {
      errors.push('无效的课程类型');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

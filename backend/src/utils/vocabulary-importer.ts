import { pool } from '../database/index.js';
import { VocabularyModel } from '../models/Vocabulary.model.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 原始词汇数据接口
 */
export interface RawWordData {
  word: string;
  phoneticUk?: string;
  phoneticUs?: string;
  difficultyLevel?: number;
  frequencyLevel?: 'high' | 'medium' | 'low';
  pos?: Array<{
    pos: string;
    definitionCn: string[];
    definitionEn?: string;
    rootAffix?: string;
    memoryTip?: string;
  }>;
  sentences?: Array<{
    sentenceEn: string;
    sentenceCn: string;
    audioUrl?: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
  categories?: Array<{
    categoryType: string;
    categoryValue: string;
    isPrimary?: boolean;
  }>;
}

/**
 * 导入错误接口
 */
export interface ImportError {
  rowNumber: number;
  field: string;
  errorType: 'missing_field' | 'invalid_format' | 'duplicate' | 'constraint_violation';
  message: string;
  value: any;
}

/**
 * 导入结果接口
 */
export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
  errorRecords: number;
  errors: ImportError[];
}

/**
 * 导入进度接口
 */
export interface ImportProgress {
  totalRecords: number;
  processedRecords: number;
  currentBatch: number;
  totalBatches: number;
  percentage: number;
  startTime: Date;
  estimatedEndTime?: Date;
}

/**
 * 词汇导入工具类
 */
export class VocabularyImporter {
  private currentProgress: ImportProgress | null = null;

  /**
   * 验证词汇数据
   */
  validateData(data: RawWordData[]): {
    isValid: boolean;
    errors: ImportError[];
    validCount: number;
  } {
    const errors: ImportError[] = [];

    data.forEach((row, index) => {
      // 必填字段检查
      if (!row.word) {
        errors.push({
          rowNumber: index + 1,
          field: 'word',
          errorType: 'missing_field',
          message: '词汇拼写为必填项',
          value: row.word,
        });
      }

      // 格式检查
      if (row.word && !/^[a-zA-Z\-']+$/.test(row.word)) {
        errors.push({
          rowNumber: index + 1,
          field: 'word',
          errorType: 'invalid_format',
          message: '词汇只能包含字母、连字符和撇号',
          value: row.word,
        });
      }

      // 难度等级检查
      if (row.difficultyLevel && (row.difficultyLevel < 1 || row.difficultyLevel > 10)) {
        errors.push({
          rowNumber: index + 1,
          field: 'difficultyLevel',
          errorType: 'invalid_format',
          message: '难度等级必须在 1-10 之间',
          value: row.difficultyLevel,
        });
      }

      // 词频等级检查
      if (row.frequencyLevel && !['high', 'medium', 'low'].includes(row.frequencyLevel)) {
        errors.push({
          rowNumber: index + 1,
          field: 'frequencyLevel',
          errorType: 'invalid_format',
          message: '词频等级必须为 high、medium 或 low',
          value: row.frequencyLevel,
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validCount: data.length - errors.length,
    };
  }

  /**
   * 检测重复词汇
   */
  async detectDuplicates(data: RawWordData[]): Promise<string[]> {
    const words = data.map(d => d.word.toLowerCase()).filter(Boolean);
    if (words.length === 0) return [];

    // 查询已存在的词汇
    const query = `
      SELECT LOWER(word) as word
      FROM words
      WHERE LOWER(word) = ANY($1)
    `;
    const result = await pool.query(query, [words]);
    return result.rows.map((r: any) => r.word);
  }

  /**
   * 从 JSON 文件导入
   */
  async importFromJson(filePath: string): Promise<ImportResult> {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`文件不存在：${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      throw new Error('JSON 文件必须包含词汇数组');
    }

    return this.batchInsert(data);
  }

  /**
   * 从 CSV 文件导入
   */
  async importFromCsv(filePath: string): Promise<ImportResult> {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`文件不存在：${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV 文件至少需要包含标题行和一行数据');
    }

    // 解析 CSV（简化实现，实际应该使用 csv-parse 库）
    const headers = lines[0].split(',').map(h => h.trim());
    const data: RawWordData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      data.push({
        word: row.word,
        phoneticUk: row.phonetic_uk,
        phoneticUs: row.phonetic_us,
        difficultyLevel: parseInt(row.difficulty_level) || undefined,
        frequencyLevel: row.frequency_level as any,
        pos: row.definition_cn ? [{
          pos: 'unknown',
          definitionCn: [row.definition_cn],
        }] : undefined,
      });
    }

    return this.batchInsert(data);
  }

  /**
   * 批量插入词汇
   */
  async batchInsert(
    data: RawWordData[],
    batchSize: number = 500
  ): Promise<ImportResult> {
    console.log(`🚀 开始导入词汇数据，共 ${data.length} 条记录...\n`);

    const result: ImportResult = {
      success: true,
      totalRecords: data.length,
      importedRecords: 0,
      skippedRecords: 0,
      errorRecords: 0,
      errors: [],
    };

    // 验证数据
    const validation = this.validateData(data);
    if (!validation.isValid) {
      result.errors.push(...validation.errors);
      result.errorRecords = validation.errors.length;
      result.success = false;
      return result;
    }

    // 检测重复
    console.log('🔍 检测重复词汇...');
    const duplicates = await this.detectDuplicates(data);
    console.log(`   发现 ${duplicates.length} 个已存在的词汇\n`);

    // 过滤重复词汇
    const newData = data.filter(
      d => !duplicates.includes(d.word!.toLowerCase())
    );
    result.skippedRecords = data.length - newData.length;

    if (newData.length === 0) {
      console.log('⚠️  没有新词汇需要导入\n');
      return result;
    }

    // 计算批次
    const totalBatches = Math.ceil(newData.length / batchSize);
    const startTime = new Date();

    this.currentProgress = {
      totalRecords: newData.length,
      processedRecords: 0,
      currentBatch: 0,
      totalBatches,
      percentage: 0,
      startTime,
    };

    console.log(`📦 开始批量插入，共 ${totalBatches} 批次，每批 ${batchSize} 条\n`);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (let i = 0; i < newData.length; i += batchSize) {
        const batch = newData.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;

        // 插入词汇主表
        const wordList = batch.map(d => ({
          word: d.word,
          phoneticUk: d.phoneticUk,
          phoneticUs: d.phoneticUs,
          difficultyLevel: d.difficultyLevel,
          frequencyLevel: d.frequencyLevel,
        }));

        const insertResult = await VocabularyModel.batchInsert(wordList);
        result.importedRecords += insertResult;

        // 更新进度
        this.currentProgress.processedRecords += batch.length;
        this.currentProgress.currentBatch = batchNumber;
        this.currentProgress.percentage = Math.round(
          (this.currentProgress.processedRecords / this.currentProgress.totalRecords) * 100
        );

        // 计算预计完成时间
        const elapsed = Date.now() - startTime.getTime();
        const rate = elapsed / this.currentProgress.processedRecords;
        const remaining = newData.length - this.currentProgress.processedRecords;
        this.currentProgress.estimatedEndTime = new Date(
          Date.now() + remaining * rate
        );

        console.log(
          `   批次 ${batchNumber}/${totalBatches}: ` +
          `已处理 ${this.currentProgress.processedRecords}/${newData.length} ` +
          `(${this.currentProgress.percentage}%) ` +
          `预计 ${this.currentProgress.estimatedEndTime.toLocaleTimeString()} 完成`
        );
      }

      await client.query('COMMIT');

      console.log(`\n✅ 词汇导入完成！\n`);
      console.log(`   导入记录数：${result.importedRecords}`);
      console.log(`   跳过记录数：${result.skippedRecords}`);
      console.log(`   错误记录数：${result.errorRecords}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('\n❌ 导入失败:', error);
      result.success = false;
      throw error;
    } finally {
      client.release();
      this.currentProgress = null;
    }

    return result;
  }

  /**
   * 获取当前导入进度
   */
  getImportProgress(): ImportProgress | null {
    return this.currentProgress;
  }
}

// CLI 入口
if (process.argv[1]?.endsWith('vocabulary-importer.ts')) {
  const filePath = process.argv[2];
  const format = process.argv[3] || 'json';

  if (!filePath) {
    console.error('用法：ts-node vocabulary-importer.ts <file_path> [format]');
    console.error('  format: json (默认) 或 csv');
    process.exit(1);
  }

  const importer = new VocabularyImporter();

  if (format === 'json') {
    importer
      .importFromJson(filePath)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (format === 'csv') {
    importer
      .importFromCsv(filePath)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    console.error('不支持的格式:', format);
    console.error('支持的格式：json, csv');
    process.exit(1);
  }
}

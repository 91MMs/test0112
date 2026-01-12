
import { GoogleGenAI, Type } from "@google/genai";
import { MaterialRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * 检查输入物料名称与现有库的相似度 (80% 逻辑)
   */
  async checkFuzzyMatch(newName: string, spec: string, existingRecords: MaterialRecord[]): Promise<{
    matchFound: boolean;
    reason?: string;
    similarItems: MaterialRecord[];
  }> {
    if (existingRecords.length === 0) return { matchFound: false, similarItems: [] };

    const recordsSample = existingRecords.slice(0, 50).map(r => ({ name: r.name, spec: r.specification, code: r.code }));
    
    const prompt = `
      你是一个专业的物料管理助手。请分析以下新物料：
      名称: "${newName}"
      规格: "${spec}"
      
      参考现有物料库（部分数据）：
      ${JSON.stringify(recordsSample)}
      
      判断逻辑：
      1. 如果名称和规格完全一致，判定为 100% 重复。
      2. 如果名称一致但规格略有不同，或名称/规格组合的相似度超过 80%，判定为疑似重复。
      
      请以 JSON 格式返回结果。
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchFound: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
              similarItemCodes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['matchFound', 'reason']
          }
        }
      });

      const result = JSON.parse(response.text);
      const similarItems = existingRecords.filter(r => result.similarItemCodes?.includes(r.code));

      return {
        matchFound: result.matchFound,
        reason: result.reason,
        similarItems
      };
    } catch (error) {
      console.error('Gemini check failed:', error);
      // Fallback: simple string inclusion check
      const matches = existingRecords.filter(r => r.name === newName);
      return {
        matchFound: matches.length > 0,
        reason: matches.length > 0 ? '检测到名称完全一致的物料' : '',
        similarItems: matches
      };
    }
  }
};

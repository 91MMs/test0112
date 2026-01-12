
import { GoogleGenAI, Type } from "@google/genai";
import { Player, GeminiMoveResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiMove = async (
  board: Player[],
  aiPlayer: 'X' | 'O'
): Promise<GeminiMoveResponse> => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  const boardStr = board.map((cell, idx) => cell === null ? idx : cell).join(', ');

  const prompt = `You are a strategic Tic-Tac-Toe master AI playing as '${aiPlayer}'. 
  The current board is represented by indices 0-8. Here is the board: [${boardStr}].
  Empty spots are represented by their index number.
  
  Your task:
  1. Analyze the board.
  2. Pick the winning index if available.
  3. Block the opponent if they are about to win.
  4. Otherwise, pick the best strategic index.
  5. Provide a short, witty, or competitive commentary in Chinese about your move.
  
  Return the result in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            index: {
              type: Type.INTEGER,
              description: "The index (0-8) for your move.",
            },
            commentary: {
              type: Type.STRING,
              description: "A short comment about the move in Chinese.",
            },
          },
          required: ["index", "commentary"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      index: data.index,
      commentary: data.commentary || "轮到我了，看招！"
    };
  } catch (error) {
    console.error("Gemini Move Error:", error);
    // Fallback: simple random move among available spots
    const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    const randomIndex = available[Math.floor(Math.random() * available.length)];
    return {
      index: randomIndex,
      commentary: "网络有点拥挤，但我依然能赢！"
    };
  }
};

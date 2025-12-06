import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLoveNote = async (tone: string): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return "Love makes the world go round.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, poetic, and heartwarming message (max 10 words) for a digital greeting card. Tone: ${tone}. Do not include quotes around the text.`,
      config: {
        maxOutputTokens: 50,
        temperature: 0.8,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "You are my universe.";
  }
};
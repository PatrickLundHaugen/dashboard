import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function textGeneration(
  message: string,
): Promise<AsyncGenerator<GenerateContentResponse>> {
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
      maxOutputTokens: 500,
      temperature: 0.1,
    },
    history: [],
  });

  return await chat.sendMessageStream({ message });
}

export default textGeneration;

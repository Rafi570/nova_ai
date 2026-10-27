import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatRequestBody, ChatResponse } from '../types/chat';

/**
 * Handle incoming chat requests
 */
export const handleChat = async (
  req: Request<{}, {}, ChatRequestBody>,
  res: Response<ChatResponse>
): Promise<void> => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no Gemini API key is configured yet
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      res.json({
        success: true,
        reply: `Nova AI (Demo Mode): You said "${message.trim()}". Backend is connected and working! To get real AI answers, add your GEMINI_API_KEY in backend/.env`,
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Call Google Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: 'You are Nova AI, a friendly, helpful, concise, and intelligent AI companion.',
    });

    // If chat history is provided, construct multi-turn chat
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .filter((item) => item.text && (item.isUser !== undefined || item.role))
        .map((item) => ({
          role: (item.role ? item.role : item.isUser ? 'user' : 'model') as 'user' | 'model',
          parts: [{ text: item.text }],
        }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message.trim());
      const reply = result.response.text();

      res.json({
        success: true,
        reply,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Single message prompt
    const result = await model.generateContent(message.trim());
    const reply = result.response.text();

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in chat controller:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'An error occurred while generating response.',
      timestamp: new Date().toISOString(),
    });
  }
};

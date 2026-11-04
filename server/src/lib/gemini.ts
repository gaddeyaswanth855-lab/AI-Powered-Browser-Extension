import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

export const GEMINI_MODEL = 'gemini-2.5-flash';

let genAIInstance: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  if (genAIInstance) return genAIInstance;
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyYourProductionGoogleGenAiKeyHere') {
    console.warn('[Gemini] GEMINI_API_KEY is not configured. Neural operations will utilize deterministic forensic fallback.');
    return null;
  }
  try {
    genAIInstance = new GoogleGenAI({ apiKey });
    return genAIInstance;
  } catch (err) {
    console.error('[Gemini] Error initializing GoogleGenAI client:', err);
    return null;
  }
}

export const ai = {
  get models() {
    const client = getGenAIClient();
    if (!client) {
      throw new Error('GEMINI_API_NOT_INITIALIZED');
    }
    return client.models;
  },
};

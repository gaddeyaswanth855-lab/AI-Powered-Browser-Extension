"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = exports.GEMINI_MODEL = void 0;
exports.getGenAIClient = getGenAIClient;
const genai_1 = require("@google/genai");
const env_1 = require("../config/env");
exports.GEMINI_MODEL = 'gemini-2.5-flash';
let genAIInstance = null;
function getGenAIClient() {
    if (genAIInstance)
        return genAIInstance;
    const apiKey = env_1.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyYourProductionGoogleGenAiKeyHere') {
        console.warn('[Gemini] GEMINI_API_KEY is not configured. Neural operations will utilize deterministic forensic fallback.');
        return null;
    }
    try {
        genAIInstance = new genai_1.GoogleGenAI({ apiKey });
        return genAIInstance;
    }
    catch (err) {
        console.error('[Gemini] Error initializing GoogleGenAI client:', err);
        return null;
    }
}
exports.ai = {
    get models() {
        const client = getGenAIClient();
        if (!client) {
            throw new Error('GEMINI_API_NOT_INITIALIZED');
        }
        return client.models;
    },
};

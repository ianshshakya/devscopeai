import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from '../config/constants.js';

// ─── Gemini (Free) ────────────────────────────────────────────
const callGemini = async (prompt) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 3000,
    },
  });

  const result = await model.generateContent(
    `You are a technical evaluator. Always respond with valid JSON only. No markdown, no explanations.\n\n${prompt}`
  );
  const text = result.response.text();
  // Strip any accidental markdown fences
  const clean = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean);
};

// ─── Groq (Free) ──────────────────────────────────────────────
const callGroq = async (prompt) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a technical evaluator. Always respond with valid JSON only. No markdown, no explanations, just the JSON object.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

// ─── DeepSeek ─────────────────────────────────────────────────
const callDeepSeek = async (prompt) => {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  });
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a technical evaluator. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

// ─── OpenAI ───────────────────────────────────────────────────
const callOpenAI = async (prompt) => {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a technical evaluator. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

// ─── Router ───────────────────────────────────────────────────
const getProvider = () => (process.env.AI_PROVIDER || 'gemini').toLowerCase();

export const callAI = async (prompt, retries = 2) => {
  const provider = getProvider();

  const callers = {
    gemini: callGemini,
    groq: callGroq,
    deepseek: callDeepSeek,
    openai: callOpenAI,
  };

  const caller = callers[provider] || callers.gemini;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await caller(prompt);
    } catch (err) {
      console.error(`AI call attempt ${attempt + 1} failed (${provider}):`, err.message);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

export const analyzeWithAI = async (prompt) => {
  try {
    return await callAI(prompt);
  } catch (err) {
    console.error('All AI attempts failed:', err.message);
    // Graceful fallback — basic scores from metrics only
    return {
      scores: {
        codeQuality: 40, architecture: 40, maintainability: 40,
        scalability: 30, documentation: 30, testing: 20, security: 50,
      },
      juniorReadiness: 40,
      midLevelReadiness: 20,
      portfolioQuality: 35,
      industryRelevance: 40,
      strengths: ['Code is committed to version control'],
      weaknesses: ['AI review temporarily unavailable — scores based on metrics only'],
      missingSkills: ['Testing', 'Documentation'],
      suggestedProjects: ['Add unit tests', 'Improve README'],
      categoryExplanations: {},
    };
  }
};

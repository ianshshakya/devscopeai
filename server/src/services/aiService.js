import OpenAI from 'openai';
import { AI_MODELS } from '../config/constants.js';

const getClient = () => {
  const provider = process.env.AI_PROVIDER || 'deepseek';

  if (provider === 'deepseek') {
    return new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getModel = () => {
  const provider = process.env.AI_PROVIDER || 'deepseek';
  return AI_MODELS[provider] || AI_MODELS.deepseek;
};

export const callAI = async (prompt, retries = 2) => {
  const client = getClient();
  const model = getModel();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a technical evaluator. Always respond with valid JSON only. No markdown, no explanations, just the JSON object.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

export const analyzeWithAI = async (prompt) => {
  try {
    return await callAI(prompt);
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    // Return sensible defaults if AI fails
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
      weaknesses: ['AI analysis temporarily unavailable'],
      missingSkills: ['Testing', 'Documentation'],
      suggestedProjects: ['Add unit tests', 'Improve README'],
      categoryExplanations: {},
    };
  }
};

import Roadmap from '../models/Roadmap.js';
import Report from '../models/Report.js';
import { buildRoadmapPrompt } from '../utils/promptBuilder.js';
import { analyzeWithAI } from './aiService.js';

export const generateRoadmap = async (userId) => {
  const report = await Report.findOne({ userId });
  if (!report) throw new Error('Generate your career report first before creating a roadmap.');

  const prompt = buildRoadmapPrompt({}, report);
  const aiResult = await analyzeWithAI(prompt);

  const roadmap = await Roadmap.findOneAndUpdate(
    { userId },
    {
      currentLevel: aiResult.currentLevel || 'Junior Developer',
      targetRole: aiResult.targetRole || 'Mid-Level Developer',
      estimatedTotalWeeks: aiResult.estimatedTotalWeeks || 12,
      milestones: (aiResult.milestones || []).map((m, i) => ({ ...m, order: i + 1 })),
      suggestedProjects: aiResult.suggestedProjects || [],
    },
    { upsert: true, new: true }
  );

  return roadmap;
};

export const getRoadmap = async (userId) => {
  return Roadmap.findOne({ userId });
};

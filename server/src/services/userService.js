import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import { getUserRepos } from './githubService.js';

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-accessToken');
  if (!user) throw new Error('User not found');
  return user;
};

export const getRepositories = async (userId) => {
  return getUserRepos(userId);
};

export const getStats = async (userId) => {
  const [user, analyses] = await Promise.all([
    User.findById(userId),
    Analysis.find({ userId, status: 'completed' }).sort({ createdAt: -1 }),
  ]);

  const scoreHistory = analyses.map((a) => ({
    date: a.createdAt,
    score: a.scores?.overall || 0,
    repoName: a.repoName,
  }));

  const avgScores = {
    overall: 0, frontend: 0, backend: 0, architecture: 0, security: 0, testing: 0, documentation: 0,
  };

  if (analyses.length > 0) {
    for (const field of Object.keys(avgScores)) {
      const vals = analyses.map((a) => a.scores?.[field] || 0).filter((v) => v > 0);
      avgScores[field] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    }
  }

  return {
    user,
    analysisCount: analyses.length,
    avgScores,
    scoreHistory,
    recentAnalyses: analyses.slice(0, 5),
  };
};

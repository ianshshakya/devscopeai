import User from '../models/User.js';
import Analysis from '../models/Analysis.js';

export const getComparison = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const userAnalyses = await Analysis.find({ userId, status: 'completed' });
  if (userAnalyses.length === 0) {
    return { error: 'No analyses yet', data: null };
  }

  // Get aggregated user scores
  const userScores = {};
  const fields = ['codeQuality', 'architecture', 'maintainability', 'scalability', 'documentation', 'testing', 'security', 'frontend', 'backend'];
  for (const field of fields) {
    const vals = userAnalyses.map((a) => a.scores?.[field] || 0).filter((v) => v > 0);
    userScores[field] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }

  // Aggregate all users for comparison (sample last 30 days, up to 1000 users)
  const platformAnalyses = await Analysis.find({
    status: 'completed',
    userId: { $ne: userId },
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  }).limit(1000);

  const platformScores = {};
  for (const field of fields) {
    const vals = platformAnalyses.map((a) => a.scores?.[field] || 0).filter((v) => v > 0);
    platformScores[field] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 50;
  }

  // Calculate percentiles
  const percentiles = {};
  for (const field of fields) {
    const allVals = platformAnalyses
      .map((a) => a.scores?.[field] || 0)
      .filter((v) => v > 0)
      .sort((a, b) => a - b);

    if (allVals.length === 0) {
      percentiles[field] = 50;
      continue;
    }

    const userVal = userScores[field];
    const below = allVals.filter((v) => v < userVal).length;
    percentiles[field] = Math.round((below / allVals.length) * 100);
  }

  return {
    userScores,
    platformAverages: platformScores,
    percentiles,
    totalUsersCompared: platformAnalyses.length,
  };
};

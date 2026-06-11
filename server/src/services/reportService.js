import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import Report from '../models/Report.js';
import { ROLE_THRESHOLDS } from '../config/constants.js';

const SALARY_TABLE = {
  juniorFrontend:  { india: [400000, 700000], global: [40000, 65000] },
  midFrontend:     { india: [700000, 1400000], global: [65000, 100000] },
  seniorFrontend:  { india: [1400000, 2500000], global: [100000, 160000] },
  juniorBackend:   { india: [450000, 750000], global: [45000, 70000] },
  midBackend:      { india: [750000, 1500000], global: [70000, 110000] },
  fullStack:       { india: [600000, 1600000], global: [55000, 120000] },
  devOps:          { india: [800000, 1800000], global: [75000, 130000] },
  mobileFlutter:   { india: [500000, 1200000], global: [50000, 95000] },
};

const ALL_ROLES = [
  { id: 'juniorFrontend',  label: 'Junior Frontend Developer' },
  { id: 'midFrontend',     label: 'Mid-Level Frontend Developer' },
  { id: 'seniorFrontend',  label: 'Senior Frontend Engineer' },
  { id: 'juniorBackend',   label: 'Junior Backend Developer' },
  { id: 'midBackend',      label: 'Mid-Level Backend Developer' },
  { id: 'fullStack',       label: 'Full Stack Engineer' },
  { id: 'devOps',          label: 'DevOps Engineer' },
  { id: 'mobileFlutter',   label: 'Flutter / Mobile Developer' },
];

const determineRoleFit = (avgScores) => {
  const recommendations = [];
  const thresholds = ROLE_THRESHOLDS;

  for (const role of ALL_ROLES) {
    const threshold = thresholds[role.id];
    if (!threshold) continue;
    let fit = true;
    let score = 100;
    for (const [metric, required] of Object.entries(threshold)) {
      const actual = avgScores[metric] || 0;
      if (actual < required) {
        fit = false;
        score = Math.min(score, Math.round((actual / required) * 100));
      }
    }
    recommendations.push({
      role: role.label,
      fit,
      score: fit ? Math.round(Object.values(avgScores).reduce((a, b) => a + b, 0) / Object.values(avgScores).length) : score,
      reasoning: fit
        ? `Your scores meet the requirements for this role.`
        : `You need to improve: ${Object.entries(threshold).filter(([m]) => (avgScores[m] || 0) < threshold[m]).map(([m]) => m).join(', ')}.`,
    });
  }
  return recommendations;
};

const estimateSalary = (recommendations) => {
  const fitted = recommendations.filter((r) => r.fit).map((r) =>
    ALL_ROLES.find((role) => role.label === r.role)?.id
  ).filter(Boolean);

  if (fitted.length === 0) {
    return {
      india: { min: 300000, max: 500000, currency: 'INR' },
      remoteGlobal: { min: 30000, max: 50000, currency: 'USD' },
    };
  }

  // Take the highest paying fitted role
  const salaries = fitted.map((id) => SALARY_TABLE[id]).filter(Boolean);
  const maxIndia = Math.max(...salaries.map((s) => s.india[1]));
  const minIndia = Math.min(...salaries.map((s) => s.india[0]));
  const maxGlobal = Math.max(...salaries.map((s) => s.global[1]));
  const minGlobal = Math.min(...salaries.map((s) => s.global[0]));

  return {
    india: { min: minIndia, max: maxIndia, currency: 'INR' },
    remoteGlobal: { min: minGlobal, max: maxGlobal, currency: 'USD' },
  };
};

export const generateReport = async (userId) => {
  const analyses = await Analysis.find({ userId, status: 'completed' }).sort({ createdAt: -1 }).limit(10);
  if (analyses.length === 0) {
    throw new Error('No completed analyses found. Please analyze at least one repository first.');
  }

  // Aggregate scores
  const scoreFields = ['codeQuality', 'architecture', 'maintainability', 'scalability', 'documentation', 'testing', 'security', 'frontend', 'backend'];
  const avgScores = {};
  for (const field of scoreFields) {
    const vals = analyses.map((a) => a.scores?.[field] || 0).filter((v) => v > 0);
    avgScores[field] = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }

  const overall = analyses.reduce((sum, a) => sum + (a.scores?.overall || 0), 0) / analyses.length;

  // Aggregate AI insights
  const allStrengths = [...new Set(analyses.flatMap((a) => a.aiReview?.strengths || []))].slice(0, 5);
  const allGaps = [...new Set(analyses.flatMap((a) => a.aiReview?.missingSkills || []))];

  const technicalGaps = allGaps.slice(0, 8).map((skill, i) => ({
    skill,
    priority: i < 3 ? 'high' : i < 6 ? 'medium' : 'low',
    description: `Consistently identified as a gap across your analyzed repositories.`,
  }));

  const roleRecommendations = determineRoleFit(avgScores);
  const salaryEstimate = estimateSalary(roleRecommendations);

  const report = await Report.findOneAndUpdate(
    { userId },
    {
      overallScore: Math.round(overall),
      scores: {
        frontend: avgScores.frontend,
        backend: avgScores.backend,
        architecture: avgScores.architecture,
        security: avgScores.security,
        testing: avgScores.testing,
        documentation: avgScores.documentation,
      },
      roleRecommendations,
      salaryEstimate,
      technicalGaps,
      strengths: allStrengths,
      analysisIds: analyses.map((a) => a._id),
    },
    { upsert: true, new: true }
  );

  // Update user's overall score
  await User.findByIdAndUpdate(userId, { overallScore: Math.round(overall) });

  return report;
};

export const getReport = async (userId) => {
  return Report.findOne({ userId });
};

import Analysis from '../models/Analysis.js';
import User from '../models/User.js';
import { getRepoDetails, getReadmeContent } from './githubService.js';
import { calculateMetrics, scoreMetrics } from '../utils/metricsCalculator.js';
import { buildAnalysisPrompt } from '../utils/promptBuilder.js';
import { analyzeWithAI } from './aiService.js';
import { SCORE_WEIGHTS } from '../config/constants.js';

const computeOverallScore = (scores) => {
  const weighted = Object.entries(SCORE_WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + (scores[key] || 0) * weight;
  }, 0);
  return Math.round(weighted);
};

const mergeScores = (metricScores, aiScores) => {
  const merged = {};
  const categories = ['codeQuality', 'architecture', 'maintainability', 'scalability', 'documentation', 'testing', 'security'];
  for (const cat of categories) {
    const metricVal = metricScores[cat] || 0;
    const aiVal = aiScores[cat] || metricVal;
    // Weighted blend: 40% metric-based + 60% AI judgment
    merged[cat] = Math.round(metricVal * 0.4 + aiVal * 0.6);
  }
  return merged;
};

export const startAnalysis = async (userId, repoFullName) => {
  // Check for recent analysis (prevent duplicate runs within 1 hour)
  const recent = await Analysis.findOne({
    userId,
    repoId: repoFullName,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    status: 'completed',
  });
  if (recent) return recent;

  const analysis = await Analysis.create({
    userId,
    repoId: repoFullName,
    repoName: repoFullName.split('/')[1],
    status: 'analyzing',
  });

  // Run analysis asynchronously
  runAnalysisPipeline(analysis._id, userId, repoFullName).catch(async (err) => {
    await Analysis.findByIdAndUpdate(analysis._id, {
      status: 'failed',
      errorMessage: err.message,
    });
    console.error(`Analysis failed for ${repoFullName}:`, err);
  });

  return analysis;
};

const runAnalysisPipeline = async (analysisId, userId, repoFullName) => {
  console.log(`🔍 Starting analysis pipeline for ${repoFullName}`);

  // Step 1: Fetch GitHub data
  const [repoDetails, readmeContent] = await Promise.all([
    getRepoDetails(userId, repoFullName),
    getReadmeContent(userId, repoFullName),
  ]);

  const repo = repoDetails.repo;

  // Step 2: Calculate structural metrics
  const metrics = calculateMetrics(repoDetails, readmeContent, repoDetails.fileTree);

  // Step 3: Score based on metrics
  const metricScores = scoreMetrics(metrics);

  // Step 4: Build file tree summary for AI prompt
  const fileTreeSummary = repoDetails.fileTree
    .filter((f) => f.type === 'blob')
    .slice(0, 60)
    .map((f) => f.path)
    .join('\n');

  const prompt = buildAnalysisPrompt(
    repoFullName,
    metrics,
    metrics.languages,
    readmeContent,
    fileTreeSummary
  );

  // Step 5: AI evaluation
  const aiResult = await analyzeWithAI(prompt);
  const finalScores = mergeScores(metricScores, aiResult.scores || {});
  const overall = computeOverallScore(finalScores);

  // Step 6: Save results
  const updateData = {
    status: 'completed',
    language: repo?.language || 'Unknown',
    stars: repo?.stargazers_count || 0,
    forks: repo?.forks_count || 0,
    repoUrl: repo?.html_url || '',
    scores: {
      ...finalScores,
      overall,
      frontend: metricScores.frontend || 0,
      backend: metricScores.backend || 0,
    },
    metrics: {
      totalFiles: metrics.totalFiles,
      hasReadme: metrics.hasReadme,
      readmeLength: metrics.readmeLength,
      hasTests: metrics.hasTests,
      testFileCount: metrics.testFileCount,
      hasCICD: metrics.hasCICD,
      hasDockerfile: metrics.hasDockerfile,
      dependencyCount: metrics.dependencyCount,
      commitCount: metrics.commitCount,
      contributorCount: metrics.contributorCount,
      lastCommitDaysAgo: metrics.lastCommitDaysAgo,
      languages: metrics.languages,
    },
    aiReview: {
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      missingSkills: aiResult.missingSkills || [],
      suggestedProjects: aiResult.suggestedProjects || [],
      categoryExplanations: aiResult.categoryExplanations || {},
      juniorReadiness: aiResult.juniorReadiness || 0,
      midLevelReadiness: aiResult.midLevelReadiness || 0,
      portfolioQuality: aiResult.portfolioQuality || 0,
      industryRelevance: aiResult.industryRelevance || 0,
    },
  };

  await Analysis.findByIdAndUpdate(analysisId, updateData);
  await User.findByIdAndUpdate(userId, {
    $inc: { analysisCount: 1 },
    lastAnalyzedAt: new Date(),
  });

  console.log(`✅ Analysis complete for ${repoFullName}: ${overall}/100`);
};

export const getAnalysis = async (analysisId, userId) => {
  return Analysis.findOne({ _id: analysisId, userId });
};

export const getAnalysisHistory = async (userId) => {
  return Analysis.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

export const deleteAnalysis = async (analysisId, userId) => {
  return Analysis.findOneAndDelete({ _id: analysisId, userId });
};

import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoId: { type: String, required: true }, // GitHub repo full name e.g. "user/repo"
    repoName: { type: String, required: true },
    repoUrl: { type: String },
    language: { type: String, default: 'Unknown' },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },
    scores: {
      overall: { type: Number, default: 0 },
      codeQuality: { type: Number, default: 0 },
      architecture: { type: Number, default: 0 },
      maintainability: { type: Number, default: 0 },
      scalability: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
      testing: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
    },
    metrics: {
      totalFiles: { type: Number, default: 0 },
      linesOfCode: { type: Number, default: 0 },
      hasReadme: { type: Boolean, default: false },
      readmeLength: { type: Number, default: 0 },
      hasTests: { type: Boolean, default: false },
      testFileCount: { type: Number, default: 0 },
      hasCICD: { type: Boolean, default: false },
      hasDockerfile: { type: Boolean, default: false },
      dependencyCount: { type: Number, default: 0 },
      commitCount: { type: Number, default: 0 },
      contributorCount: { type: Number, default: 0 },
      lastCommitDaysAgo: { type: Number, default: 0 },
      languages: { type: Map, of: Number, default: {} },
    },
    aiReview: {
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestedProjects: [String],
      categoryExplanations: {
        type: Map,
        of: new mongoose.Schema({
          explanation: String,
          suggestions: [String],
        }),
      },
      juniorReadiness: { type: Number, default: 0 },
      midLevelReadiness: { type: Number, default: 0 },
      portfolioQuality: { type: Number, default: 0 },
      industryRelevance: { type: Number, default: 0 },
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ userId: 1, repoId: 1 });

export default mongoose.model('Analysis', analysisSchema);

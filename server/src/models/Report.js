import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    overallScore: { type: Number, default: 0 },
    scores: {
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
      architecture: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      testing: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
    },
    roleRecommendations: [
      {
        role: String,
        fit: { type: Boolean, default: false },
        score: Number,
        reasoning: String,
      },
    ],
    salaryEstimate: {
      india: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
      },
      remoteGlobal: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
      },
    },
    technicalGaps: [
      {
        skill: String,
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        description: String,
      },
    ],
    strengths: [String],
    summary: { type: String, default: '' },
    analysisIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' }],
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);

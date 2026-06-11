import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    displayName: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' },
    accessToken: { type: String, select: false },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    company: { type: String, default: '' },
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    analysisCount: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    lastAnalyzedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

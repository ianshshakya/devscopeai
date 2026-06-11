import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skills: [String],
  estimatedWeeks: { type: Number, default: 2 },
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['course', 'article', 'project', 'book', 'video'], default: 'course' },
    },
  ],
  completed: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentLevel: { type: String, default: 'Junior Developer' },
    targetRole: { type: String, default: 'Mid-Level Developer' },
    estimatedTotalWeeks: { type: Number, default: 12 },
    milestones: [milestoneSchema],
    suggestedProjects: [
      {
        title: String,
        description: String,
        techStack: [String],
        difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);

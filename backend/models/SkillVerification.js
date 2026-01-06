import mongoose from 'mongoose';

const skillVerificationSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    skillBreakdown: {
      type: Map,
      of: Number,
      required: true,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    resumeBullet: {
      type: String,
      required: true,
    },
    plagiarismRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    aiModel: {
      type: String,
      default: 'gpt-4',
    },
    aiPrompt: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
skillVerificationSchema.index({ studentId: 1, verifiedAt: -1 });
skillVerificationSchema.index({ taskId: 1 });

const SkillVerification = mongoose.model('SkillVerification', skillVerificationSchema);

export default SkillVerification;


import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
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
    submissionType: {
      type: String,
      enum: ['github', 'file'],
      required: true,
    },
    githubRepo: {
      url: String,
      owner: String,
      repo: String,
      branch: String,
      commitHash: String,
      metadata: {
        language: String,
        stars: Number,
        forks: Number,
        size: Number,
        description: String,
        readme: String,
      },
    },
    fileUpload: {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      storagePath: String, // Path in storage (S3, local, etc.)
    },
    status: {
      type: String,
      enum: ['pending', 'evaluating', 'evaluated', 'failed'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    evaluatedAt: Date,
    evaluationResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillVerification',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
submissionSchema.index({ taskId: 1, studentId: 1 });
submissionSchema.index({ studentId: 1, status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;


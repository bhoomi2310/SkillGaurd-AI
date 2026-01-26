import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      validate: {
        validator: function(v) {
          // Password is required if no googleId
          return this.googleId || v;
        },
        message: 'Password is required for non-Google accounts'
      }
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['student', 'provider', 'recruiter'],
      required: [true, 'Please provide a role'],
    },
    profile: {
      bio: String,
      skills: [String],
      institution: String,
      year: String,
      company: String, // For providers/recruiters
      location: String,
      phone: String,
      website: String,
      linkedin: String,
      github: String,
      portfolio: String,
      experience: String,
      education: String,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    verifiedSkills: [
      {
        skill: String,
        score: Number,
        verifiedAt: Date,
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Task',
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  // Skip if password is not modified or doesn't exist
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  // Only hash if password is provided and not already hashed
  if (this.password && this.password.length < 60) { // bcrypt hashes are 60 chars
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;


import { validationResult } from 'express-validator';
import Submission from '../models/Submission.js';
import Task from '../models/Task.js';
import SkillVerification from '../models/SkillVerification.js';
import User from '../models/User.js';
import githubService from '../services/githubService.js';
import azureOpenAIService from '../services/azureOpenAI.js';

// @desc    Create submission
// @route   POST /api/submissions
// @access  Private (Student only)
export const createSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId, submissionType, githubRepo, fileUpload } = req.body;

    // Verify task exists and is active
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'active') {
      return res.status(400).json({ message: 'Task is not accepting submissions' });
    }

    // Check if student already submitted
    const existingSubmission = await Submission.findOne({
      taskId,
      studentId: req.user._id,
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted for this task' });
    }

    // Check max submissions limit
    if (task.maxSubmissions && task.currentSubmissions >= task.maxSubmissions) {
      return res.status(400).json({ message: 'Task has reached maximum submissions' });
    }

    let submissionData = {
      taskId,
      studentId: req.user._id,
      submissionType,
      status: 'pending',
    };

    // Handle GitHub submission
    if (submissionType === 'github' && githubRepo) {
      try {
        const { owner, repo, branch } = githubService.parseGitHubUrl(githubRepo.url);
        const metadata = await githubService.fetchRepoMetadata(owner, repo, branch);

        submissionData.githubRepo = {
          url: githubRepo.url,
          owner,
          repo,
          branch: branch || 'main',
          commitHash: metadata.commitHash,
          metadata: {
            language: metadata.language,
            stars: metadata.stars,
            forks: metadata.forks,
            size: metadata.size,
            description: metadata.description,
            readme: metadata.readme,
          },
        };
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    // Handle file submission
    // NOTE: In production, implement proper file upload handling:
    // 1. Use multer middleware to handle multipart/form-data
    // 2. Upload files to cloud storage (AWS S3, Azure Blob Storage, etc.)
    // 3. Store the storage URL/path in fileUpload.storagePath
    // For now, this expects file metadata to be sent in the request body
    if (submissionType === 'file' && fileUpload) {
      submissionData.fileUpload = {
        filename: fileUpload.filename,
        originalName: fileUpload.originalName,
        mimeType: fileUpload.mimeType,
        size: fileUpload.size,
        storagePath: fileUpload.storagePath, // In production: URL from cloud storage
      };
    }

    const submission = await Submission.create(submissionData);

    // Update task submission count
    await Task.findByIdAndUpdate(taskId, {
      $inc: { currentSubmissions: 1 },
    });

    // Trigger evaluation (async)
    evaluateSubmission(submission._id).catch((error) => {
      console.error('Evaluation error:', error);
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's submissions
// @route   GET /api/submissions/my-submissions
// @access  Private (Student only)
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('taskId', 'title description requiredSkills difficulty')
      .populate('evaluationResult')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('taskId')
      .populate('studentId', 'name email')
      .populate('evaluationResult');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check access: student can see own, provider can see for their tasks, recruiter can see all
    if (
      submission.studentId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'recruiter' &&
      (req.user.role !== 'provider' ||
        submission.taskId.providerId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions for a task
// @route   GET /api/submissions/task/:taskId
// @access  Private (Provider - own tasks, Recruiter - all)
export const getTaskSubmissions = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    if (
      req.user.role !== 'recruiter' &&
      task.providerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const submissions = await Submission.find({ taskId: req.params.taskId })
      .populate('studentId', 'name email profile')
      .populate('evaluationResult')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Evaluate submission using Azure OpenAI
 * This function is called asynchronously after submission creation
 */
async function evaluateSubmission(submissionId) {
  try {
    const submission = await Submission.findById(submissionId)
      .populate('taskId')
      .populate('studentId');

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Update status to evaluating
    submission.status = 'evaluating';
    await submission.save();

    const task = submission.taskId;
    let submissionContent = '';

    // Prepare submission content based on type
    if (submission.submissionType === 'github') {
      submissionContent = `
Repository: ${submission.githubRepo.owner}/${submission.githubRepo.repo}
Language: ${submission.githubRepo.metadata.language}
Description: ${submission.githubRepo.metadata.description}
README: ${submission.githubRepo.metadata.readme}
`;
    } else if (submission.submissionType === 'file') {
      // For file submissions, you would read the file content here
      // For now, we use metadata
      submissionContent = `
File: ${submission.fileUpload.originalName}
Type: ${submission.fileUpload.mimeType}
Size: ${submission.fileUpload.size} bytes
`;
    }

    // Call Azure OpenAI service
    const evaluation = await azureOpenAIService.evaluateSubmission({
      taskTitle: task.title,
      taskDescription: task.description,
      requiredSkills: task.requiredSkills,
      difficulty: task.difficulty,
      evaluationCriteria: task.evaluationCriteria,
      submissionType: submission.submissionType,
      githubMetadata: submission.githubRepo,
      fileMetadata: submission.fileUpload,
      submissionContent,
    });

    // Save evaluation result
    const skillVerification = await SkillVerification.create({
      submissionId: submission._id,
      taskId: task._id,
      studentId: submission.studentId._id,
      overallScore: evaluation.result.overallScore,
      skillBreakdown: evaluation.result.skillBreakdown,
      strengths: evaluation.result.strengths,
      weaknesses: evaluation.result.weaknesses,
      resumeBullet: evaluation.result.resumeBullet,
      plagiarismRisk: evaluation.result.plagiarismRisk,
      aiModel: 'gpt-4',
      aiPrompt: evaluation.prompt,
      aiResponse: evaluation.rawResponse,
    });

    // Update submission
    submission.status = 'evaluated';
    submission.evaluatedAt = new Date();
    submission.evaluationResult = skillVerification._id;
    await submission.save();

    // Update user's verified skills
    const skillBreakdown = evaluation.result.skillBreakdown;
    const verifiedSkills = Object.entries(skillBreakdown).map(([skill, score]) => ({
      skill,
      score,
      verifiedAt: new Date(),
      taskId: task._id,
    }));

    await User.findByIdAndUpdate(submission.studentId._id, {
      $push: { verifiedSkills: { $each: verifiedSkills } },
    });

    console.log(`Submission ${submissionId} evaluated successfully`);
  } catch (error) {
    console.error(`Evaluation failed for submission ${submissionId}:`, error);
    
    // Update submission status to failed
    await Submission.findByIdAndUpdate(submissionId, {
      status: 'failed',
    });
  }
}


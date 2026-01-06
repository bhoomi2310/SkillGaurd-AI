import express from 'express';
import { body } from 'express-validator';
import {
  createSubmission,
  getMySubmissions,
  getSubmission,
  getTaskSubmissions,
} from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const submissionValidation = [
  body('taskId').isMongoId().withMessage('Valid task ID is required'),
  body('submissionType')
    .isIn(['github', 'file'])
    .withMessage('Submission type must be github or file'),
  body('githubRepo.url')
    .if(body('submissionType').equals('github'))
    .notEmpty()
    .withMessage('GitHub URL is required for GitHub submissions'),
  body('fileUpload')
    .if(body('submissionType').equals('file'))
    .notEmpty()
    .withMessage('File upload is required for file submissions'),
];

router.post(
  '/',
  protect,
  authorize('student'),
  submissionValidation,
  createSubmission
);
router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.get('/:id', protect, getSubmission);
router.get(
  '/task/:taskId',
  protect,
  authorize('provider', 'recruiter'),
  getTaskSubmissions
);

export default router;


import express from 'express';
import {
  searchStudents,
  getStudentProfile,
  getVerificationReport,
  getStudentSummary,
} from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require recruiter role
router.use(protect);
router.use(authorize('recruiter'));

router.get('/search', searchStudents);
router.get('/student/:studentId', getStudentProfile);
router.get('/verification/:verificationId', getVerificationReport);
router.get('/student/:studentId/summary', getStudentSummary);

export default router;


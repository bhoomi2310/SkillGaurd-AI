import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('instructions').notEmpty().withMessage('Instructions are required'),
  body('evaluationCriteria')
    .notEmpty()
    .withMessage('Evaluation criteria are required'),
];

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', protect, authorize('provider'), taskValidation, createTask);
router.put('/:id', protect, authorize('provider'), updateTask);
router.delete('/:id', protect, authorize('provider'), deleteTask);
router.get('/provider/my-tasks', protect, authorize('provider'), getMyTasks);

export default router;


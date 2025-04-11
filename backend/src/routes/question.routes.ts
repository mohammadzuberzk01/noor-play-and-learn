
import express from 'express';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions,
} from '../controllers/question.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/:gameSlug/questions', getQuestions);
router.get('/:gameSlug/questions/random', getRandomQuestions);
router.get('/:gameSlug/questions/:questionId', getQuestion);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/:gameSlug/questions', createQuestion);
router.put('/:gameSlug/questions/:questionId', updateQuestion);
router.delete('/:gameSlug/questions/:questionId', deleteQuestion);

export default router;

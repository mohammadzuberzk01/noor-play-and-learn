
import express from 'express';
import {
  getWordOfTheDay,
  getWordByDate,
  createWordOfTheDay,
  updateWordOfTheDay,
  deleteWordOfTheDay,
} from '../controllers/wordOfTheDay.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/today', getWordOfTheDay);
router.get('/date/:date', getWordByDate);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createWordOfTheDay);
router.put('/:id', updateWordOfTheDay);
router.delete('/:id', deleteWordOfTheDay);

export default router;

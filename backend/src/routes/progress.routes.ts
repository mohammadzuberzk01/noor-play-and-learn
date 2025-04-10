
import express from 'express';
import {
  getUserProgress,
  getGameProgress,
  updateGameProgress,
} from '../controllers/progress.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes below this require authentication
router.use(protect);

router.get('/', getUserProgress);
router.get('/:gameSlug', getGameProgress);
router.put('/:gameSlug', updateGameProgress);

export default router;

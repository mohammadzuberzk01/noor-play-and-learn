
import express from 'express';
import {
  getAllGames,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame,
  getGameById,
} from '../controllers/game.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);
router.get('/id/:id', getGameById); // Add route to get game by ID

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;

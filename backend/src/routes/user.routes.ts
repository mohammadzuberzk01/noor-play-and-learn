
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes below this require authentication
router.use(protect);

router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.delete('/profile/:id', deleteUserAccount);

export default router;

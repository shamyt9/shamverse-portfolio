import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, createAchievement);

router.route('/:id')
  .put(protect, updateAchievement)
  .delete(protect, deleteAchievement);

export default router;

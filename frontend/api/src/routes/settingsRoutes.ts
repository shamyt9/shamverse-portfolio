import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router
    .route('/')
    .get(getSettings)
    .post(protect, updateSettings)
    .put(protect, updateSettings);

router.route('/:id').put(protect, updateSettings);

export default router;

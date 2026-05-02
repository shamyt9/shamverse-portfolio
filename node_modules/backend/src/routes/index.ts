import express from 'express';
import authRoutes from './authRoutes';
import projectRoutes from './projectRoutes';
import reviewRoutes from './reviewRoutes';
import settingsRoutes from './settingsRoutes';
import inquiryRoutes from './inquiryRoutes';
import skillRoutes from './skillRoutes';
import achievementRoutes from './achievementRoutes';
import priceRoutes from './priceRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingsRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/skills', skillRoutes);
router.use('/achievements', achievementRoutes);
router.use('/prices', priceRoutes);
router.use('/upload', uploadRoutes);

export default router;

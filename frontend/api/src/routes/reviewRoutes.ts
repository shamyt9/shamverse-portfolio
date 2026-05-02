import express from 'express';
import {
    getReviews,
    getPublicReviews,
    createReview,
    updateReview,
    deleteReview,
} from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/public/visible', getPublicReviews); // Get only visible reviews (public)
router.post('/', createReview); // Allow public review submission

// Admin routes
router.get('/', protect, getReviews); // Get all reviews (admin only)

router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

export default router;

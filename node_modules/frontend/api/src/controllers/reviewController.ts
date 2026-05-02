import { Request, Response } from 'express';
import Review from '../models/Review';

// @desc    Get all reviews (admin only - can see all)
// @route   GET /api/reviews
// @access  Private (Admin)
export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get visible reviews (public endpoint)
// @route   GET /api/reviews/public
// @access  Public
export const getPublicReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({ isVisible: true }).sort({
            createdAt: -1,
        });
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        const review = new Review(req.body);
        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            Object.assign(review, req.body);
            const updatedReview = await review.save();
            res.json(updatedReview);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            await review.deleteOne();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

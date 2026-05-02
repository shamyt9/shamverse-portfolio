import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../services/api';
import './Reviews.css';

interface Review {
    _id: string;
    clientName: string;
    clientEmail: string;
    clientDesignation?: string;
    workDescription: string;
    reviewText: string;
    rating: number;
    isVisible: boolean;
    createdAt: string;
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/public/visible');
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'star-filled' : 'star-empty'}
            />
        ));
    };

    return (
        <div className="reviews-page">
            {/* Header */}
            <div className="reviews-header">
                <div className="reviews-hero">
                    <h1>Client Reviews</h1>
                    <p>What clients say about working with me</p>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="reviews-container">
                {loading ? (
                    <div className="loading">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    <>
                        <div className="reviews-grid">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="review-card"
                                    onClick={() => setSelectedReview(review)}
                                >
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <h4 className="reviewer-name">
                                                {review.clientName}
                                            </h4>
                                            {review.clientDesignation && (
                                                <p className="reviewer-designation">
                                                    {review.clientDesignation}
                                                </p>
                                            )}
                                        </div>
                                        <div className="star-rating">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                    <div className="review-work">
                                        <p className="work-description">
                                            {review.workDescription}
                                        </p>
                                    </div>

                                    <p className="review-text">
                                        {review.reviewText.substring(0, 120)}...
                                    </p>

                                    <button className="read-more">
                                        Read Full Review
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Modal for detailed review */}
                        {selectedReview && (
                            <div
                                className="modal-overlay"
                                onClick={() => setSelectedReview(null)}
                            >
                                <div
                                    className="modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="modal-close"
                                        onClick={() => setSelectedReview(null)}
                                    >
                                        ×
                                    </button>

                                    <div className="modal-header">
                                        <div className="modal-reviewer">
                                            <h3>{selectedReview.clientName}</h3>
                                            {selectedReview.clientDesignation && (
                                                <p className="designation">
                                                    {
                                                        selectedReview.clientDesignation
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="modal-rating">
                                            {renderStars(selectedReview.rating)}
                                            <span className="rating-text">
                                                {selectedReview.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div className="modal-project">
                                        <h4>Project Details</h4>
                                        <p>{selectedReview.workDescription}</p>
                                    </div>

                                    <div className="modal-review">
                                        <h4>Review</h4>
                                        <p>{selectedReview.reviewText}</p>
                                    </div>

                                    <div className="modal-footer">
                                        <p className="contact-info">
                                            📧 {selectedReview.clientEmail}
                                        </p>
                                        <p className="review-date">
                                            Reviewed on{' '}
                                            {new Date(
                                                selectedReview.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-reviews">
                        <MessageSquare size={48} />
                        <h3>No reviews yet</h3>
                        <p>Check back soon for client testimonials</p>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            {reviews.length > 0 && (
                <div className="reviews-stats">
                    <div className="stat-card">
                        <h4>{reviews.length}</h4>
                        <p>Total Reviews</p>
                    </div>
                    <div className="stat-card">
                        <h4>
                            {(
                                reviews.reduce((sum, r) => sum + r.rating, 0) /
                                reviews.length
                            ).toFixed(1)}
                        </h4>
                        <p>Average Rating</p>
                    </div>
                    <div className="stat-card">
                        <h4>{reviews.filter((r) => r.rating === 5).length}</h4>
                        <p>5-Star Reviews</p>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle, Star, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import './AdminForms.css';

interface Review {
    _id?: string;
    clientName: string;
    clientEmail: string;
    clientDesignation?: string;
    workDescription: string;
    reviewText: string;
    rating: number;
    isVisible: boolean;
}

const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/reviews');
            setReviews(data);
        } catch (err: any) {
            setError('Failed to fetch reviews');
        }
    };

    const handleToggleVisibility = async (
        id: string,
        currentVisibility: boolean,
    ) => {
        setLoading(true);
        try {
            await api.put(`/reviews/${id}`, { isVisible: !currentVisibility });
            fetchReviews();
        } catch (err) {
            setError('Failed to update review visibility');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review?'))
            return;
        setLoading(true);
        try {
            await api.delete(`/reviews/${id}`);
            fetchReviews();
        } catch (err) {
            setError('Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="stars-display">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i < rating ? '#fbbf24' : 'none'}
                        color={i < rating ? '#fbbf24' : '#666'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Client Reviews</h3>
                <span className="review-count">{reviews.length} reviews</span>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="empty-state">
                        No reviews yet. Reviews will appear here when clients
                        submit them through the portfolio.
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className={`review-card glow-card ${!review.isVisible ? 'hidden-review' : ''}`}
                        >
                            <div className="review-header">
                                <div className="review-info">
                                    <h5>{review.clientName}</h5>
                                    {review.clientDesignation && (
                                        <p className="review-designation">
                                            {review.clientDesignation}
                                        </p>
                                    )}
                                    {renderStars(review.rating)}
                                </div>
                                <div className="review-actions">
                                    <button
                                        className="btn-icon visibility"
                                        onClick={() =>
                                            handleToggleVisibility(
                                                review._id || '',
                                                review.isVisible,
                                            )
                                        }
                                        title={
                                            review.isVisible
                                                ? 'Hide review'
                                                : 'Show review'
                                        }
                                        disabled={loading}
                                    >
                                        {review.isVisible ? (
                                            <Eye size={16} />
                                        ) : (
                                            <EyeOff size={16} />
                                        )}
                                    </button>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() =>
                                            handleDelete(review._id || '')
                                        }
                                        title="Delete"
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="review-email">{review.clientEmail}</p>
                            <p className="review-work">
                                {review.workDescription}
                            </p>
                            <p className="review-text">"{review.reviewText}"</p>
                            {!review.isVisible && (
                                <div className="hidden-badge">Hidden</div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminReviews;

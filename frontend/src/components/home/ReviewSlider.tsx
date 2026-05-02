import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './ReviewSlider.css';

interface Review {
    _id: string;
    clientName: string;
    clientEmail: string;
    clientDesignation?: string;
    workDescription: string;
    reviewText: string;
    rating: number;
    isVisible: boolean;
}

export default function ReviewSlider() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? 'star-filled' : 'star-empty'}
            />
        ));
    };

    if (loading || reviews.length === 0) {
        return null;
    }

    const currentReview = reviews[currentIndex];

    return (
        <section className="review-slider-section" id="reviews">
            <div className="section-header">
                <h2>Client Testimonials</h2>
                <p>What clients say about working with me</p>
            </div>

            <div className="slider-container">
                {/* Main Slider */}
                <div className="slider-main">
                    <div className="review-display">
                        <div className="review-content">
                            <p className="review-text">
                                "{currentReview.reviewText}"
                            </p>

                            <div className="review-author">
                                <div className="author-info">
                                    <h4 className="author-name">
                                        {currentReview.clientName}
                                    </h4>
                                    {currentReview.clientDesignation && (
                                        <p className="author-title">
                                            {currentReview.clientDesignation}
                                        </p>
                                    )}
                                </div>

                                <div className="review-meta">
                                    <div className="review-rating">
                                        {renderStars(currentReview.rating)}
                                    </div>
                                    {currentReview.workDescription && (
                                        <p className="review-project">
                                            {currentReview.workDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        className="slider-nav prev"
                        onClick={goToPrevious}
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="slider-nav next"
                        onClick={goToNext}
                        aria-label="Next review"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="slider-dots">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to review ${index + 1}`}
                        />
                    ))}
                </div>

                {/* See More Button */}
                <button
                    className="see-more-btn"
                    onClick={() => navigate('/reviews')}
                >
                    See All Reviews
                </button>
            </div>

            {/* Stats */}
            {reviews.length > 0 && (
                <div className="slider-stats">
                    <div className="stat">
                        <span className="stat-number">{reviews.length}</span>
                        <span className="stat-label">Reviews</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">
                            {(
                                reviews.reduce((sum, r) => sum + r.rating, 0) /
                                reviews.length
                            ).toFixed(1)}
                        </span>
                        <span className="stat-label">Avg Rating</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">
                            {Math.round(
                                (reviews.filter((r) => r.rating === 5).length /
                                    reviews.length) *
                                    100,
                            )}
                            %
                        </span>
                        <span className="stat-label">5-Star</span>
                    </div>
                </div>
            )}
        </section>
    );
}

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Star, User, Mail, Briefcase, FileText, MessageSquare } from 'lucide-react';
import api from '../services/api';
import './ReviewForm.css';

export default function ReviewForm() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientDesignation: '',
        workDescription: '',
        reviewText: '',
        rating: 5,
    });

    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientName || !formData.clientEmail || !formData.reviewText) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await api.post('/reviews', formData);

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    clientName: '',
                    clientEmail: '',
                    clientDesignation: '',
                    workDescription: '',
                    reviewText: '',
                    rating: 5,
                });
            }, 3000);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    'Failed to submit review. Please try again.',
            );
            console.error('Error submitting review:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return (
            <div className="star-rating-wrapper">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hoverRating || formData.rating) ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        <Star size={24} fill={star <= (hoverRating || formData.rating) ? "currentColor" : "none"} />
                    </button>
                ))}
                <span className="rating-label">
                    {formData.rating === 5 ? 'Excellent!' : 
                     formData.rating === 4 ? 'Great!' : 
                     formData.rating === 3 ? 'Good' : 
                     formData.rating === 2 ? 'Fair' : 'Poor'}
                </span>
            </div>
        );
    };

    return (
        <div className="review-form-wrapper">
            <div className="review-form-info">
                <div className="info-content">
                    <span className="tag">Testimonials</span>
                    <h2>Leave a Review</h2>
                    <p>
                        Your feedback helps me grow and provides valuable insights for future clients. 
                        Share your experience of working together!
                    </p>
                    <div className="review-features">
                        <div className="feature">
                            <div className="feature-icon"><CheckCircle size={18} /></div>
                            <span>Quick & Easy</span>
                        </div>
                        <div className="feature">
                            <div className="feature-icon"><CheckCircle size={18} /></div>
                            <span>Publicly Featured</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="review-form-container">
                {submitted ? (
                    <div className="success-state">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your review has been submitted and is pending approval.</p>
                        <button 
                            className="reset-btn" 
                            onClick={() => setSubmitted(false)}
                        >
                            Write Another Review
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="review-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={20} />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={14} /> Full Name *</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        placeholder="e.g. Alex Johnson"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Mail size={14} /> Email Address *</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        name="clientEmail"
                                        value={formData.clientEmail}
                                        onChange={handleChange}
                                        placeholder="alex@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Briefcase size={14} /> Designation</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="clientDesignation"
                                        value={formData.clientDesignation}
                                        onChange={handleChange}
                                        placeholder="CEO at TechCorp"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Star size={14} /> Overall Rating *</label>
                                {renderStars()}
                            </div>
                        </div>

                        <div className="form-group">
                            <label><FileText size={14} /> Project Description</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="workDescription"
                                    value={formData.workDescription}
                                    onChange={handleChange}
                                    placeholder="Web development, UI redesign, etc."
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><MessageSquare size={14} /> Your Review *</label>
                            <div className="input-wrapper">
                                <textarea
                                    name="reviewText"
                                    value={formData.reviewText}
                                    onChange={handleChange}
                                    placeholder="Tell others about your experience..."
                                    rows={4}
                                    required
                                />
                                <span className="char-count">
                                    {formData.reviewText.length}/500
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span>Submitting...</span>
                            ) : (
                                <>
                                    <span>Post Review</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import api from '../services/api';
import './PricingDetail.css';

interface Price {
    _id: string;
    serviceName: string;
    price: string;
    features: string[];
    images: string[];
}

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0)
        return <div className="slider-placeholder" />;

    return (
        <div className="detail-slider">
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={images[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="slider-image"
                />
            </AnimatePresence>
            {images.length > 1 && (
                <div className="slider-dots">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`dot ${i === index ? 'active' : ''}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function PricingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Price | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPricingDetail();
    }, [id]);

    const fetchPricingDetail = async () => {
        try {
            const { data } = await api.get('/prices');
            const selectedPlan = data.find((p: Price) => p._id === id);
            setPlan(selectedPlan || null);
        } catch (err) {
            console.error('Failed to fetch pricing detail');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppContact = (plan: Price) => {
        const phoneNumber = '918004230656';
        const featuresList = plan.features.map((f) => `• ${f}`).join('%0A');
        const message = `Hello ShamVerse! %0A%0AI am interested in the *${plan.serviceName}* plan.%0A%0A*Details:*%0A💰 *Price:* ₹${plan.price}%0A✨ *Features:*%0A${featuresList}`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="pricing-detail-page">
                <div className="loading">Loading pricing details...</div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="pricing-detail-page">
                <div className="error">
                    <p>Pricing plan not found</p>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/pricing')}
                    >
                        <ArrowLeft size={20} />
                        Back to Pricing
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pricing-detail-page">
            <div className="detail-header">
                <button
                    className="back-btn"
                    onClick={() => navigate('/pricing')}
                >
                    <ArrowLeft size={20} />
                    Back to Pricing
                </button>
            </div>

            <motion.div
                className="detail-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="detail-grid">
                    {/* Image Section */}
                    <div className="detail-image-section">
                        <ImageSlider images={plan.images} />
                    </div>

                    {/* Details Section */}
                    <div className="detail-content-section">
                        <div className="detail-badge">Service Plan</div>
                        <h1 className="detail-title">{plan.serviceName}</h1>
                        <div className="detail-price">₹{plan.price}</div>

                        {/* Features */}
                        <div className="detail-features-section">
                            <h2>Included Features:</h2>
                            <ul className="detail-features-list">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <CheckCircle
                                            size={22}
                                            className="feature-icon"
                                        />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Button */}
                        <button
                            className="enquire-btn"
                            onClick={() => handleWhatsAppContact(plan)}
                        >
                            <MessageCircle size={20} />
                            <span>Enquire Now</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

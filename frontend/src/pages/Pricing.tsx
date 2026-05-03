import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, MessageCircle } from 'lucide-react';
import api from '../services/api';
import './Pricing.css';

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
        <div className="card-slider">
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

export default function Pricing() {
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Price | null>(null);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const { data } = await api.get('/prices');
            setPrices(data);
        } catch (err) {
            console.error('Failed to fetch prices');
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

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glow-text"
                >
                    Project Pricing
                </motion.h1>
                <p>Professional services tailored to your digital needs</p>
            </div>

            <div className="container pricing-container">
                {loading ? (
                    <div className="loading">Loading pricing plans...</div>
                ) : (
                    <div className="pricing-grid">
                        {prices.map((plan, idx) => (
                            <motion.div
                                key={plan._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="pricing-card glow-card"
                                onClick={() => setSelectedPlan(plan)}
                                style={{ cursor: 'zoom-in' }}
                            >
                                <ImageSlider images={plan.images} />

                                <div className="card-body">
                                    <h3 className="service-name">
                                        {plan.serviceName}
                                    </h3>
                                    <div className="price-tag">
                                        ₹{plan.price}
                                    </div>

                                    <ul className="features-list">
                                        {plan.features
                                            .slice(0, 3)
                                            .map((feature, i) => (
                                                <li key={i}>
                                                    <CheckCircle
                                                        size={16}
                                                        className="feature-icon"
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        {plan.features.length > 3 && (
                                            <li className="more-features">
                                                +{plan.features.length - 3} more
                                                features
                                            </li>
                                        )}
                                    </ul>

                                    <div
                                        className="card-zoom-indicator"
                                        style={{
                                            textAlign: 'center',
                                            marginTop: 'auto',
                                            fontSize: '0.8rem',
                                            color: 'var(--accent-color)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Click for Full Details
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pricing Modal */}
            <AnimatePresence>
                {selectedPlan && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPlan(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close"
                                onClick={() => setSelectedPlan(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="modal-layout">
                                <div className="modal-image-area">
                                    <div className="modal-slider-wrapper">
                                        <ImageSlider
                                            images={selectedPlan.images}
                                        />
                                    </div>
                                </div>
                                <div className="modal-details-area">
                                    <div className="modal-badge">
                                        Service Plan
                                    </div>
                                    <h2>{selectedPlan.serviceName}</h2>
                                    <div className="modal-price-big">
                                        ₹{selectedPlan.price}
                                    </div>

                                    <div className="modal-features-full">
                                        <h3>Included Features:</h3>
                                        <ul className="full-features-list">
                                            {selectedPlan.features.map(
                                                (feature, i) => (
                                                    <li key={i}>
                                                        <CheckCircle
                                                            size={20}
                                                            className="feature-icon"
                                                        />
                                                        <span>{feature}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    <button
                                        className="modal-order-btn"
                                        onClick={() =>
                                            handleWhatsAppContact(selectedPlan)
                                        }
                                    >
                                        <MessageCircle size={20} />
                                        <span>Contact on WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

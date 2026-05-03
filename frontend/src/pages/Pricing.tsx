import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
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
    const navigate = useNavigate();
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleCardClick = (planId: string) => {
        navigate(`/pricing/${planId}`);
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
                                onClick={() => handleCardClick(plan._id)}
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
        </div>
    );
}

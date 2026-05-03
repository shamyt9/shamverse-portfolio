import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Calendar } from 'lucide-react';
import api from '../services/api';
import './AchievementDetail.css';

interface Achievement {
    _id: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description?: string;
}

export default function AchievementDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [achievement, setAchievement] = useState<Achievement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievementDetail();
    }, [id]);

    const fetchAchievementDetail = async () => {
        try {
            const { data } = await api.get('/achievements');
            const selectedAchievement = data.find(
                (a: Achievement) => a._id === id,
            );
            setAchievement(selectedAchievement || null);
        } catch (err) {
            console.error('Failed to fetch achievement detail');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="achievement-detail-page">
                <div className="loading">Loading achievement details...</div>
            </div>
        );
    }

    if (!achievement) {
        return (
            <div className="achievement-detail-page">
                <div className="error">
                    <p>Achievement not found</p>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/achievements')}
                    >
                        <ArrowLeft size={20} />
                        Back to Achievements
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="achievement-detail-page">
            <div className="detail-header">
                <button
                    className="back-btn"
                    onClick={() => navigate('/achievements')}
                >
                    <ArrowLeft size={20} />
                    Back to Achievements
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
                        <img
                            src={achievement.image}
                            alt={achievement.title}
                            className="achievement-image-large"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="detail-content-section">
                        <div className="detail-badge">Achievement</div>
                        <h1 className="detail-title">{achievement.title}</h1>

                        {/* Issuer Info */}
                        <div className="detail-info-row">
                            <Award size={22} className="info-icon" />
                            <div>
                                <label>Issuer</label>
                                <p>{achievement.issuer}</p>
                            </div>
                        </div>

                        {/* Date Info */}
                        <div className="detail-info-row">
                            <Calendar size={22} className="info-icon" />
                            <div>
                                <label>Date Received</label>
                                <p>
                                    {new Date(
                                        achievement.date,
                                    ).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {achievement.description && (
                            <div className="detail-description-section">
                                <h2>About this Milestone</h2>
                                <p>{achievement.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import api from '../services/api';
import './Achievements.css';

interface Achievement {
    _id: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description?: string;
}

export default function Achievements() {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data } = await api.get('/achievements');
                setAchievements(data);
            } catch (err) {
                console.error('Failed to fetch achievements');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    const handleCardClick = (achievementId: string) => {
        navigate(`/achievements/${achievementId}`);
    };

    return (
        <div className="achievements-page">
            <div className="pricing-header">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glow-text"
                >
                    Achievements & Certifications
                </motion.h1>
                <p>
                    A collection of my professional milestones and recognitions
                </p>
            </div>

            <div className="container achievements-container">
                {loading ? (
                    <div className="loading">Loading achievements...</div>
                ) : (
                    <div className="achievements-grid">
                        {achievements.map((achievement, idx) => (
                            <motion.div
                                key={achievement._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="achievement-card glow-card"
                                onClick={() => handleCardClick(achievement._id)}
                                style={{ cursor: 'zoom-in' }}
                            >
                                <div className="achievement-image-wrapper">
                                    <img
                                        src={achievement.image}
                                        alt={achievement.title}
                                        className="achievement-image"
                                    />
                                    <div className="achievement-overlay">
                                        <div className="zoom-hint">
                                            Click to View Details
                                        </div>
                                    </div>
                                </div>

                                <div className="achievement-content">
                                    <div className="achievement-date">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(
                                                achievement.date,
                                            ).toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="achievement-title">
                                        {achievement.title}
                                    </h3>
                                    <p className="achievement-issuer">
                                        {achievement.issuer}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

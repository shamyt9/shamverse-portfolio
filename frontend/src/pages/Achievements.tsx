import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Award, X, ChevronRight, MapPin } from 'lucide-react';
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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

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
        <p>A collection of my professional milestones and recognitions</p>
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
                onClick={() => setSelectedAchievement(achievement)}
                style={{ cursor: 'zoom-in' }}
              >
                <div className="achievement-image-wrapper">
                  <img src={achievement.image} alt={achievement.title} className="achievement-image" />
                  <div className="achievement-overlay">
                    <div className="zoom-hint">Click to View Details</div>
                  </div>
                </div>

                <div className="achievement-content">
                  <div className="achievement-date">
                    <Calendar size={14} />
                    <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-issuer">{achievement.issuer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Zoomed Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedAchievement(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-layout">
                <div className="modal-image-area">
                  <img src={selectedAchievement.image} alt={selectedAchievement.title} />
                </div>
                <div className="modal-details-area">
                  <div className="modal-badge">Achievement</div>
                  <h2>{selectedAchievement.title}</h2>
                  <div className="issuer-row">
                    <Award size={18} />
                    <span>{selectedAchievement.issuer}</span>
                  </div>
                  <div className="date-row">
                    <Calendar size={18} />
                    <span>{new Date(selectedAchievement.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="modal-description">
                    <h3>About this Milestone</h3>
                    <p>{selectedAchievement.description || 'No detailed description provided for this achievement.'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import defaultShamImg from '../../assets/sham-hero.jpg';
import './Hero.css';

interface Settings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  position: string;
  heroImage: string;
  bio: string;
}

const Hero: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const heroData = settings || {
    siteName: 'Sham',
    heroTitle: 'Crafting Digital Universes at ShamVerse',
    heroSubtitle: 'Full-Stack Developer',
    position: 'AI Engineer',
    heroImage: '',
    bio: 'Professional full-stack developer specializing in building high-performance, visually stunning web applications.'
  };

  return (
    <section className="hero-section">
      <div className="hero-glow"></div>
      <div className="container hero-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-subtitle"
          >
            Hello, I am {heroData.siteName}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="hero-position-text"
          >
            {heroData.position}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hero-title"
          >
            {heroData.heroTitle}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="hero-description"
          >
            {heroData.bio}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="hero-btns"
          >
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-outline">Hire Me</a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="hero-visual"
        >
          <div className="visual-circle"></div>
          <div className="visual-inner">
             <div className="personal-img-wrapper">
               <img src={heroData.heroImage || defaultShamImg} alt="Sham" />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';
import api from '../../services/api';
import './Footer.css';

interface Settings {
  siteName: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'ShamVerse',
    socialLinks: {}
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings for footer:', err);
      }
    };
    fetchSettings();
  }, []);

  const socialLinks = [
    { icon: <FaGithub size={20} />, url: settings.socialLinks.github || 'https://github.com/shamyt9' },
    { icon: <FaLinkedin size={20} />, url: settings.socialLinks.linkedin || 'https://www.linkedin.com/in/shamshad-ali-436917377/' },
    { icon: <FaInstagram size={20} />, url: settings.socialLinks.instagram || 'https://www.instagram.com/eduexpress98/' },
    { icon: <FaYoutube size={20} />, url: settings.socialLinks.youtube || 'https://youtube.com/' },
  ];

  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>&copy; {new Date().getFullYear()} <span className="accent-text">{settings.siteName}</span>. All rights reserved.</p>
        <div className="social-links">
          {socialLinks.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

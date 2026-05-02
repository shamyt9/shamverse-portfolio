import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';
import api from '../../services/api';
import logoImg from '../../assets/logo-photo.jpg';
import './Navbar.css';

interface Settings {
    siteName: string;
    logo: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
    };
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        siteName: 'ShamVerse',
        logo: '',
        socialLinks: {},
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                if (data) {
                    setSettings(data);
                }
            } catch (err) {
                console.error('Error fetching settings for navbar:', err);
            }
        };
        window.addEventListener('scroll', handleScroll);
        fetchSettings();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Achievements', path: '/achievements' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'Skills', path: '#skills' },
        { name: 'Contact', path: '#contact' },
    ];

    const socialLinks = [
        {
            icon: <FaGithub size={20} />,
            url: settings.socialLinks.github || 'https://github.com/shamyt9',
        },
        {
            icon: <FaLinkedin size={20} />,
            url:
                settings.socialLinks.linkedin ||
                'https://www.linkedin.com/in/shamshad-ali-436917377/',
        },
        {
            icon: <FaInstagram size={20} />,
            url:
                settings.socialLinks.instagram ||
                'https://www.instagram.com/eduexpress98/',
        },
        {
            icon: <FaYoutube size={20} />,
            url: settings.socialLinks.youtube || 'https://youtube.com/',
        },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo-container">
                    <div className="logo-photo">
                        <img
                            src={settings.logo || logoImg}
                            alt={settings.siteName}
                        />
                    </div>
                    <span className="logo-text glow-text">
                        {settings.siteName}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="desktop-nav-content">
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                {link.path.startsWith('#') ? (
                                    <a href={link.path} className="nav-item">
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link to={link.path} className="nav-item">
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="nav-socials">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-social-icon"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="nav-actions">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mobile-nav"
                    >
                        {navLinks.map((link) =>
                            link.path.startsWith('#') ? (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="mobile-nav-item"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="mobile-nav-item"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ),
                        )}

                        <div className="mobile-socials">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mobile-social-icon"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import './Contact.css';

interface Settings {
  contact: {
    email?: string;
    whatsapp?: string;
    phone?: string;
    location?: string;
  };
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings for contact:', err);
      }
    };
    fetchSettings();
  }, []);

  const contactData = settings?.contact || {
    email: 'mrsham456sa@gmail.com',
    whatsapp: '918004230656',
    phone: '+91 8840385022',
    location: 'Uttar Pradesh, India'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // 1. Save to Database
      await api.post('/inquiries', formData);
      
      setStatus('success');
      
      // 2. Redirect to WhatsApp
      const whatsappNumber = contactData.whatsapp?.replace(/[^0-9]/g, '') || "918004230656";
      const text = `Hello ShamVerse! %0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;
      
      // Small delay to show success state before redirect
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setStatus('idle');
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Get In <span className="highlight">Touch</span></h2>
          <p className="section-subtitle">Have a project in mind? Let's discuss it over WhatsApp or Email.</p>
        </motion.div>

        <div className="contact-container">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            {contactData.email && (
              <div className="info-item">
                <div className="info-icon"><Mail size={24} /></div>
                <div>
                  <h3>Email</h3>
                  <p>{contactData.email}</p>
                </div>
              </div>
            )}
            {contactData.phone && (
              <div className="info-item">
                <div className="info-icon"><Phone size={24} /></div>
                <div>
                  <h3>Call & WhatsApp</h3>
                  <p>{contactData.phone}</p>
                </div>
              </div>
            )}
            {contactData.whatsapp && (
              <div className="info-item">
                <div className="info-icon"><MessageCircle size={24} /></div>
                <div>
                  <h3>WhatsApp Only</h3>
                  <p>{contactData.whatsapp}</p>
                </div>
              </div>
            )}
            {contactData.location && (
              <div className="info-item">
                <div className="info-icon"><MapPin size={24} /></div>
                <div>
                  <h3>Location</h3>
                  <p>{contactData.location}</p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-form glow-card"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Your Name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="How can I help you?" 
                rows={5} 
                required 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Connecting...' : 'Send to WhatsApp'}
              <Send size={18} className="btn-icon" />
            </button>
            {status === 'success' && <p className="status-msg success">Message saved! Opening WhatsApp...</p>}
            {status === 'error' && <p className="status-msg error">Something went wrong. Please try again.</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

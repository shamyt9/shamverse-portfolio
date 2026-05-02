import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from './ImageUpload';
import './AdminForms.css';

interface Settings {
    _id?: string;
    siteName: string;
    heroTitle: string;
    heroSubtitle: string;
    position: string;
    logo: string;
    heroImage: string;
    bio: string;
    contact: {
        email?: string;
        whatsapp?: string;
        phone?: string;
        location?: string;
    };
    socialLinks: {
        github?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
    };
}

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [formData, setFormData] = useState<Settings>({
        siteName: 'ShamVerse',
        heroTitle: '',
        heroSubtitle: '',
        position: 'AI Engineer',
        logo: '',
        heroImage: '',
        bio: '',
        contact: {},
        socialLinks: {},
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            if (data) {
                setSettings(data);
                setFormData(data);
            }
        } catch (err: any) {
            console.log('No settings found, using defaults');
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            contact: {
                ...formData.contact,
                [name]: value,
            },
        });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            socialLinks: {
                ...formData.socialLinks,
                [name]: value,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (settings?._id) {
                await api.put(`/settings/${settings._id}`, formData);
            } else {
                await api.post('/settings', formData);
            }
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchSettings();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Site Settings</h3>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}
            {success && <div className="success-banner">{success}</div>}

            <form onSubmit={handleSubmit} className="settings-form glow-card">
                <div className="settings-group">
                    <h4>Site Information</h4>
                    <div className="form-row">
                        <input
                            type="text"
                            name="siteName"
                            placeholder="Site Name"
                            value={formData.siteName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <ImageUpload
                        value={formData.logo}
                        onChange={(url) =>
                            setFormData({ ...formData, logo: url })
                        }
                        label="Site Logo"
                        required={false}
                    />
                </div>

                <div className="settings-group">
                    <h4>Hero Section</h4>
                    <input
                        type="text"
                        name="position"
                        placeholder="Your Position (e.g. AI Engineer)"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="heroTitle"
                        placeholder="Hero Title"
                        value={formData.heroTitle}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="heroSubtitle"
                        placeholder="Hero Subtitle"
                        value={formData.heroSubtitle}
                        onChange={handleInputChange}
                        required
                    />
                    <ImageUpload
                        value={formData.heroImage}
                        onChange={(url) =>
                            setFormData({ ...formData, heroImage: url })
                        }
                        label="Hero Banner Image"
                        required={false}
                    />
                </div>

                <div className="settings-group">
                    <h4>Bio</h4>
                    <textarea
                        name="bio"
                        placeholder="Your bio / about section"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={5}
                        required
                    />
                </div>

                <div className="settings-group">
                    <h4>Contact Information</h4>
                    <div className="social-inputs">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.contact?.email || ''}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="WhatsApp Number"
                            value={formData.contact?.whatsapp || ''}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.contact?.phone || ''}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location (City, Country)"
                            value={formData.contact?.location || ''}
                            onChange={handleContactChange}
                        />
                    </div>
                </div>

                <div className="settings-group">
                    <h4>Social Links</h4>
                    <div className="social-inputs">
                        <input
                            type="text"
                            name="github"
                            placeholder="GitHub URL"
                            value={formData.socialLinks?.github || ''}
                            onChange={handleSocialChange}
                        />
                        <input
                            type="text"
                            name="linkedin"
                            placeholder="LinkedIn URL"
                            value={formData.socialLinks?.linkedin || ''}
                            onChange={handleSocialChange}
                        />
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram URL"
                            value={formData.socialLinks?.instagram || ''}
                            onChange={handleSocialChange}
                        />
                        <input
                            type="text"
                            name="youtube"
                            placeholder="YouTube URL"
                            value={formData.socialLinks?.youtube || ''}
                            onChange={handleSocialChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        <Save size={18} />{' '}
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;

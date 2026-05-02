import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from './ImageUpload';
import './AdminForms.css';

interface Achievement {
    _id?: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description?: string;
}

const AdminAchievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [formData, setFormData] = useState<Achievement>({
        title: '',
        issuer: '',
        date: '',
        image: '',
        description: '',
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data } = await api.get('/achievements');
            setAchievements(data);
        } catch (err: any) {
            setError('Failed to fetch achievements');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editing) {
                await api.put(`/achievements/${editing}`, formData);
            } else {
                await api.post('/achievements', formData);
            }
            fetchAchievements();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving achievement');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (achievement: Achievement) => {
        setFormData(achievement);
        setEditing(achievement._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/achievements/${id}`);
            fetchAchievements();
        } catch (err) {
            setError('Failed to delete achievement');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            issuer: '',
            date: '',
            image: '',
            description: '',
        });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Manage Achievements</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} /> Add Achievement
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {showForm && (
                <div className="form-container glow-card">
                    <h4>
                        {editing ? 'Edit Achievement' : 'Add New Achievement'}
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="title"
                                placeholder="Achievement Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="issuer"
                                placeholder="Issuer/Organization"
                                value={formData.issuer}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                placeholder="Project Description / Achievement Details"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>

                        <ImageUpload
                            value={formData.image}
                            onChange={(url) =>
                                setFormData({ ...formData, image: url })
                            }
                            label="Achievement Image/Certificate"
                            required={true}
                        />

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Achievement'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="items-grid">
                {achievements.map((achievement) => (
                    <div key={achievement._id} className="item-card glow-card">
                        {achievement.image && (
                            <img
                                src={achievement.image}
                                alt={achievement.title}
                                className="item-image"
                            />
                        )}
                        <div className="item-content">
                            <h5>{achievement.title}</h5>
                            <p className="item-desc">{achievement.issuer}</p>
                            {achievement.description && (
                                <p className="item-details" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                    {achievement.description.substring(0, 60)}...
                                </p>
                            )}
                            <p className="item-date">
                                {new Date(
                                    achievement.date,
                                ).toLocaleDateString()}
                            </p>
                            <div className="item-actions">
                                <button
                                    className="btn-icon edit"
                                    onClick={() => handleEdit(achievement)}
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="btn-icon delete"
                                    onClick={() =>
                                        handleDelete(achievement._id || '')
                                    }
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAchievements;

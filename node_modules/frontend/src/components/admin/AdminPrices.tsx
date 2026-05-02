import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from './ImageUpload';
import './AdminForms.css';

interface Price {
    _id?: string;
    serviceName: string;
    price: string;
    features: string[];
    images: string[];
}

const AdminPrices: React.FC = () => {
    const [prices, setPrices] = useState<Price[]>([]);
    const [formData, setFormData] = useState<Price>({
        serviceName: '',
        price: '',
        features: [],
        images: [],
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const { data } = await api.get('/prices');
            setPrices(data);
        } catch (err: any) {
            setError('Failed to fetch prices');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const addFeature = () => {
        if (newFeature.trim() && !formData.features.includes(newFeature)) {
            setFormData({
                ...formData,
                features: [...formData.features, newFeature],
            });
            setNewFeature('');
        }
    };

    const removeFeature = (feature: string) => {
        setFormData({
            ...formData,
            features: formData.features.filter((f) => f !== feature),
        });
    };

    const handleImageChange = (url: string) => {
        if (formData.images.length < 3) {
            setFormData({
                ...formData,
                images: [...formData.images, url],
            });
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editing) {
                await api.put(`/prices/${editing}`, formData);
            } else {
                await api.post('/prices', formData);
            }
            fetchPrices();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving price');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (price: Price) => {
        setFormData({
            ...price,
            images: price.images || [],
        });
        setEditing(price._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/prices/${id}`);
            fetchPrices();
        } catch (err) {
            setError('Failed to delete price');
        }
    };

    const resetForm = () => {
        setFormData({
            serviceName: '',
            price: '',
            features: [],
            images: [],
        });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Manage Pricing</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} /> Add Service
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {showForm && (
                <div className="form-container glow-card">
                    <h4>{editing ? 'Edit Service' : 'Add New Service'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="serviceName"
                                placeholder="Service Name"
                                value={formData.serviceName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="price"
                                placeholder="Price (e.g., $99/month)"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Image Uploads */}
                        <div className="form-group">
                            <label>Service Images (Max 3)</label>
                            <div className="image-previews-grid" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="preview-item" style={{ position: 'relative' }}>
                                        <img src={img} alt={`Preview ${idx}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(idx)}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', borderRadius: '50%', color: 'white', padding: '2px' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {formData.images.length < 3 && (
                                <ImageUpload
                                    value=""
                                    onChange={handleImageChange}
                                    label="Add Image"
                                />
                            )}
                        </div>

                        <div className="tag-input">
                            <input
                                type="text"
                                placeholder="Add feature"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' &&
                                    (e.preventDefault(), addFeature())
                                }
                            />
                            <button type="button" onClick={addFeature}>
                                Add Feature
                            </button>
                        </div>

                        {formData.features.length > 0 && (
                            <div className="features-list">
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} className="feature-item">
                                        <span>✓ {feature}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFeature(feature)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Service'}
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

            <div className="prices-grid">
                {prices.map((price) => (
                    <div key={price._id} className="price-card glow-card">
                        {price.images && price.images.length > 0 && (
                            <img src={price.images[0]} alt={price.serviceName} className="item-image" />
                        )}
                        <h5>{price.serviceName}</h5>
                        <div className="price-amount">{price.price}</div>
                        <ul className="features-list">
                            {price.features.map((feature, idx) => (
                                <li key={idx}>✓ {feature}</li>
                            ))}
                        </ul>
                        <div className="item-actions">
                            <button
                                className="btn-icon edit"
                                onClick={() => handleEdit(price)}
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                className="btn-icon delete"
                                onClick={() => handleDelete(price._id || '')}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPrices;

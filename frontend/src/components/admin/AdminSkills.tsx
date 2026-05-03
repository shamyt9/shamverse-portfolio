import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from './ImageUpload';
import './AdminForms.css';

interface Skill {
    _id?: string;
    name: string;
    category: string;
    level: number;
    image?: string;
}

const AdminSkills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [formData, setFormData] = useState<Skill>({
        name: '',
        category: '',
        level: 50,
        image: '',
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const categories = [
        'Frontend',
        'Backend',
        'DevOps',
        'Tools',
        'Databases',
        'AI / Machine Learning',
        'Other',
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data } = await api.get('/skills');
            setSkills(data);
        } catch (err: any) {
            setError('Failed to fetch skills');
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'level' ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editing) {
                await api.put(`/skills/${editing}`, formData);
            } else {
                await api.post('/skills', formData);
            }
            fetchSkills();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving skill');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setFormData(skill);
        setEditing(skill._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/skills/${id}`);
            fetchSkills();
        } catch (err) {
            setError('Failed to delete skill');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            level: 50,
            image: '',
        });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Manage Skills</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} /> Add Skill
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {showForm && (
                <div className="form-container glow-card">
                    <h4>{editing ? 'Edit Skill' : 'Add New Skill'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="Skill Name (e.g., React, TypeScript)"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Proficiency Level: {formData.level}%</label>
                            <input
                                type="range"
                                name="level"
                                min="0"
                                max="100"
                                value={formData.level}
                                onChange={handleInputChange}
                            />
                        </div>

                        <ImageUpload
                            value={formData.image || ''}
                            onChange={(url) =>
                                setFormData({ ...formData, image: url })
                            }
                            label="Skill Logo (Optional)"
                            required={false}
                        />

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Skill'}
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

            <div className="skills-grid">
                {skills.map((skill) => (
                    <div key={skill._id} className="skill-card glow-card">
                        <div className="skill-header">
                            {skill.image && (
                                <img
                                    src={skill.image}
                                    alt={skill.name}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        objectFit: 'contain',
                                        marginRight: '10px',
                                    }}
                                />
                            )}
                            <h5>{skill.name}</h5>
                            <span className="category-badge">
                                {skill.category}
                            </span>
                        </div>
                        <div className="skill-level">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>
                            <span className="level-text">{skill.level}%</span>
                        </div>
                        <div className="item-actions">
                            <button
                                className="btn-icon edit"
                                onClick={() => handleEdit(skill)}
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                className="btn-icon delete"
                                onClick={() => handleDelete(skill._id || '')}
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

export default AdminSkills;

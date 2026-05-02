import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from './ImageUpload';
import './AdminForms.css';

interface Project {
    _id?: string;
    title: string;
    description: string;
    image: string;
    liveLink: string;
    githubLink: string;
    tags: string[];
    featured: boolean;
    category: 'web' | 'android' | 'software' | 'ml' | 'ai' | 'other';
}

const AdminProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState<Project>({
        title: '',
        description: '',
        image: '',
        liveLink: '',
        githubLink: '',
        tags: [],
        featured: false,
        category: 'web',
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch (err: any) {
            setError('Failed to fetch projects');
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target as any;
        setFormData({
            ...formData,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value,
        });
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag],
            });
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editing) {
                await api.put(`/projects/${editing}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            fetchProjects();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving project');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setFormData(project);
        setEditing(project._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: '',
            liveLink: '',
            githubLink: '',
            tags: [],
            featured: false,
            category: 'web',
        });
        setEditing(null);
        setShowForm(false);
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Manage Projects</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} /> Add Project
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {showForm && (
                <div className="form-container glow-card">
                    <h4>{editing ? 'Edit Project' : 'Add New Project'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="title"
                                placeholder="Project Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="web">Web Project</option>
                                <option value="android">Android App</option>
                                <option value="software">Software</option>
                                <option value="ml">ML Project</option>
                                <option value="ai">AI Project</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <ImageUpload
                            value={formData.image}
                            onChange={(url) =>
                                setFormData({ ...formData, image: url })
                            }
                            label="Project Image"
                            required={true}
                        />

                        <textarea
                            name="description"
                            placeholder="Project Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            required
                        />

                        <div className="form-row">
                            <input
                                type="text"
                                name="liveLink"
                                placeholder="Live Link"
                                value={formData.liveLink}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="githubLink"
                                placeholder="GitHub Link"
                                value={formData.githubLink}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="tag-input">
                            <input
                                type="text"
                                placeholder="Add tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' &&
                                    (e.preventDefault(), addTag())
                                }
                            />
                            <button type="button" onClick={addTag}>
                                Add Tag
                            </button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="tags-list">
                                {formData.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}{' '}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                />
                                Featured Project
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Project'}
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
                {projects.map((project) => (
                    <div key={project._id} className="item-card glow-card">
                        {project.image && (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="item-image"
                            />
                        )}
                        <div className="item-content">
                            <h5>{project.title}</h5>
                            <p className="item-desc">
                                {project.description.substring(0, 60)}...
                            </p>
                            {project.featured && (
                                <span className="badge featured">Featured</span>
                            )}
                            <div className="item-actions">
                                <button
                                    className="btn-icon edit"
                                    onClick={() => handleEdit(project)}
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="btn-icon delete"
                                    onClick={() =>
                                        handleDelete(project._id || '')
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

export default AdminProjects;

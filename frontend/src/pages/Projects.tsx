import { useState, useEffect } from 'react';
import { Search, ExternalLink, Code } from 'lucide-react';
import api from '../services/api';
import './Projects.css';

interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    liveLink: string;
    githubLink: string;
    tags: string[];
    category: 'web' | 'android' | 'software' | 'ml' | 'ai' | 'other';
    featured: boolean;
}

type CategoryType =
    | 'all'
    | 'web'
    | 'android'
    | 'software'
    | 'ml'
    | 'ai'
    | 'other';

const categoryLabels: Record<CategoryType, string> = {
    all: 'All Projects',
    web: 'Web Projects',
    android: 'Android Apps',
    software: 'Software',
    ml: 'ML Projects',
    ai: 'AI Projects',
    other: 'Other',
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all projects
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get('/projects');
            setProjects(response.data);
            setFilteredProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle filtering and searching
    useEffect(() => {
        let filtered = projects;

        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter((p) => p.category === activeCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    p.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase()),
                    ),
            );
        }

        setFilteredProjects(filtered);
    }, [activeCategory, searchTerm, projects]);

    const categories: CategoryType[] = [
        'all',
        'web',
        'android',
        'software',
        'ml',
        'ai',
        'other',
    ];

    return (
        <div className="projects-page">
            {/* Header */}
            <div className="projects-header">
                <div className="projects-hero">
                    <h1>My Projects</h1>
                    <p>
                        Explore a collection of my recent work and digital
                        experiments
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                <div className="filter-label">Filter by category:</div>
                <div className="filter-buttons">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {categoryLabels[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="projects-container">
                {loading ? (
                    <div className="loading">Loading projects...</div>
                ) : filteredProjects.length > 0 ? (
                    <div className="projects-grid">
                        {filteredProjects.map((project) => (
                            <div key={project._id} className="project-card">
                                <div className="project-image">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                    />
                                    <div className="project-overlay">
                                        <div className="project-links">
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-btn"
                                                >
                                                    <ExternalLink size={20} />
                                                    <span>Live Demo</span>
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-btn"
                                                >
                                                    <Code size={20} />
                                                    <span>GitHub</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="project-content">
                                    <div className="project-category">
                                        {categoryLabels[project.category]}
                                    </div>
                                    <h3 className="project-title">
                                        {project.title}
                                    </h3>
                                    <p className="project-description">
                                        {project.description}
                                    </p>

                                    {project.tags.length > 0 && (
                                        <div className="project-tags">
                                            {project.tags.map((tag, idx) => (
                                                <span key={idx} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {project.featured && (
                                        <div className="featured-badge">
                                            ⭐ Featured
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-projects">
                        <p>No projects found matching your criteria.</p>
                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSearchTerm('');
                                setActiveCategory('all');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="projects-summary">
                <p>
                    {filteredProjects.length} project
                    {filteredProjects.length !== 1 ? 's' : ''} found
                </p>
            </div>
        </div>
    );
}

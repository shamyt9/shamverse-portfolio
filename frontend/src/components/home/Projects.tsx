import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Projects.css';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  liveLink: string;
  githubLink: string;
  tags: string[];
}

interface ProjectsProps {
  featuredOnly?: boolean;
  limit?: number;
}

const Projects: React.FC<ProjectsProps> = ({ featuredOnly = false, limit = undefined }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Featured <span className="highlight">Projects</span></h2>
          <p className="section-subtitle">A collection of my recent work and digital experiments.</p>
        </motion.div>

        <div className="projects-grid">
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            displayedProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="project-card glow-card"
              >
                <div className="project-img">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-links">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="link-icon">Code</a>
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="link-icon">Live</a>
                    </div>
                  </div>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {featuredOnly && limit && projects.length > limit && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="see-more-container"
          >
            <button 
              className="see-more-btn"
              onClick={() => navigate('/projects')}
            >
              See More Projects
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;

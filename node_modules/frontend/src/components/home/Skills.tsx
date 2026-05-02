import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import './Skills.css';

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  image?: string;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get('/skills');
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="section-padding bg-darker">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Technical <span className="highlight">Skills</span></h2>
          <p className="section-subtitle">The tools and technologies I use to bring ideas to life.</p>
        </motion.div>

        <div className="skills-container">
          {loading ? (
            <p>Loading skills...</p>
          ) : (
            categories.map((cat, idx) => (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="skill-category-box"
              >
                <h3 className="category-title">{cat}</h3>
                <div className="skills-list">
                  {skills.filter(s => s.category === cat).map(skill => (
                    <div key={skill._id} className="skill-item">
                      <div className="skill-info">
                        <div className="skill-name-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {skill.image && (
                            <img src={skill.image} alt={skill.name} className="skill-logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                          )}
                          <span>{skill.name}</span>
                        </div>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="skill-progress"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;

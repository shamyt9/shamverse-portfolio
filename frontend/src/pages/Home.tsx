import React from 'react';
import Hero from '../components/home/Hero';
import Projects from '../components/home/Projects';
import Skills from '../components/home/Skills';
import ReviewSlider from '../components/home/ReviewSlider';
import ReviewForm from '../components/ReviewForm';
import Contact from '../components/home/Contact';
import { Helmet } from 'react-helmet-async';
import './Home.css';

const Home: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>ShamVerse | Full-Stack Developer Portfolio</title>
                <meta
                    name="description"
                    content="Portfolio of Sham, a professional full-stack developer specializing in React, Node.js, and MongoDB with stunning UI/UX animations."
                />
            </Helmet>
            <Hero />
            <Projects />
            <Skills />
            <ReviewSlider />
            <section className="review-form-section">
                <div className="section-container">
                    <ReviewForm />
                </div>
            </section>
            <Contact />
        </>
    );
};

export default Home;

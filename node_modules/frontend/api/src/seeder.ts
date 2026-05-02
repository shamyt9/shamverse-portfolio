import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project';
import Skill from './models/Skill';
import User from './models/User';
import Settings from './models/Settings';
import connectDB from './config/db';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Optional: Clear existing projects and skills if you want a fresh start
    // await Project.deleteMany();
    // await Skill.deleteMany();

    // Create Admin User if not exists
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const existingAdmin = await User.findOne({ username: adminUsername });
    
    if (!existingAdmin) {
      const adminUser = new User({
        username: adminUsername,
        password: process.env.ADMIN_PASSWORD || 'password123',
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists, skipping...');
    }

    // Create Site Settings if not exists
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        siteName: 'ShamVerse',
        heroTitle: 'Crafting Digital Universes at ShamVerse',
        heroSubtitle: 'Full-Stack Developer',
        position: 'AI Engineer',
        bio: 'Professional full-stack developer specializing in building high-performance, visually stunning web applications.',
        socialLinks: {
          github: 'https://github.com/shamyt9',
          linkedin: 'https://www.linkedin.com/in/shamshad-ali-436917377/',
          instagram: 'https://www.instagram.com/eduexpress98/',
          youtube: 'https://youtube.com/'
        }
      });
      console.log('Site settings created');
    } else {
      console.log('Site settings already exist, skipping...');
    }

    // Seed Skills if not exists
    const existingSkillsCount = await Skill.countDocuments();
    if (existingSkillsCount === 0) {
      const skills = [
        { name: 'React', category: 'Frontend', level: 95 },
        { name: 'TypeScript', category: 'Frontend', level: 90 },
        { name: 'Node.js', category: 'Backend', level: 85 },
        { name: 'MongoDB', category: 'Database', level: 80 },
        { name: 'Framer Motion', category: 'Animation', level: 90 },
      ];
      await Skill.insertMany(skills);
      console.log('Skills seeded');
    }

    // Seed Projects if not exists
    const existingProjectsCount = await Project.countDocuments();
    if (existingProjectsCount === 0) {
      const projects = [
        {
          title: 'ShamVerse Portfolio',
          description: 'A full-stack developer portfolio with a custom dark maroon theme and advanced animations.',
          image: 'https://via.placeholder.com/600x400',
          liveLink: 'https://shamverse.com',
          githubLink: 'https://github.com/sham/shamverse',
          tags: ['React', 'Node.js', 'MongoDB', 'Framer Motion'],
          featured: true,
        },
        {
          title: 'E-Commerce Universe',
          description: 'A high-performance e-commerce platform with real-time inventory management.',
          image: 'https://via.placeholder.com/600x400',
          liveLink: 'https://shop.shamverse.com',
          githubLink: 'https://github.com/sham/ecommerce',
          tags: ['Next.js', 'Stripe', 'Tailwind'],
          featured: false,
        }
      ];
      await Project.insertMany(projects);
      console.log('Projects seeded');
    }

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

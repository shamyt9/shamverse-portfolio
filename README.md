# ShamVerse Developer Portfolio - Technical Overview

## 1. Project Goal
Delivered a high-end, full-stack developer portfolio for "Sham" (ShamVerse) with a "Dark Maroon" theme, advanced animations, and a secure content management system.

## 2. Key Features
- **Dynamic Portfolio**: Projects, Skills, and Contact sections powered by a MongoDB API.
- **Dark Maroon Aesthetic**: Deep wine backgrounds (#1A0505) with gold highlights and glow effects.
- **Advanced Animations**: Powered by Framer Motion for smooth transitions and staggered reveals.
- **Secure Admin Dashboard**: JWT-based authentication to manage all site content.
- **Cloudinary Integration**: For high-performance media management and image uploads.
- **SEO Optimized**: Semantic HTML, meta tags via React Helmet, and fast loading times.
- **Functional Contact Form**: Direct integration with the backend to capture user inquiries.

## 3. Tech Stack
- **Frontend**: React (Vite), TypeScript, Framer Motion, Axios, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
- **Storage**: Cloudinary (Image uploads).
- **Environment**: Dotenv for secure configuration.

## 4. Getting Started
1. **Backend**:
   - `cd backend`
   - `npm install`
   - `npm run dev` (Starts server on port 5000)
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Starts client on port 5173)
3. **Seeding**:
   - Run `npx ts-node src/seeder.ts` in the `backend` directory to populate initial data.

## 5. Directory Structure
- `/backend`: Express API, Mongoose Models, Controllers, Routes.
- `/frontend`: React application, Components, Pages, Context, Services.

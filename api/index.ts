import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../frontend/api/dist/app';
import connectDB from '../frontend/api/dist/config/db';
import dotenv from 'dotenv';

dotenv.config();

// Initialize database connection once
let dbConnectionPromise: Promise<void> | null = null;

async function initializeDB() {
    if (!dbConnectionPromise) {
        dbConnectionPromise = connectDB().catch((error) => {
            console.error('Database connection failed:', error.message);
        });
    }
    return dbConnectionPromise;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    // Initialize database on first request
    try {
        await initializeDB();
    } catch (error) {
        console.error('DB initialization error:', error);
    }

    // Handle the request through Express
    return app(req, res);
};

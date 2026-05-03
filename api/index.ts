import { VercelRequest, VercelResponse } from '@vercel/node';

const app = require('../frontend/api/dist/app').default;
const connectDB = require('../frontend/api/dist/config/db').default;

// Initialize database connection once
let dbConnected = false;

export default async (req: VercelRequest, res: VercelResponse) => {
    // Initialize database on first request
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('DB initialization error:', error);
            // Continue anyway - app might still work
        }
    }

    // Handle the request through Express app
    return new Promise((resolve) => {
        app(req, res);
        // Give some time for response to be sent
        setTimeout(() => resolve(undefined), 100);
    });
};

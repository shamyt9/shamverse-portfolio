const app = require('../frontend/api/dist/app').default;
const connectDB = require('../frontend/api/dist/config/db').default;

// Initialize database connection once
let dbInitialized = false;

module.exports = async (req, res) => {
    try {
        // Initialize database on first request only
        if (!dbInitialized) {
            dbInitialized = true;
            try {
                console.log('[API] Attempting database connection...');
                await connectDB();
                console.log('[API] Database connected successfully');
            } catch (dbError) {
                console.warn(
                    '[API] Database connection failed:',
                    dbError.message,
                );
                console.log('[API] Continuing without database...');
                // Don't throw - let app handle missing DB gracefully
            }
        }

        // Pass request to Express app
        app(req, res);
    } catch (error) {
        console.error('[API] Error handling request:', error.message);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }
};

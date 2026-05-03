const app = require('../frontend/api/dist/app').default;
const connectDB = require('../frontend/api/dist/config/db').default;

// Initialize database connection once
let dbConnected = false;

module.exports = async (req, res) => {
    try {
        // Initialize database on first request
        if (!dbConnected) {
            try {
                await connectDB();
                dbConnected = true;
                console.log('[API Handler] Database connected');
            } catch (error) {
                console.error(
                    '[API Handler] DB initialization error:',
                    error.message,
                );
                // Continue anyway - app might still work
            }
        }

        // Handle the request through Express app
        app(req, res);
    } catch (error) {
        console.error('[API Handler] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

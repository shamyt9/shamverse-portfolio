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
                const dbResult = await connectDB();
                console.log('[API] Database connected successfully');
            } catch (dbError) {
                console.error('[API] Database connection error:', {
                    message: dbError.message,
                    code: dbError.code,
                    name: dbError.name,
                });
                // Still mark as initialized even if failed to prevent repeated attempts
            }
        }

        // Wrap Express app handling in a promise
        return new Promise((resolve) => {
            // Timeout to ensure response is sent
            const timeout = setTimeout(() => {
                console.warn('[API] Request handler timeout');
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Request timeout' });
                }
                resolve();
            }, 28000); // 28 second timeout (Vercel max is 30)

            // Handle response completion
            const finishHandler = () => {
                clearTimeout(timeout);
                console.log('[API] Response completed:', res.statusCode);
                resolve();
            };

            res.once('finish', finishHandler);
            res.once('close', finishHandler);

            // Handle any errors
            res.on('error', (error) => {
                clearTimeout(timeout);
                console.error('[API] Response error:', error.message);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Internal server error' });
                }
                resolve();
            });

            // Invoke Express app
            try {
                app(req, res);
            } catch (error) {
                clearTimeout(timeout);
                console.error('[API] Express handler error:', error.message);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Internal server error',
                        details: error.message,
                    });
                }
                resolve();
            }
        });
    } catch (error) {
        console.error('[API] Unexpected error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
                details: error.message,
            });
        }
    }
};

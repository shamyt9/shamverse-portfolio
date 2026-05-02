import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log('\n========== SERVER STARTUP ==========');
console.log('[SERVER] Initializing...');
console.log('[SERVER] PORT:', PORT);
console.log('[SERVER] NODE_ENV:', process.env.NODE_ENV || 'development');

// Connect to Database
console.log('[SERVER] Connecting to database...');
connectDB()
    .then(() => {
        console.log('[SERVER] ✅ Database connected');
        app.listen(PORT, () => {
            console.log(`[SERVER] ✅ Server running on port ${PORT}`);
            console.log('[SERVER] ========== SERVER READY ==========\n');
        });
    })
    .catch((error) => {
        console.error('[SERVER] ❌ Database connection failed:', error.message);
        console.log('[SERVER] ⚠️  Starting server without database...');
        app.listen(PORT, () => {
            console.log(
                `[SERVER] ✅ Server running on port ${PORT} (database offline)`,
            );
            console.log(
                '[SERVER] ========== SERVER READY (NO DB) ==========\n',
            );
        });
    });

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('[SERVER] ❌ Unhandled Rejection:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('[SERVER] ❌ Uncaught Exception:', error.message);
});

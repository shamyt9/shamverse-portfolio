import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    }),
);

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('ShamVerse API is running...');
});

// 404 handler
app.use((req, res) => {
    console.log('[APP] 404 - Route not found:', req.method, req.path);
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler (must be last)
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        console.error('[APP] 🔴 ERROR CAUGHT:', {
            message: err.message,
            code: err.code,
            statusCode: err.statusCode || err.status,
            path: req.path,
            method: req.method,
            firstStackLine: err.stack?.split('\n')[0] || 'No stack',
        });

        // Check if response already sent
        if (res.headersSent) {
            console.warn(
                '[APP] ⚠️  Headers already sent, cannot send error response',
            );
            return;
        }

        res.status(err.status || err.statusCode || 500).json({
            message: err.message || 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? err.message
                    : undefined,
        });
    },
);

export default app;

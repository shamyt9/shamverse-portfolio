import express, { Request, Response } from 'express';
import { upload } from '../config/cloudinary';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Verify JWT token
const verifyToken = (req: any, res: Response, next: Function) => {
    console.log('[AUTH] Verifying token...');
    try {
        const authHeader = req.headers.authorization;
        console.log(
            '[AUTH] Authorization header:',
            authHeader ? 'present' : 'missing',
        );

        const token = authHeader?.split(' ')[1];

        if (!token) {
            console.warn('[AUTH] ❌ No token found in authorization header');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('[AUTH] Token found, verifying...');
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret',
        ) as any;

        req.userId = decoded.id;
        console.log(
            '[AUTH] ✅ Token verified successfully for user:',
            decoded.id,
        );
        next();
    } catch (error: any) {
        console.error('[AUTH] ❌ Token verification failed:', {
            error: error.message,
            name: error.name,
        });
        return res
            .status(401)
            .json({ message: 'Invalid token', error: error.message });
    }
};

// Upload endpoint with detailed logging
router.post('/', verifyToken, (req: any, res: Response) => {
    console.log('\n========== UPLOAD REQUEST START ==========');
    console.log('[UPLOAD] Request received at:', new Date().toISOString());
    console.log('[UPLOAD] User ID:', req.userId);
    console.log('[UPLOAD] Content-Type:', req.headers['content-type']);

    try {
        console.log('[UPLOAD] Calling upload.single("image")...');

        upload.single('image')(req, res, (err: any) => {
            console.log('[UPLOAD] Multer callback executed');

            try {
                // Log all request properties
                console.log('[UPLOAD] req.file exists:', !!req.file);
                if (req.file) {
                    console.log('[UPLOAD] File details:', {
                        fieldname: req.file.fieldname,
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        destination: req.file.destination,
                        filename: req.file.filename,
                        path: req.file.path,
                    });
                }

                // Handle multer errors
                if (err) {
                    console.error('[UPLOAD] ❌ Multer error occurred:', {
                        message: err.message,
                        code: err.code,
                        statusCode: err.statusCode,
                        name: err.name,
                        stack: err.stack?.split('\n')[0],
                    });
                    return res.status(400).json({
                        message: err.message || 'Upload failed',
                        error: err.code || 'UNKNOWN_ERROR',
                    });
                }

                // Check if file exists
                if (!req.file) {
                    console.warn(
                        '[UPLOAD] ❌ No file in request after multer processing',
                    );
                    return res
                        .status(400)
                        .json({ message: 'No file uploaded' });
                }

                // Success
                console.log('[UPLOAD] ✅ File uploaded successfully');
                console.log('[UPLOAD] File URL:', req.file.path);
                console.log(
                    '[UPLOAD] ========== UPLOAD REQUEST END ==========\n',
                );

                res.json({ url: req.file.path });
            } catch (innerError: any) {
                console.error('[UPLOAD] ❌ Error in multer callback:', {
                    message: innerError.message,
                    name: innerError.name,
                    stack: innerError.stack?.split('\n')[0],
                });
                console.log(
                    '[UPLOAD] ========== UPLOAD REQUEST END (ERROR) ==========\n',
                );
                return res.status(500).json({
                    message: 'Error processing upload',
                    error: innerError.message,
                });
            }
        });
    } catch (outerError: any) {
        console.error('[UPLOAD] ❌ Error calling upload.single:', {
            message: outerError.message,
            name: outerError.name,
            stack: outerError.stack?.split('\n')[0],
        });
        console.log(
            '[UPLOAD] ========== UPLOAD REQUEST END (OUTER ERROR) ==========\n',
        );
        return res.status(500).json({
            message: 'Upload handler error',
            error: outerError.message,
        });
    }
});

export default router;

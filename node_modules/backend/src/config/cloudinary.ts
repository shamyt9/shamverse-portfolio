import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

console.log('[CLOUDINARY] Initializing Cloudinary configuration...');

// Configure Cloudinary
try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('[CLOUDINARY] ✅ Configuration initialized');
} catch (error: any) {
    console.error('[CLOUDINARY] ❌ Configuration error:', error.message);
}

// Verify credentials exist
console.log('[CLOUDINARY] Checking credentials...');
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('[CLOUDINARY] Cloud Name:', cloudName ? '✅ set' : '❌ missing');
console.log('[CLOUDINARY] API Key:', apiKey ? '✅ set' : '❌ missing');
console.log('[CLOUDINARY] API Secret:', apiSecret ? '✅ set' : '❌ missing');

const hasCredentials = cloudName && apiKey && apiSecret;

if (!hasCredentials) {
    console.error('[CLOUDINARY] ⚠️  MISSING CREDENTIALS - Upload will fail!');
    if (!cloudName) console.error('  - CLOUDINARY_CLOUD_NAME is missing');
    if (!apiKey) console.error('  - CLOUDINARY_API_KEY is missing');
    if (!apiSecret) console.error('  - CLOUDINARY_API_SECRET is missing');
}

// Create storage with plain object params
console.log('[CLOUDINARY] Creating CloudinaryStorage...');
let storage: CloudinaryStorage;

try {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'shamverse',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            transformation: [{ width: 800, height: 800, crop: 'limit' }],
        } as any,
    });
    console.log('[CLOUDINARY] ✅ CloudinaryStorage created successfully');
} catch (error: any) {
    console.error(
        '[CLOUDINARY] ❌ Error creating CloudinaryStorage:',
        error.message,
    );
    throw error;
}

// Create multer instance
console.log('[CLOUDINARY] Creating multer instance...');
let upload: any;

try {
    upload = multer({
        storage: storage,
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB max
        },
    });
    console.log('[CLOUDINARY] ✅ Multer instance created successfully');
    console.log('[CLOUDINARY] ✅ Cloudinary fully initialized\n');
} catch (error: any) {
    console.error('[CLOUDINARY] ❌ Error creating multer:', error.message);
    throw error;
}

export { cloudinary, upload };

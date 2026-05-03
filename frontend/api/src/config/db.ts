import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('[DB] ❌ MONGODB_URI is not defined in .env');
        // In serverless environments, throw error instead of calling process.exit()
        const error = new Error(
            'MONGODB_URI environment variable is not defined',
        );
        throw error;
    }

    console.log('[DB] Attempting connection to MongoDB Atlas...');

    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('[DB] ✅ Connected successfully to MongoDB Atlas');
        return true;
    } catch (error: any) {
        console.error('[DB] ❌ Connection failed:', error.message);
        throw error;
    }
};

export default connectDB;

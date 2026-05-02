import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken {
    id: string;
}

export const protect = async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'secret',
            ) as DecodedToken;

            req.user = await User.findById(decoded.id).select('-password');
            next();
            return;
        } catch (error) {
            console.error('Token verification error:', error);
            return res
                .status(401)
                .json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(String(user._id)),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new admin (one-time or protected)
// @route   POST /api/auth/register
// @access  Private (or logic-based)
export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(String(user._id)),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

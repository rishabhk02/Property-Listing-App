import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/environment';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth';

const generateToken = (userId: string, email: string): string => {
    return jwt.sign(
        { userId, email },
        config.jwtSecret,
        { expiresIn: '1h' }
    );
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = generateToken(user._id.toString(), user.email);

        console.info(`New user registered: ${email}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'User registration failed'
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found.'
            });
            return;
        }

        // Password matching
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
            return;
        }

        const token = generateToken(user._id.toString(), user.email);

        console.info(`User logged in: ${email}`);

        res.json({
            success: true,
            message: 'Login successfull.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

export const findUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }

        const user = await User.findOne({ email }).select('name email');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found.'
            });
            return;
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Find user by email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};
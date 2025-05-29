"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const environment_1 = require("../config/environment");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, environment_1.config.jwtSecret, { expiresIn: '1h' });
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new User_1.User({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'User registration failed'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found.'
            });
            return;
        }
        // Password matching
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};
exports.getProfile = getProfile;
const findUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const user = await User_1.User.findOne({ email }).select('name email');
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
    }
    catch (error) {
        console.error('Find user by email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};
exports.findUserByEmail = findUserByEmail;
//# sourceMappingURL=authController.js.map
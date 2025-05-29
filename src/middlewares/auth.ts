import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/environment';

export interface AuthRequest extends Request {
  user?: any;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
      return;
    }

    const payload = jwt.verify(token, config.jwtSecret!) as JwtPayload;
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token or expired token.' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token or expired token' 
    });
  }
};
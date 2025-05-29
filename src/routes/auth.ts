import { Router } from 'express';
import { register, login, getProfile, findUserByEmail } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { apiLimiter } from '../middlewares/rateLimit';

const authRouter = Router();

authRouter.post('/register', apiLimiter, register);

authRouter.post('/login', apiLimiter, login);

authRouter.get('/profile', apiLimiter, authenticate, getProfile);

authRouter.get('/find-user', apiLimiter, authenticate, findUserByEmail);

export default authRouter;
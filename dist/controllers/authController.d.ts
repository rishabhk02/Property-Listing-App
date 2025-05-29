import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const findUserByEmail: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map
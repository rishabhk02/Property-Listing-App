import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const addToFavorites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removeFromFavorites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserFavorites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const checkFavoriteStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=favouriteController.d.ts.map
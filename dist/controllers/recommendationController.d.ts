import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const recommendProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getReceivedRecommendations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSentRecommendations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markRecommendationAsRead: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteRecommendation: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=recommendationController.d.ts.map
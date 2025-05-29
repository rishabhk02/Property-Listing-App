import { Router } from 'express';
import {
    recommendProperty,
    getReceivedRecommendations,
    getSentRecommendations,
    markRecommendationAsRead,
    deleteRecommendation
} from '../controllers/recommendationController';
import { authenticate } from '../middlewares/auth';
import { apiLimiter } from '../middlewares/rateLimit';

const recommendationRouter = Router();

recommendationRouter.post('/', apiLimiter, authenticate, recommendProperty);

recommendationRouter.get('/received', apiLimiter, authenticate, getReceivedRecommendations);

recommendationRouter.get('/sent', apiLimiter, authenticate, getSentRecommendations);

recommendationRouter.patch('/:id/read', apiLimiter, authenticate, markRecommendationAsRead);

recommendationRouter.delete('/:id', apiLimiter, authenticate, deleteRecommendation);

export default recommendationRouter;
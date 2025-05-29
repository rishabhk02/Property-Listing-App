import { Router } from 'express';
import { addToFavorites, removeFromFavorites, getUserFavorites, checkFavoriteStatus } from '../controllers/favouriteController';
import { authenticate } from '../middlewares/auth';
import { apiLimiter } from '../middlewares/rateLimit';

const favouriteRouter = Router();

favouriteRouter.get('/', apiLimiter, authenticate, getUserFavorites);

favouriteRouter.post('/:propertyId', apiLimiter, authenticate, addToFavorites);

favouriteRouter.delete('/:propertyId', apiLimiter, authenticate, removeFromFavorites);

favouriteRouter.get('/:propertyId/status', apiLimiter, authenticate, checkFavoriteStatus);

export default favouriteRouter;
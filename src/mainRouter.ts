import { Router } from 'express';
import authRouter from './routes/auth';
import propertyRouter from './routes/property';
import favouriteRouter from './routes/favourites';
import recommendationRouter from './routes/recommendations';

const mainRouter = Router();
mainRouter.use('/auth', authRouter);
mainRouter.use('/properties', propertyRouter);
mainRouter.use('/favourites', favouriteRouter);
mainRouter.use('/recommendations', recommendationRouter);

export default mainRouter;

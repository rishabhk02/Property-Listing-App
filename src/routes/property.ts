import { Router } from 'express';
import { importPropertiesFromExcel, createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty, getMyProperties } from '../controllers/propertyController';
import { authenticate } from '../middlewares/auth';
import { clearCache } from '../middlewares/cache';
import { apiLimiter } from '../middlewares/rateLimit';
import { uploadMultiple, uploadSingle } from '../config/multer';

const propertyRouter = Router();

propertyRouter.post('/import-excel', authenticate, uploadSingle, importPropertiesFromExcel);

propertyRouter.post('/', authenticate, apiLimiter, uploadMultiple, clearCache('cache:*properties*'), createProperty);

propertyRouter.get('/', apiLimiter, getAllProperties);

propertyRouter.get('/my', apiLimiter, authenticate, getMyProperties);

propertyRouter.get('/:id', apiLimiter, getPropertyById);

propertyRouter.put('/:id', apiLimiter, authenticate, uploadMultiple, clearCache('cache:*properties*'), updateProperty);

propertyRouter.delete('/:id', apiLimiter, authenticate, clearCache('cache:*properties*'), deleteProperty);

export default propertyRouter;
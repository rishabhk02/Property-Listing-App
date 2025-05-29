import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const importPropertiesFromExcel: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllProperties: (req: Request, res: Response) => Promise<void>;
export declare const getPropertyById: (req: Request, res: Response) => Promise<void>;
export declare const getMyProperties: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProperty: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=propertyController.d.ts.map
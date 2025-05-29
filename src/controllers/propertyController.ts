import xlsx from 'xlsx';
import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { AuthRequest } from '../middlewares/auth';
import { cacheService } from '../services/cacheService';
import { cloudinaryService } from '../services/cloudinaryService';


export const importPropertiesFromExcel = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length < 2) {
            return res.status(400).json({ success: false, message: 'Excel file must have at least one data row.' });
        }

        const dataRows = rows.slice(1);

        const properties = dataRows.map((row: any[]) => ({
            propertyId: row[0],
            title: row[1],
            type: row[2],
            price: Number(row[3]),
            state: row[4],
            city: row[5],
            areaSqFt: Number(row[6]),
            bedrooms: Number(row[7]),
            bathrooms: Number(row[8]),
            amenities: typeof row[9] === 'string' ? row[9].split('|').map((a: string) => a.trim()) : [],
            furnished: row[10] === 'true' || row[10] === true,
            availableFrom: new Date(row[11]),
            listedBy: row[12],
            tags: typeof row[13] === 'string' ? row[13].split(',').map((t: string) => t.trim()) : [],
            colorTheme: row[14] || '#000000',
            rating: Number(row[15]) || 0,
            isVerified: row[16] === 'true' || row[16] === true,
            listingType: row[17],
            images: [],
            createdBy: req.user._id,
        }));

        await Property.insertMany(properties);

        return res.json({
            success: true,
            message: 'Properties imported successfully',
            count: properties.length
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to import properties',
            error: error.message
        });
    }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const propertyData = {
            ...req.body,
            listedBy: req.user._id,
            createdBy: req.user._id
        };

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const imageUrls = await cloudinaryService.uploadMultipleImages(req.files);
            propertyData.images = imageUrls;
        }

        const property = new Property(propertyData);
        await property.save();

        await property.populate('listedBy', 'name email');

        await cacheService.invalidatePropertyCaches();

        console.info(`New property created: ${property._id} by user: ${req.user._id}`);

        res.status(201).json({ success: true, message: 'Property created successfully', data: { property } });
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ success: false, message: 'Failed to create property' });
    }
};

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, state, city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, furnished, amenities, listingType, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const filter: any = {};

        const caseInsensitive = (value: any) => {
            if (typeof value === 'string') return new RegExp(value, 'i');
            return value;
        };

        if (type) filter.type = caseInsensitive(type);
        if (state) filter.state = caseInsensitive(state);
        if (city) filter.city = caseInsensitive(city);
        if (listingType) filter.listingType = caseInsensitive(listingType);

        if (furnished !== undefined) filter.furnished = furnished === 'true';
        if (bedrooms) filter.bedrooms = parseInt(bedrooms as string);
        if (bathrooms) filter.bathrooms = parseInt(bathrooms as string);

        // Price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
        }

        // Area range
        if (minArea || maxArea) {
            filter.areaSqFt = {};
            if (minArea) filter.areaSqFt.$gte = parseFloat(minArea as string);
            if (maxArea) filter.areaSqFt.$lte = parseFloat(maxArea as string);
        }

        // Amenities filter
        if (amenities) {
            const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
            filter.amenities = { $in: amenitiesArray.map(a => caseInsensitive(a)) };
        }

        const cacheKey = JSON.stringify({ filter, page, limit, sortBy, sortOrder });
        const cachedResult = await cacheService.getCachedPropertyList(cacheKey);

        if (cachedResult) {
            res.json(cachedResult);
            return;
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const sortOptions: any = {};
        sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

        const [properties, total] = await Promise.all([
            Property.find(filter)
                .populate('createdBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit as string)),
            Property.countDocuments(filter)
        ]);

        const result = {
            success: true,
            data: {
                properties,
                pagination: {
                    current: parseInt(page as string),
                    pages: Math.ceil(total / parseInt(limit as string)),
                    total,
                    limit: parseInt(limit as string)
                }
            }
        };

        await cacheService.cachePropertyList(cacheKey, result);

        res.json(result);
    } catch (error) {
        console.error('Get all properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch properties'
        });
    }
};


export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const cachedProperty = await cacheService.getCachedPropertyDetail(id);
        if (cachedProperty) {
            res.json(cachedProperty);
            return;
        }

        const property = await Property.findById(id).populate('createdBy', 'name email');

        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found.'
            });
            return;
        }

        const result = {
            success: true,
            data: { property }
        };

        await cacheService.cachePropertyDetail(id, result);

        res.json(result);
    } catch (error) {
        console.error('Get property by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property.'
        });
    }
};

export const getMyProperties = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [properties, total] = await Promise.all([
            Property.find({ createdBy: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit as string))
                .populate('createdBy', 'name email'),
            Property.countDocuments({ createdBy: req.user._id })
        ]);

        res.status(200).json({
            success: true,
            data: {
                properties,
                pagination: {
                    current: parseInt(page as string),
                    pages: Math.ceil(total / parseInt(limit as string)),
                    total,
                    limit: parseInt(limit as string)
                }
            }
        });
    } catch (error) {
        console.error('Get my properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your properties'
        });
    }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id);
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found.'
            });
            return;
        }

        if (property.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Property details update not allowed.'
            });
            return;
        }

        // Image upload
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const imageUrls = await cloudinaryService.uploadMultipleImages(req.files);
            req.body.images = [...(property.images || []), ...imageUrls];
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        await cacheService.invalidatePropertyCaches(id);

        console.info(`Property updated: ${id} by user: ${req.user._id}`);

        res.json({
            success: true,
            message: 'Property updated successfully.',
            data: { property: updatedProperty }
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ success: false, message: 'Failed to update property.' });
    }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id);
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found.'
            });
            return;
        }

        if (property.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Property deletion not allowed.'
            });
            return;
        }

        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            for (const imageUrl of property.images) {
                try {
                    const publicId = cloudinaryService.extractPublicId(imageUrl);
                    await cloudinaryService.deleteImage(publicId);
                } catch (error) {
                    console.warn(`Failed to delete image: ${imageUrl}`);
                }
            }
        }

        await Property.findByIdAndDelete(id);

        await cacheService.invalidatePropertyCaches(id);

        console.info(`Property deleted: ${id} by user: ${req.user._id}`);

        res.json({
            success: true,
            message: 'Property deleted successfully.'
        });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete property'
        });
    }
};
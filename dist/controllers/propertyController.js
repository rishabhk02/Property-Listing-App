"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getMyProperties = exports.getPropertyById = exports.getAllProperties = exports.createProperty = exports.importPropertiesFromExcel = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const Property_1 = require("../models/Property");
const cacheService_1 = require("../services/cacheService");
const cloudinaryService_1 = require("../services/cloudinaryService");
const importPropertiesFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const workbook = xlsx_1.default.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx_1.default.utils.sheet_to_json(sheet, { header: 1 });
        if (rows.length < 2) {
            return res.status(400).json({ success: false, message: 'Excel file must have at least one data row.' });
        }
        const dataRows = rows.slice(1);
        const properties = dataRows.map((row) => ({
            propertyId: row[0],
            title: row[1],
            type: row[2],
            price: Number(row[3]),
            state: row[4],
            city: row[5],
            areaSqFt: Number(row[6]),
            bedrooms: Number(row[7]),
            bathrooms: Number(row[8]),
            amenities: typeof row[9] === 'string' ? row[9].split('|').map((a) => a.trim()) : [],
            furnished: row[10] === 'true' || row[10] === true,
            availableFrom: new Date(row[11]),
            listedBy: row[12],
            tags: typeof row[13] === 'string' ? row[13].split(',').map((t) => t.trim()) : [],
            colorTheme: row[14] || '#000000',
            rating: Number(row[15]) || 0,
            isVerified: row[16] === 'true' || row[16] === true,
            listingType: row[17],
            images: [],
            createdBy: req.user._id,
        }));
        await Property_1.Property.insertMany(properties);
        return res.json({
            success: true,
            message: 'Properties imported successfully',
            count: properties.length
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to import properties',
            error: error.message
        });
    }
};
exports.importPropertiesFromExcel = importPropertiesFromExcel;
const createProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            listedBy: req.user._id,
            createdBy: req.user._id
        };
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const imageUrls = await cloudinaryService_1.cloudinaryService.uploadMultipleImages(req.files);
            propertyData.images = imageUrls;
        }
        const property = new Property_1.Property(propertyData);
        await property.save();
        await property.populate('listedBy', 'name email');
        await cacheService_1.cacheService.invalidatePropertyCaches();
        console.info(`New property created: ${property._id} by user: ${req.user._id}`);
        res.status(201).json({ success: true, message: 'Property created successfully', data: { property } });
    }
    catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ success: false, message: 'Failed to create property' });
    }
};
exports.createProperty = createProperty;
const getAllProperties = async (req, res) => {
    try {
        const { type, state, city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, furnished, amenities, listingType, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const filter = {};
        const caseInsensitive = (value) => {
            if (typeof value === 'string')
                return new RegExp(value, 'i');
            return value;
        };
        if (type)
            filter.type = caseInsensitive(type);
        if (state)
            filter.state = caseInsensitive(state);
        if (city)
            filter.city = caseInsensitive(city);
        if (listingType)
            filter.listingType = caseInsensitive(listingType);
        if (furnished !== undefined)
            filter.furnished = furnished === 'true';
        if (bedrooms)
            filter.bedrooms = parseInt(bedrooms);
        if (bathrooms)
            filter.bathrooms = parseInt(bathrooms);
        // Price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = parseFloat(minPrice);
            if (maxPrice)
                filter.price.$lte = parseFloat(maxPrice);
        }
        // Area range
        if (minArea || maxArea) {
            filter.areaSqFt = {};
            if (minArea)
                filter.areaSqFt.$gte = parseFloat(minArea);
            if (maxArea)
                filter.areaSqFt.$lte = parseFloat(maxArea);
        }
        // Amenities filter
        if (amenities) {
            const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
            filter.amenities = { $in: amenitiesArray.map(a => caseInsensitive(a)) };
        }
        const cacheKey = JSON.stringify({ filter, page, limit, sortBy, sortOrder });
        const cachedResult = await cacheService_1.cacheService.getCachedPropertyList(cacheKey);
        if (cachedResult) {
            res.json(cachedResult);
            return;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [properties, total] = await Promise.all([
            Property_1.Property.find(filter)
                .populate('createdBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            Property_1.Property.countDocuments(filter)
        ]);
        const result = {
            success: true,
            data: {
                properties,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    limit: parseInt(limit)
                }
            }
        };
        await cacheService_1.cacheService.cachePropertyList(cacheKey, result);
        res.json(result);
    }
    catch (error) {
        console.error('Get all properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch properties'
        });
    }
};
exports.getAllProperties = getAllProperties;
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedProperty = await cacheService_1.cacheService.getCachedPropertyDetail(id);
        if (cachedProperty) {
            res.json(cachedProperty);
            return;
        }
        const property = await Property_1.Property.findById(id).populate('createdBy', 'name email');
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
        await cacheService_1.cacheService.cachePropertyDetail(id, result);
        res.json(result);
    }
    catch (error) {
        console.error('Get property by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property.'
        });
    }
};
exports.getPropertyById = getPropertyById;
const getMyProperties = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [properties, total] = await Promise.all([
            Property_1.Property.find({ createdBy: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('createdBy', 'name email'),
            Property_1.Property.countDocuments({ createdBy: req.user._id })
        ]);
        res.status(200).json({
            success: true,
            data: {
                properties,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    limit: parseInt(limit)
                }
            }
        });
    }
    catch (error) {
        console.error('Get my properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your properties'
        });
    }
};
exports.getMyProperties = getMyProperties;
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property_1.Property.findById(id);
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
            const imageUrls = await cloudinaryService_1.cloudinaryService.uploadMultipleImages(req.files);
            req.body.images = [...(property.images || []), ...imageUrls];
        }
        const updatedProperty = await Property_1.Property.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('createdBy', 'name email');
        await cacheService_1.cacheService.invalidatePropertyCaches(id);
        console.info(`Property updated: ${id} by user: ${req.user._id}`);
        res.json({
            success: true,
            message: 'Property updated successfully.',
            data: { property: updatedProperty }
        });
    }
    catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ success: false, message: 'Failed to update property.' });
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property_1.Property.findById(id);
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
                    const publicId = cloudinaryService_1.cloudinaryService.extractPublicId(imageUrl);
                    await cloudinaryService_1.cloudinaryService.deleteImage(publicId);
                }
                catch (error) {
                    console.warn(`Failed to delete image: ${imageUrl}`);
                }
            }
        }
        await Property_1.Property.findByIdAndDelete(id);
        await cacheService_1.cacheService.invalidatePropertyCaches(id);
        console.info(`Property deleted: ${id} by user: ${req.user._id}`);
        res.json({
            success: true,
            message: 'Property deleted successfully.'
        });
    }
    catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete property'
        });
    }
};
exports.deleteProperty = deleteProperty;
//# sourceMappingURL=propertyController.js.map
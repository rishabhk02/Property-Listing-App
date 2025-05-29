"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavoriteStatus = exports.getUserFavorites = exports.removeFromFavorites = exports.addToFavorites = void 0;
const Favourite_1 = require("../models/Favourite");
const Property_1 = require("../models/Property");
const cacheService_1 = require("../services/cacheService");
const constants_1 = require("../utils/constants");
const addToFavorites = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const property = await Property_1.Property.findById(propertyId);
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found.'
            });
            return;
        }
        const existingFavourite = await Favourite_1.Favourite.findOne({
            userId: req.user._id,
            propertyId
        });
        if (existingFavourite) {
            res.status(400).json({
                success: false,
                message: 'Propery already marked favourite.'
            });
            return;
        }
        const favourite = new Favourite_1.Favourite({
            userId: req.user._id,
            propertyId
        });
        await favourite.save();
        await cacheService_1.cacheService.invalidateUserFavorites(req.user._id.toString());
        console.info(`Property ${propertyId} added to favorites by user: ${req.user._id}`);
        res.status(201).json({
            success: true,
            message: 'Property successfully added to favourite',
            data: { favourite }
        });
    }
    catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to favorites'
        });
    }
};
exports.addToFavorites = addToFavorites;
const removeFromFavorites = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const favorite = await Favourite_1.Favourite.findOneAndDelete({
            userId: req.user._id,
            propertyId
        });
        if (!favorite) {
            res.status(404).json({
                success: false,
                message: 'Property not found in favorites'
            });
            return;
        }
        await cacheService_1.cacheService.invalidateUserFavorites(req.user._id.toString());
        console.info(`Property ${propertyId} removed from favorites by user: ${req.user._id}`);
        res.json({
            success: true,
            message: 'Property successfully removed from favourite'
        });
    }
    catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from favorites'
        });
    }
};
exports.removeFromFavorites = removeFromFavorites;
const getUserFavorites = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const cacheKey = `${constants_1.CACHE_KEYS.USER_FAVORITES}:${req.user._id}:page=${page}:limit=${limit}`;
        const cachedFavorites = await cacheService_1.cacheService.getCachedUserFavorites(cacheKey);
        if (cachedFavorites) {
            res.json(cachedFavorites);
            return;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [favourites, total] = await Promise.all([
            Favourite_1.Favourite.find({ userId: req.user._id })
                .populate({
                path: 'propertyId',
                populate: {
                    path: 'createdBy',
                    select: 'name email'
                }
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Favourite_1.Favourite.countDocuments({ userId: req.user._id })
        ]);
        const result = {
            success: true,
            data: {
                favorites: favourites.map(fav => ({
                    id: fav._id,
                    property: fav.propertyId,
                    addedAt: fav.createdAt
                })),
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    limit: parseInt(limit)
                }
            }
        };
        await cacheService_1.cacheService.cacheUserFavorites(cacheKey, result);
        res.json(result);
    }
    catch (error) {
        console.error('Get user favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch favorites'
        });
    }
};
exports.getUserFavorites = getUserFavorites;
const checkFavoriteStatus = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const favorite = await Favourite_1.Favourite.findOne({
            userId: req.user._id,
            propertyId
        });
        res.json({
            success: true,
            data: {
                isFavorite: !!favorite,
                favoriteId: favorite?._id || null
            }
        });
    }
    catch (error) {
        console.error('Check favorite status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check favorite status'
        });
    }
};
exports.checkFavoriteStatus = checkFavoriteStatus;
//# sourceMappingURL=favouriteController.js.map
import { Response } from 'express';
import { Favourite } from '../models/Favourite';
import { Property } from '../models/Property';
import { AuthRequest } from '../middlewares/auth';
import { cacheService } from '../services/cacheService';
import { CACHE_KEYS } from '../utils/constants';

export const addToFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
      return;
    }

    const existingFavourite = await Favourite.findOne({
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

    const favourite = new Favourite({
      userId: req.user._id,
      propertyId
    });

    await favourite.save();

    await cacheService.invalidateUserFavorites(req.user._id.toString());

    console.info(`Property ${propertyId} added to favorites by user: ${req.user._id}`);

    res.status(201).json({
      success: true,
      message: 'Property successfully added to favourite',
      data: { favourite }
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites'
    });
  }
};

export const removeFromFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favourite.findOneAndDelete({
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

    await cacheService.invalidateUserFavorites(req.user._id.toString());

    console.info(`Property ${propertyId} removed from favorites by user: ${req.user._id}`);

    res.json({
      success: true,
      message: 'Property successfully removed from favourite'
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites'
    });
  }
};

export const getUserFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const cacheKey = `${CACHE_KEYS.USER_FAVORITES}:${req.user._id}:page=${page}:limit=${limit}`;
    const cachedFavorites = await cacheService.getCachedUserFavorites(cacheKey);
    
    if (cachedFavorites) {
      res.json(cachedFavorites);
      return;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [favourites, total] = await Promise.all([
      Favourite.find({ userId: req.user._id })
        .populate({
          path: 'propertyId',
          populate: {
            path: 'createdBy',
            select: 'name email'
          }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Favourite.countDocuments({ userId: req.user._id })
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
          current: parseInt(page as string),
          pages: Math.ceil(total / parseInt(limit as string)),
          total,
          limit: parseInt(limit as string)
        }
      }
    };

    await cacheService.cacheUserFavorites(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
};

export const checkFavoriteStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favourite.findOne({
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
  } catch (error) {
    console.error('Check favorite status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status'
    });
  }
};
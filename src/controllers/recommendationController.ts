import { Response } from 'express';
import { Recommendation } from '../models/Recommendation';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export const recommendProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, recipientEmail, message } = req.body;

    console.log(propertyId);

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
      return;
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      res.status(404).json({
        success: false,
        message: 'Recipient user not found with this email'
      });
      return;
    }

    if (recipient._id.toString() === req.user._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Cannot recommend property to yourself'
      });
      return;
    }

    const existingRecommendation = await Recommendation.findOne({
      propertyId,
      recommendedBy: req.user._id,
      recommendedTo: recipient._id
    });

    if (existingRecommendation) {
      res.status(400).json({
        success: false,
        message: 'Property already recommended to this user'
      });
      return;
    }

    const recommendation = new Recommendation({
      propertyId,
      recommendedBy: req.user._id,
      recommendedTo: recipient._id,
      message: message || undefined
    });

    await recommendation.save();

    await recommendation.populate([
      {
        path: 'propertyId',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      },
      {
        path: 'recommendedBy',
        select: 'name email'
      },
      {
        path: 'recommendedTo',
        select: 'name email'
      }
    ]);

    console.info(`Property ${propertyId} recommended by ${req.user._id} to ${recipient._id}`);

    res.status(201).json({
      success: true,
      message: `Property recommendation sent to ${recipient.email}`,
      data: { recommendation }
    });
  } catch (error) {
    console.error('Recommend property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send recommendation.'
    });
  }
};

export const getReceivedRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    const filter: any = { recommendedTo: req.user._id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [recommendations, total] = await Promise.all([
      Recommendation.find(filter)
        .populate([
          {
            path: 'propertyId',
            populate: {
              path: 'createdBy',
              select: 'name email'
            }
          },
          {
            path: 'recommendedBy',
            select: 'name email'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Recommendation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        recommendations,
        pagination: {
          current: parseInt(page as string),
          pages: Math.ceil(total / parseInt(limit as string)),
          total,
          limit: parseInt(limit as string)
        }
      }
    });
  } catch (error) {
    console.error('Get received recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
};

export const getSentRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [recommendations, total] = await Promise.all([
      Recommendation.find({ recommendedBy: req.user._id })
        .populate([
          {
            path: 'propertyId',
            populate: {
              path: 'createdBy',
              select: 'name email'
            }
          },
          {
            path: 'recommendedTo',
            select: 'name email'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Recommendation.countDocuments({ recommendedBy: req.user._id })
    ]);

    res.json({
      success: true,
      data: {
        recommendations,
        pagination: {
          current: parseInt(page as string),
          pages: Math.ceil(total / parseInt(limit as string)),
          total,
          limit: parseInt(limit as string)
        }
      }
    });
  } catch (error) {
    console.error('Get sent recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent recommendations'
    });
  }
};

export const markRecommendationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOneAndUpdate(
      {
        _id: id,
        recommendedTo: req.user._id
      },
      { isRead: true },
      { new: true }
    ).populate([
      {
        path: 'propertyId',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      },
      {
        path: 'recommendedBy',
        select: 'name email'
      }
    ]);

    if (!recommendation) {
      res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Recommendation marked as read',
      data: { recommendation }
    });
  } catch (error) {
    console.error('Mark recommendation as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark recommendation as read'
    });
  }
};

export const deleteRecommendation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOneAndDelete({
      _id: id,
      $or: [
        { recommendedBy: req.user._id },
        { recommendedTo: req.user._id }
      ]
    });

    if (!recommendation) {
      res.status(404).json({
        success: false,
        message: 'Recommendation not found or unauthorized'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recommendation'
    });
  }
};
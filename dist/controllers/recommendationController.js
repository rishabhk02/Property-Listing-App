"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecommendation = exports.markRecommendationAsRead = exports.getSentRecommendations = exports.getReceivedRecommendations = exports.recommendProperty = void 0;
const Recommendation_1 = require("../models/Recommendation");
const Property_1 = require("../models/Property");
const User_1 = require("../models/User");
const recommendProperty = async (req, res) => {
    try {
        const { propertyId, recipientEmail, message } = req.body;
        console.log(propertyId);
        const property = await Property_1.Property.findById(propertyId);
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found.'
            });
            return;
        }
        const recipient = await User_1.User.findOne({ email: recipientEmail });
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
        const existingRecommendation = await Recommendation_1.Recommendation.findOne({
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
        const recommendation = new Recommendation_1.Recommendation({
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
    }
    catch (error) {
        console.error('Recommend property error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send recommendation.'
        });
    }
};
exports.recommendProperty = recommendProperty;
const getReceivedRecommendations = async (req, res) => {
    try {
        const { page = 1, limit = 10, unreadOnly = false } = req.query;
        const filter = { recommendedTo: req.user._id };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [recommendations, total] = await Promise.all([
            Recommendation_1.Recommendation.find(filter)
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
                .limit(parseInt(limit)),
            Recommendation_1.Recommendation.countDocuments(filter)
        ]);
        res.json({
            success: true,
            data: {
                recommendations,
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
        console.error('Get received recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recommendations'
        });
    }
};
exports.getReceivedRecommendations = getReceivedRecommendations;
const getSentRecommendations = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [recommendations, total] = await Promise.all([
            Recommendation_1.Recommendation.find({ recommendedBy: req.user._id })
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
                .limit(parseInt(limit)),
            Recommendation_1.Recommendation.countDocuments({ recommendedBy: req.user._id })
        ]);
        res.json({
            success: true,
            data: {
                recommendations,
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
        console.error('Get sent recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sent recommendations'
        });
    }
};
exports.getSentRecommendations = getSentRecommendations;
const markRecommendationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendation = await Recommendation_1.Recommendation.findOneAndUpdate({
            _id: id,
            recommendedTo: req.user._id
        }, { isRead: true }, { new: true }).populate([
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
    }
    catch (error) {
        console.error('Mark recommendation as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark recommendation as read'
        });
    }
};
exports.markRecommendationAsRead = markRecommendationAsRead;
const deleteRecommendation = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendation = await Recommendation_1.Recommendation.findOneAndDelete({
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
    }
    catch (error) {
        console.error('Delete recommendation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete recommendation'
        });
    }
};
exports.deleteRecommendation = deleteRecommendation;
//# sourceMappingURL=recommendationController.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../utils/constants");
const propertySchema = new mongoose_1.Schema({
    propertyId: {
        type: String,
        required: [true, 'Property id is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Property type is required'],
        enum: constants_1.PROPERTY_TYPES
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    areaSqFt: {
        type: Number,
        required: [true, 'Area is required']
    },
    bedrooms: {
        type: Number,
        required: [true, 'Number of bedrooms is required']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required'],
        min: [0, 'Bathrooms cannot be negative'],
        max: [10, 'Maximum 10 bathrooms allowed']
    },
    amenities: [{
            type: String
        }],
    furnished: {
        type: Boolean,
        default: false
    },
    availableFrom: {
        type: Date,
        required: [true, 'Available from date is required']
    },
    listedBy: {
        type: String,
        ref: 'User',
        required: true
    },
    tags: [{
            type: String,
        }],
    colorTheme: {
        type: String,
        default: '#000000'
    },
    rating: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    listingType: {
        type: String,
        required: [true, 'Listing type is required'],
        enum: constants_1.LISTING_TYPES
    },
    images: [{
            type: String,
        }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
propertySchema.index({ state: 1, city: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ rating: -1 });
propertySchema.index({ createdBy: 1 });
propertySchema.index({ title: 'text', tags: 'text' });
exports.Property = mongoose_1.default.model('Property', propertySchema);
//# sourceMappingURL=Property.js.map
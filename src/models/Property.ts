import mongoose, { Schema, Document } from 'mongoose';
import { PROPERTY_TYPES, LISTING_TYPES } from '../utils/constants';

export interface IProperty extends Document {
    _id: mongoose.Types.ObjectId;
    propertyId: string;
    title: string;
    type: typeof PROPERTY_TYPES[number];
    price: number;
    state: string;
    city: string;
    areaSqFt: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    furnished: boolean;
    availableFrom: Date;
    listedBy: string;
    tags: string[];
    colorTheme: string;
    rating: number;
    isVerified: boolean;
    listingType: typeof LISTING_TYPES[number];
    images: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
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
        enum: PROPERTY_TYPES
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
        enum: LISTING_TYPES
    },
    images: [{
        type: String,

    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
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

export const Property = mongoose.model<IProperty>('Property', propertySchema);
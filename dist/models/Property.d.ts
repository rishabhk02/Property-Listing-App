import mongoose, { Document } from 'mongoose';
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
export declare const Property: mongoose.Model<IProperty, {}, {}, {}, mongoose.Document<unknown, {}, IProperty, {}> & IProperty & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Property.d.ts.map
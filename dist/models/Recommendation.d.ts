import mongoose, { Document } from 'mongoose';
export interface IRecommendation extends Document {
    _id: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    recommendedBy: mongoose.Types.ObjectId;
    recommendedTo: mongoose.Types.ObjectId;
    message?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Recommendation: mongoose.Model<IRecommendation, {}, {}, {}, mongoose.Document<unknown, {}, IRecommendation, {}> & IRecommendation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Recommendation.d.ts.map
import mongoose, { Document } from 'mongoose';
export interface IFavourite extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    createdAt: Date;
}
export declare const Favourite: mongoose.Model<IFavourite, {}, {}, {}, mongoose.Document<unknown, {}, IFavourite, {}> & IFavourite & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Favourite.d.ts.map
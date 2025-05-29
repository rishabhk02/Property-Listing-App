import mongoose, { Schema, Document } from 'mongoose';

export interface IFavourite extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const favouriteSchema = new Schema<IFavourite>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  }
}, {
  timestamps: true
});

favouriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

favouriteSchema.index({ userId: 1 });

export const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema);
import mongoose, { Schema, Document } from 'mongoose';

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

const recommendationSchema = new Schema<IRecommendation>({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  recommendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recommendedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

recommendationSchema.index({ recommendedTo: 1, createdAt: -1 });

recommendationSchema.index({ recommendedBy: 1 });

// Prevent duplicate recommendation
recommendationSchema.index({ 
  propertyId: 1, 
  recommendedBy: 1, 
  recommendedTo: 1 
}, { unique: true });

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
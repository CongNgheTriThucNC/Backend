import { model, Model, Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    applicationId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
  }
  
  const FeedbackSchema = new Schema<IFeedback>({
    applicationId: { type: Schema.Types.ObjectId, ref: 'Job_Application', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  });
  
  export const FeedbackModel = model<IFeedback>('Feedback', FeedbackSchema);
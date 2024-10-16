import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IFeedback extends Document {
    applicationId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
}

const FeedbackSchema = new Schema<IFeedback>({
    applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'Job_Application',
        required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
});
FeedbackSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
FeedbackSchema.plugin(paginate);

export const FeedbackModel = model<IFeedback>('Feedback', FeedbackSchema);

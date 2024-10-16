import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IJobApplication extends Document {
    jobId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    applicationDate: Date;
    applicationStatus: 'Pending' | 'Reviewed' | 'Rejected';
}

const JobApplicationSchema = new Schema<IJobApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationDate: { type: Date, default: Date.now },
    applicationStatus: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Rejected'],
        default: 'Pending',
    },
});
JobApplicationSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
JobApplicationSchema.plugin(paginate);

export const JobApplicationModel: SoftDeleteModel<IJobApplication> =
    model<IJobApplication>('Job_Application', JobApplicationSchema);

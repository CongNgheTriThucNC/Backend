import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IJobRequirement extends Document {
    jobId: Schema.Types.ObjectId;
    requirementDescription: string;
    requirementType: 'Skill' | 'Education' | 'Experience';
}

const JobRequirementSchema = new Schema<IJobRequirement>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    requirementDescription: { type: String, required: true },
    requirementType: {
        type: String,
        enum: ['Skill', 'Education', 'Experience'],
        required: true,
    },
});
JobRequirementSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
JobRequirementSchema.plugin(paginate);

export const JobRequirementModel: SoftDeleteModel<IJobRequirement> =
    model<IJobRequirement>('Job_Requirement', JobRequirementSchema);

import { model, Model, Schema, Document } from 'mongoose';

export interface IJobRequirement extends Document {
    requirement_id: number;
    job_id: number;
    requirement_description: string;
}

const JobRequirementSchema = new Schema<IJobRequirement>(
    {
        requirement_id: { type: Number, required: true, unique: true },
        job_id: { type: Number, required: true },
        requirement_description: { type: String, required: true },
    },
    { collection: 'job_requirement', timestamps: false },
);

export const JobRequirementModel: Model<IJobRequirement> = model<IJobRequirement>('JobRequirement', JobRequirementSchema);

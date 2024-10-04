import { model, Model, Schema, Document } from 'mongoose';

export interface IJob extends Document {
    job_id: number;
    title: string;
    description: string;
    location_id: number;
    employer_id: number;
    job_type_id: number;
    created_at: Date;
    salary: number;
}

const JobSchema = new Schema<IJob>(
    {
        job_id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        location_id: { type: Number, required: true },
        employer_id: { type: Number, required: true },
        job_type_id: { type: Number, required: true },
        created_at: { type: Date, required: true, default: Date.now },
        salary: { type: Number, required: true },
    },
    { collection: 'job', timestamps: false },
);

export const JobModel: Model<IJob> = model<IJob>('Job', JobSchema);

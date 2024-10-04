import { model, Model, Schema, Document } from 'mongoose';

export interface IEmployer extends Document {
    employer_id: number;
    name: string;
    description: string;
    contact_info: string;
}

const EmployerSchema = new Schema<IEmployer>(
    {
        employer_id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        contact_info: { type: String, required: true },
    },
    { collection: 'employer', timestamps: false },
);

export const EmployerModel: Model<IEmployer> = model<IEmployer>('Employer', EmployerSchema);

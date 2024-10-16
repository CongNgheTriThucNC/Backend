import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IEmployer extends Document {
    name?: string;
    description?: string;
    contactInfo?: string;
    company?: string;
    website?: string;
    email?: string;
}

const EmployerSchema = new Schema<IEmployer>(
    {
        name: { type: String },
        description: { type: String },
        contactInfo: { type: String },
        company: { type: String },
        website: { type: String },
        email: { type: String },
    },
    { timestamps: true },
);

EmployerSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

EmployerSchema.plugin(paginate);

export const EmployerModel: SoftDeleteModel<IEmployer> = model<IEmployer>(
    'Employer',
    EmployerSchema,
);

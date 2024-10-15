import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
export interface IEmployer extends Document {
    name: string;
    description: string;
    contactInfo: string;
  }
  
  const EmployerSchema = new Schema<IEmployer>({
    name: { type: String, required: true },
    description: { type: String },
    contactInfo: { type: String, required: true },
  }, { timestamps: true });
  EmployerSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
  EmployerSchema.plugin(paginate);
  
  export const EmployerModel: SoftDeleteModel<IEmployer> = model<IEmployer>('Employer', EmployerSchema);
  
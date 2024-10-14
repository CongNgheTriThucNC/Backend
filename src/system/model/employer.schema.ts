import { model, Model, Schema, Document } from 'mongoose';

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
  
  export const EmployerModel = model<IEmployer>('Employer', EmployerSchema);
  
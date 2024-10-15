import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
export interface IJob extends Document {
    title: string;
    description: string;
    locationId: Schema.Types.ObjectId;
    employerId: Schema.Types.ObjectId;
    jobTypeId: Schema.Types.ObjectId;
    salary: number;
    status: 'Active' | 'Closed';
    createdAt: Date;
  }
  
  const JobSchema = new Schema<IJob>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    employerId: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
    jobTypeId: { type: Schema.Types.ObjectId, ref: 'Job_Type', required: true },
    salary: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Closed'], required: true },
  }, { timestamps: true });
  JobSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
  JobSchema.plugin(paginate);
  
  export const JobModel: SoftDeleteModel<IJob> = model<IJob>('Job', JobSchema);
  
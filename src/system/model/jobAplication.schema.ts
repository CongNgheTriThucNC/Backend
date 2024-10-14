
import { model, Model, Schema, Document } from 'mongoose';

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
      default: 'Pending' 
    },
  });
  
  export const JobApplicationModel = model<IJobApplication>('Job_Application', JobApplicationSchema);
  
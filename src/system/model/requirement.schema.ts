import { model, Model, Schema, Document } from 'mongoose';

export interface IJobRequirement extends Document {
    jobId: Schema.Types.ObjectId;
    requirementDescription: string;
    requirementType: 'Skill' | 'Education' | 'Experience';
  }
  
  const JobRequirementSchema = new Schema<IJobRequirement>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    requirementDescription: { type: String, required: true },
    requirementType: { type: String, enum: ['Skill', 'Education', 'Experience'], required: true },
  });
  
  export const JobRequirementModel = model<IJobRequirement>('Job_Requirement', JobRequirementSchema);
  
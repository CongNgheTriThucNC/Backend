import { model, Model, Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    type: 'City' | 'Mountain' | 'Island';
  }
  
  const LocationSchema = new Schema<ILocation>({
    name: { type: String, required: true },
    type: { type: String, enum: ['City', 'Mountain', 'Island'], required: true },
  }, { timestamps: true });
  
  export const LocationModel = model<ILocation>('Location', LocationSchema);
  
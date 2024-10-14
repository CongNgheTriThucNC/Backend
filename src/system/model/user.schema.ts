import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'Employer' | 'JobSeeker' | 'Admin';
  profilePicture?: string;
  bio?: string;
  locationId: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Employer', 'JobSeeker', 'Admin'], 
    default: 'JobSeeker' 
  },
  profilePicture: { type: String },
  bio: { type: String },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location' }, // Foreign key to Location
}, { timestamps: true });

export const UserModel = model<IUser>('User', UserSchema);

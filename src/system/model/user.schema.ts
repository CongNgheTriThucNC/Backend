import { model, Model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    name: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const IUserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true,
        },
        name: { type: String, required: true },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { collection: 'user', timestamps: true },
);

export const UserModel: Model<IUser> = model<IUser>('user', IUserSchema);

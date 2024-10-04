import { model, Model, Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    location_id: number;
    name: string;
    type: string;
}

const LocationSchema = new Schema<ILocation>(
    {
        location_id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
    },
    { collection: 'location', timestamps: false },
);

export const LocationModel: Model<ILocation> = model<ILocation>('Location', LocationSchema);

import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface ILocation extends Document {
    name: string;
    type: 'City' | 'Mountain' | 'Island';
}

const LocationSchema = new Schema<ILocation>(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ['City', 'Mountain', 'Island'],
            required: true,
        },
    },
    { timestamps: true },
);

LocationSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
LocationSchema.plugin(paginate);
export const LocationModel: SoftDeleteModel<ILocation> = model<ILocation>(
    'Location',
    LocationSchema,
);

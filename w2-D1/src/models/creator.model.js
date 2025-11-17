import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    followers: { type: Number, default: 0 },
    platform: { type: String, required: true },
},
 { timestamps: true }
);
export const Creator= mongoose.model('Creator',creatorSchema)
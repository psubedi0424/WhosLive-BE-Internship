import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        followers: { type: Number, default: 0 },
        platform: { type: String, enum: ["youtube", "twitch"], required: true },
    },
    { timestamps: true }
);

export const Creator = mongoose.model("Creator", creatorSchema);

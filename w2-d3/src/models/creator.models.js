import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        platform: { type: String, enum: ["youtube", "twitch"], required: true },
        platformCreatorId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        followers: { type: Number, default: 0 },
        isLive: { type: Boolean, default: false },
        avatar: { type: String }
    },
    { timestamps: true }
);

creatorSchema.index({ username: 1 });

export const Creator = mongoose.model("Creator", creatorSchema);

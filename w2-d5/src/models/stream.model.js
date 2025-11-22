import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        isLive: { type: Boolean, default: false },
        viewerCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Stream = mongoose.model("Stream", streamSchema);

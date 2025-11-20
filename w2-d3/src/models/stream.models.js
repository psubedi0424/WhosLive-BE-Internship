import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        platform: { type: String, enum: ["youtube", "twitch"], required: true },
        platformStreamId: { type: String, required: true, unique: true },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Creator",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        isLive: { type: Boolean, default: false },
        viewerCount: { type: Number, default: 0 },
        startedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// 🔥 Indexes for performance
streamSchema.index({ category: 1, isLive: 1, startedAt: -1 });
streamSchema.index({ isLive: 1, viewerCount: -1 });
streamSchema.index({ startedAt: -1, _id: -1 });
streamSchema.index({ title: 'text', description: 'text' });

export const Stream = mongoose.model("Stream", streamSchema);


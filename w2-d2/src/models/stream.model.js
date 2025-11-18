import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
    {
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
        title: String,
        isLive: Boolean,
        viewers: Number,
        startedAt: Date
    },
    { timestamps: true }
);

// Compound index: find streams of a category sorted by viewers
streamSchema.index({ isLive: 1, viewers: -1 });

// TTL index (expire documents after 24 hours)
streamSchema.index({ startedAt: 1 }, { expireAfterSeconds: 86400 });

export const Stream = mongoose.model("Stream", streamSchema);

import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
    },
    { timestamps: true }
);

creatorSchema.index({ username: 1 }); // unique index

export const Creator = mongoose.model("Creator", creatorSchema);

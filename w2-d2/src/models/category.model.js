import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

categorySchema.index({ slug: 1 });

export const Category = mongoose.model("Category", categorySchema);

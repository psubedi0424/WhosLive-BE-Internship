import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "intern_w2",
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.log("❌ Mongo connection error:", err);
        process.exit(1);
    }
}

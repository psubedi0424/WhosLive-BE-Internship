import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "intern_w2",
        });

        console.log(" MongoDB connected");
    } catch (err) {
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    }
}

connectDB();

// Health check route
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Express + MongoDB is running properly ",
    });
});

// ---- TEMP ROUTES (You will replace these in Day 2) ----
app.get("/", (req, res) => {
    res.json({ message: "API root working!" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.message);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

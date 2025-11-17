import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import creatorRoutes from "./routes/creator.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/creators", creatorRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Express + MongoDB running!" });
});

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

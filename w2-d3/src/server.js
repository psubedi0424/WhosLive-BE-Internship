import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import "./models/category.models.js";
import "./models/creator.models.js";
import "./models/stream.models.js";
import streamRoutes from "./routes/stream.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/streams", streamRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.get('/streams/live', (req, res) => {
    res.send('Live stream page is working!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});

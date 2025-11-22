// import { Router } from "express";
// import { Stream } from "../models/stream.model.js";

// const router = Router();

// router.get("/", async (req, res) => {
//     const streams = await Stream.find().limit(10);
//     res.json({
//         data: streams,
//         pagination: {
//             nextCursor: null,
//             hasNext: false,
//             limit: 10,
//         }
//     });
// });

// export default router;
// src/routes/stream.routes.js
import express from "express";
import { Stream } from "../models/stream.model.js";

const router = express.Router();

/**
 * GET /streams
 * List all streams
 */
router.get("/", async (req, res) => {
    try {
        const streams = await Stream.find()
            .populate("creator")
            .populate("category")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: streams });
    } catch (err) {
        console.error("Error fetching streams:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

/**
 * POST /streams
 * Create a new stream
 */
router.post("/", async (req, res) => {
    try {
        const { title, creator, category, isLive, viewerCount } = req.body;

        const stream = await Stream.create({
            title,
            creator,
            category,
            isLive,
            viewerCount
        });

        res.status(201).json({ success: true, data: stream });
    } catch (err) {
        console.error("Error creating stream:", err);
        res.status(400).json({ success: false, message: err.message });
    }
});

/**
 * GET /streams/:id
 * Get a single stream
 */
router.get("/:id", async (req, res) => {
    try {
        const stream = await Stream.findById(req.params.id)
            .populate("creator")
            .populate("category");

        if (!stream) {
            return res.status(404).json({ success: false, message: "Stream not found" });
        }

        res.json({ success: true, data: stream });
    } catch (err) {
        console.error("Error fetching single stream:", err);
        res.status(400).json({ success: false, message: "Invalid ID" });
    }
});

/**
 * PUT /streams/:id
 * Update a stream
 */
router.put("/:id", async (req, res) => {
    try {
        const stream = await Stream.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!stream) {
            return res.status(404).json({ success: false, message: "Stream not found" });
        }

        res.json({ success: true, data: stream });
    } catch (err) {
        console.error("Error updating stream:", err);
        res.status(400).json({ success: false, message: err.message });
    }
});

/**
 * DELETE /streams/:id
 */
router.delete("/:id", async (req, res) => {
    try {
        const stream = await Stream.findByIdAndDelete(req.params.id);

        if (!stream) {
            return res.status(404).json({ success: false, message: "Stream not found" });
        }

        res.json({ success: true, message: "Stream deleted" });
    } catch (err) {
        console.error("Error deleting stream:", err);
        res.status(400).json({ success: false, message: "Invalid ID" });
    }
});

export default router;

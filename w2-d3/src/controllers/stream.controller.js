import { Stream } from "../models/stream.models.js";
import { buildCursorQuery } from "../utils/pagination.js";
import mongoose from "mongoose";

export async function createStream(req, res) {
    try {
        const stream = await Stream.create(req.body);
        res.status(201).json(stream);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function listStreams(req, res) {
    try {
        const { category, live, q, cursor, limit = 5 } = req.query;
        const numericLimit = Math.min(Number(limit), 50);

        const filter = {};

        // Category filter - FIXED VALIDATION
        if (category && category.trim() !== '') {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ error: "Invalid category ID format" });
            }
            filter.category = new mongoose.Types.ObjectId(category);
        }

        // Live filter
        if (live && live.trim() !== '') {
            if (live !== "true" && live !== "false") {
                return res.status(400).json({ error: "Live parameter must be 'true' or 'false'" });
            }
            filter.isLive = live === "true";
        }

        // Search filter
        if (q && q.trim() !== '') {
            filter.$text = { $search: q };
        }

        // Cursor pagination
        if (cursor && cursor.trim() !== '') {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({ error: "Invalid cursor format" });
            }
            filter._id = { $gt: new mongoose.Types.ObjectId(cursor) };
        }

        const streams = await Stream.find(filter)
            .sort({ _id: 1 })
            .limit(numericLimit + 1)
            .populate('creator', 'name username')
            .populate('category', 'title slug');

        let hasNext = false;
        let nextCursor = null;

        if (streams.length > numericLimit) {
            hasNext = true;
            streams.pop();
        }

        if (streams.length > 0) {
            nextCursor = streams[streams.length - 1]._id;
        }

        res.json({
            data: streams,
            pagination: {
                nextCursor,
                hasNext,
                limit: numericLimit
            }
        });
    } catch (err) {
        console.error('ListStreams error:', err);
        res.status(500).json({ error: err.message });
    }
}
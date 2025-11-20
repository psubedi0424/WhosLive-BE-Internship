import express from "express";
import { createStream, listStreams } from "../controllers/stream.controller.js";
import { validate } from "../middleware/validate.js";
import { validateStreamQuery } from "../middleware/stream.schema.js"; // New path

const router = express.Router();

router.get("/", listStreams);
router.post("/", validateStreamQuery, createStream);

export default router;
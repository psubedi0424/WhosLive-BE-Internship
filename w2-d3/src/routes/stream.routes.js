import express from "express";
import { createStream, listStreams } from "../controllers/stream.controller.js";

const router = express.Router();

router.post("/", createStream);
router.get("/", listStreams);

export default router;

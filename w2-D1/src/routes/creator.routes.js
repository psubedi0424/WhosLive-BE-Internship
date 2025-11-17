// src/routes/creator.routes.js
import { Router } from 'express';
import {
    createCreator,
    getCreators,
    getCreatorById
} from '../controller/creator.controller.js';

const router = Router();

// POST /api/creators - Create a new creator
router.post("/", createCreator);

// GET /api/creators - Get all creators
router.get("/", getCreators);

// GET /api/creators/:id - Get a specific creator
router.get("/:id", getCreatorById);

export default router;
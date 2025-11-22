import { Router } from "express";
import { getTopCreators, getLiveByCategory } from "../controller/analytics.controller.js";

const router = Router();

router.get("/top-creators", getTopCreators);
router.get("/live-by-category", getLiveByCategory);
router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export default router;

import express from "express";
import { blogSearch, getBlogStats } from "../controllers/blogControllers.js";
import { memoizedHandler } from "../middleware/cacheMiddleware.js";
const router = express.Router();

router.get("/blog-stats", memoizedHandler, getBlogStats);
router.get("/blog-search", memoizedHandler, blogSearch);

export default router;
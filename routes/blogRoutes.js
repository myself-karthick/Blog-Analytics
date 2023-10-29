import express from "express";
import { blogSearch, getBlogStats } from "../controllers/blogControllers.js";

const router = express.Router();

router.get("/blog-stats", getBlogStats);
router.get("/blog-search", blogSearch);

export default router;

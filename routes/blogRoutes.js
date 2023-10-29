import express from "express";
import { searchBlogs, getBlogStats } from "../controllers/blogControllers.js";

const router = express.Router();

router.get("/blog-stats", getBlogStats);
router.get("/blog-search", searchBlogs);

export default router;

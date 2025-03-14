import express from "express";
import { calculateBlogRating, getUserLikedBlogs } from "../controllers/likeController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/blog/:blogId/rating", calculateBlogRating);
router.get("/user/liked-blogs", verifyJwt, getUserLikedBlogs);

export default router;

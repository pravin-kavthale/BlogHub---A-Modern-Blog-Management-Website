import express from "express";
import {
  getAllBlogs,
  getBlogsByCategory,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/publish", publishBlog);

export default router;

import express from "express";
import {
  addComment,
  getBlogComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/blog/:blogId/comment", verifyJwt, addComment);
router.get("/blog/:blogId/comments", getBlogComments);
router.put("/comment/:commentId", verifyJwt, updateComment);
router.delete("/comment/:commentId", verifyJwt, deleteComment);

export default router;

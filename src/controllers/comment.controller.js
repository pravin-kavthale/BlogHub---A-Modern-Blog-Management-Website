import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// 🟢 1️⃣ Add a Comment to a Blog
export const addComment = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const owner = req.user._id; // Extract owner from authenticated user

    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, "Blog not found");

    const newComment = new Comment({
      blog: blogId,
      blogOwner: blog.owner,
      content,
      owner,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    throw new ApiError(500, error?.message || "Error adding comment");
  }
});

// 🟢 2️⃣ Get All Comments for a Blog
export const getBlogComments = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId }).populate(
      "owner",
      "username email"
    );

    res.status(200).json(comments);
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching comments");
  }
});

// 🟢 3️⃣ Update a Comment (Only the comment owner can update)
export const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // Get logged-in user

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // Check if the logged-in user is the owner of the comment
    if (comment.owner.toString() !== userId.toString())
      throw new ApiError(403, "Unauthorized to update this comment");

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    throw new ApiError(500, error?.message || "Error updating comment");
  }
});

// 🟢 4️⃣ Delete a Comment (Only the comment owner or blog owner can delete)
export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // Get logged-in user

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // Check if the logged-in user is the owner of the comment or the blog owner
    if (
      comment.owner.toString() !== userId.toString() &&
      comment.blogOwner.toString() !== userId.toString()
    ) {
      throw new ApiError(403, "Unauthorized to delete this comment");
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    throw new ApiError(500, error?.message || "Error deleting comment");
  }
});

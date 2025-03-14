import { Like } from "../models/Like.js";
import { Blog } from "../models/Blog.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import verifyJwt from "../middleware/auth.middleware.js";

export const calculateBlogRating = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    const likeEntry = await Like.findOne({ blog: blogId });

    if (!likeEntry || likeEntry.likedBy.length === 0) {
      return res.status(404).json({ message: "No likes found for this blog." });
    }
    const totalRatings = likeEntry.likedBy.reduce(
      (sum, userLike) => sum + userLike.rating,
      0
    );
    const averageRating = totalRatings / likeEntry.likedBy.length;
    await Blog.findByIdAndUpdate(blogId, { rating: averageRating });

    res.status(200).json({ blogId, finalRating: averageRating });
  } catch (error) {
    throw new ApiError(500, error?.message || "Error calculating rating");
  }
});

export const getUserLikedBlogs = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; 
    const likedBlogs = await Like.find({ "likedBy.user": userId }).populate(
      "blog"
    );

    if (!likedBlogs.length) {
      return res.status(404).json({ message: "No liked blogs found for this user." });
    }

    const blogs = likedBlogs.map((like) => like.blog);
    res.status(200).json({ userId, likedBlogs: blogs });
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching liked blogs");
  }
});

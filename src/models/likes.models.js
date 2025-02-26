import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog", // References the Blog model
    required: true,
  },
  likedBy: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
      },
      clicks: {
        type: Number,
        default: 0, // Tracks how many times the user clicked
      },
      rating: {
        type: Number,
        default: 0, // Tracks the rating for this user
      },
    },
  ],
});



export const Like = mongoose.model("Like", LikeSchema);

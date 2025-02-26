import mongoose, { Schema } from "mongoose";

const draftSchema = new mongoose.Schema({
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blogs",
    },
  ],
});

export const Draft = mongoose.model("Draft", draftSchema);

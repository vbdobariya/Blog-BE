const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is require"],
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user require"],
    },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is require"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user require"],
    },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  videoUrl: { type: String, required: false },
  gifUrl: { type: String, required: false },
  comment: [commentSchema],
  likes: { type: Number, default: 0 },
  likesUser: [likeSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorname: { type: mongoose.Schema.Types.String, ref: "User", required: true },
},
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

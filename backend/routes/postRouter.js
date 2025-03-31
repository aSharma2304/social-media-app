import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getFeed,
  getLikedPosts,
  getPost,
  likeUnlike,
} from "../contollers/postControllers.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post("/createPost", protect, upload.single("image"), createPost);
postRouter.get("/getPost/:postId", protect, getPost);
postRouter.post("/like/:postId", protect, likeUnlike);

postRouter.delete("/deletePost/:postId", protect, deletePost);

postRouter.post("/comment/:postId", protect, addComment);
postRouter.delete("/comment/:commentId", protect, deleteComment);


postRouter.get("/getFeed", protect, getFeed);
postRouter.get("/getLikedFeed", protect, getLikedPosts);

export default postRouter;

import express from "express";
import {
  followUnfollow,
  udpdateProfile,
  getProfile,
  blockUnblock,
  getFollowers,
  getFollowings,
  getUsers,
} from "../contollers/userControllers.js";
import upload from "../middlewares/multer.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/getProfile/:username", protect, getProfile);
userRouter.post("/getUsers", protect, getUsers);
userRouter.post(
  "/updateProfile",
  protect,
  upload.single("avatar"),
  udpdateProfile
);

userRouter.post("/follow/:id", protect, followUnfollow);
userRouter.get("/getFollowers", protect, getFollowers);
userRouter.get("/getFollowing", protect, getFollowings);

userRouter.get("/block/:id", protect, blockUnblock);

export default userRouter;

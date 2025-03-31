import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../contollers/authControllers.js";

import protect from "../middlewares/authMiddleware.js";

import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), register);
authRouter.post("/login", login);
authRouter.get("/getMe", protect, getMe);
authRouter.get("/logout", logout);

export default authRouter;

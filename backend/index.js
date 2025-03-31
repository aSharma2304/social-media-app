import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { io, app, server } from "./socket/socket.js";

dotenv.config();
// const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend's origin
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/message", messageRouter);

server.listen(process.env.PORT, () => {
  console.log("listtenning on port 5050");
});

import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res
        .status(401)
        .json({ status: 401, message: "Not authorized no token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.userId) {
      res.clearCookie("authToken");
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.clearCookie("authToken");
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in auth middleware:", err);

    if (err.name === "TokenExpiredError") {
      res.clearCookie("authToken");
      return res.status(401).json({ status: 401, message: "Token expired" });
    }

    return res.status(500).json({
      status: 500,
      message: "Something went wrong in middleware",
      error: err.message,
    });
  }
};

export default protect;

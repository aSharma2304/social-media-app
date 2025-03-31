import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const comparePassword = async (receivedPassword, actualPassword) => {
  const res = await bcrypt.compare(receivedPassword, actualPassword);
  return res;
};

export const generateToken = async (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

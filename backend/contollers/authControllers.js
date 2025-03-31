import z from "zod";
import uploadOnCloudinary from "../utils/imageUpload.js";
import prisma from "../prisma/prismaClient.js";
import { comparePassword, generateToken } from "../utils/jwtUtils.js";

const registerSchema = z.object({
  fullname: z.string(),
  bio: z.string(),
  username: z.string().min(2, "Username must of length 2 or longer"),
  email: z.string().email("Not a valid email"),
  password: z.string().min(8, "Password must of of length 8 or longer"),
});

export const register = async (req, res) => {
  const data = req.body;
  const parsedData = registerSchema.safeParse(data);
  if (!parsedData.success) {
    return res.status(400).json({
      status: 400,
      message: "Invalid register schema",
      error: parsedData.error.errors,
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, { email: data.email }],
    },
  });
  if (user) {
    return res.status(400).json({
      status: 400,
      message: "User already exists with this email or username",
    });
  }

  let avatarLocalPath = req.file?.path;

  const uploadResponse = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryImageUrl = uploadResponse?.secure_url;

  const newUser = await prisma.user.create({
    data: {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: cloudinaryImageUrl,
      blocked: [],
      bio: data.bio,
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      bio: true,
      email: true,
      avatar: true,
      blocked: true,
      posts: true,
      followers: true,
      followings: true,
      Like: true,

      createdAt: true,
    },
  });
  if (!newUser) {
    return res.status(500).json({
      status: 500,
      message: "something went wrong while registering user",
    });
  }
  const generatedToken = await generateToken(newUser);

  res.cookie("authToken", generatedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const response = {
    status: 200,
    user: newUser,
    message: "User created Successfully",
  };
  return res.status(200).json(response);
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid Login schema" });
    }

    const userInDb = await prisma.user.findFirst({
      where: {
        username: username,
      },
      include: {
        posts: true,
        Like: true,
        followers: true,
        followings: true,
      },
    });

    if (!userInDb) {
      return res
        .status(400)
        .json({ status: 400, message: "No user found with this username" });
    }
    const isPasswordCorred = await comparePassword(password, userInDb.password);

    if (!isPasswordCorred) {
      return res.status(400).json({ status: 400, message: "Invalid Password" });
    }

    const token = await generateToken(userInDb);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const response = {
      status: 200,
      user: userInDb,
      message: "Logged In successfully",
    };
    return res.status(200).json(response);
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "Loggin in error", err: err.errors });
  }
};

export const getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const myself = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: true,
        Like: true,
        followers: true,
        followings: true,
      },
    });

    if (!myself) {
      return res.status(400).json({ status: 400, message: "No user found " });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Got your details", user: myself });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "something went wrong" });
  }
};

// export const getUserDetails = async (req, res) => {
//   // const userId = req.user.id;
//   if (!req.body.username) {
//     return res
//       .status(400)
//       .json({ status: 400, message: "Provide with a username" });
//   }
//   const { username } = req.body;

//   try {
//     const userDetails = await prisma.user.findUnique({
//       where: {
//         username: username,
//       },
//     });

//     if (!userDetails) {
//       return res.status(400).json({ status: 400, message: "No user found " });
//     }
//     return res
//       .status(200)
//       .json({ status: 200, message: "Got user details", data: userDetails });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ status: 500, message: "something went wrong" });
//   }
// };

export const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ status: 200, message: "Logged Out successfully" });
};

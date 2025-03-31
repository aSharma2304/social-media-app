import prisma from "../prisma/prismaClient.js";
import { deleteImage } from "../utils/imageUpload.js";
import { comparePassword } from "../utils/jwtUtils.js";
import uploadOnCloudinary from "../utils/imageUpload.js";

export const followUnfollow = async (req, res) => {
  const requesterId = req.user.id;

  try {
    const { id: targetUserId } = req.params;

    if (requesterId === targetUserId) {
      return res
        .status(400)
        .json({ status: 400, message: "You can't follow/unfollow yourself" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    // Check if already following
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId: requesterId,
            followingId: targetUserId,
          },
        },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Unfollowed successfully" });
    } else {
      await prisma.follower.create({
        data: {
          followerId: requesterId,
          followingId: targetUserId,
        },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Followed successfully" });
    }
  } catch (err) {
    console.error("Error in followUnfollow:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while following or unfollowing",
      error: err.message,
    });
  }
};

export const udpdateProfile = async (req, res) => {
  const id = req.user.id;

  try {
    if (req.body.username !== req.user.username) {
      const userAlready = await prisma.user.findFirst({
        where: { username: req.body.username },
      });
      if (userAlready) {
        return res
          .status(400)
          .json({ status: 400, message: "Username is taken" });
      }
    }

    const user = req.user;
    const data = req.body;
    if (!data.password) {
      return res.status(400).json({
        status: 400,
        message: "Password Required to update user profile details",
      });
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 400,
        message: "Password is incorrect",
      });
    }

    const updatedData = {};
    for (const key in data) {
      if (key !== "password" && data[key] !== user[key]) {
        updatedData[key] = data[key];
      }
    }

    if (req.file) {
      // first delete the old image
      if (user.avatar !== "") {
        console.log("deleting old photo in the cloud");
        const temp = user.avatar.split("/");

        console.log("old user has avatar ", user.avatar);

        const publicId = temp[temp.length - 1].split(".")[0];
        console.log(publicId);
        const res = await deleteImage(publicId);
      }
      // then upload new image
      console.log("uploding new image to the cloud");
      let avatarLocalPath = req.file?.path;
      console.log("local avatar path got ", avatarLocalPath);
      const uploadResponse = await uploadOnCloudinary(avatarLocalPath);
      const cloudinaryImageUrl = uploadResponse?.secure_url;
      console.log("new cloudinaryImageUrl", cloudinaryImageUrl);

      updatedData["avatar"] = cloudinaryImageUrl;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: updatedData,
    });

    if (!updatedUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Could not update user " });
    }

    return res.status(200).json({
      status: 200,
      message: "Updated user successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: `Something went wrong while updating user  `,
      error: err,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },

      select: {
        id: true,
        bio: true,
        fullname: true,
        username: true,
        avatar: true,
        email: true,
        blocked: true,
        createdAt: true,

        posts: {
          select: {
            id: true,
            text: true,
            image: true,
            postedBy: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                avatar: true,
                id: true,
              },
            },
            likes: true, // Include likes on posts
            _count: {
              select: { comments: true }, // Get the count of comments
            },
          },
        },

        followers: true,

        followings: true,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "No user with this username ",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "got the user profile details",
      profile: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching user profile ",
    });
  }
};

export const blockUnblock = async (req, res) => {
  const requester = req.user;
  try {
    const userIdToHandle = req.params.id;

    if (!userIdToHandle) {
      return res
        .status(400)
        .json({ status: 400, message: "A userId  should be provided" });
    }

    const userToHandle = await prisma.user.findUnique({
      where: {
        id: userIdToHandle,
      },
    });

    if (!userToHandle) {
      return res
        .status(400)
        .json({ status: 400, message: "Not a valid user to block or unblock" });
    }

    let message;
    let newBlockedArray = requester.blocked ?? [];
    if (requester.blocked?.includes(userIdToHandle)) {
      console.log("Unblock request came");
      newBlockedArray = requester.blocked.filter((id) => id !== userIdToHandle);
      message = "User unblocked successfully";
    } else {
      console.log("block request came");
      newBlockedArray = [...requester.blocked, userIdToHandle];
      message = "User blocked successfully";
    }

    await prisma.user.update({
      where: {
        id: requester.id,
      },
      data: {
        blocked: newBlockedArray,
      },
    });

    res.status(200).json({ status: 200, message: message });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching user profile ",
    });
  }
};

export const getFollowers = async (req, res) => {
  const requesterId = req.user.id;

  try {
    const followers = await prisma.follower.findMany({
      where: { followingId: requesterId },
      select: {
        follower: {
          select: { id: true, username: true, avatar: true, fullname: true },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Fetched followers successfully",
      followers: followers.map((f) => f.follower),
    });
  } catch (err) {
    console.error("Error fetching followers:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching followers",
      error: err.message,
    });
  }
};

export const getFollowings = async (req, res) => {
  const requesterId = req.user.id;
  try {
    const followings = await prisma.follower.findMany({
      where: { followerId: requesterId },
      select: {
        following: {
          select: { id: true, username: true, avatar: true, fullname: true },
        },
      },
    });

    const followingList = followings.map((f) => f.following);

    return res.status(200).json({
      status: 200,
      message: "Fetched following list successfully",
      followings: followingList,
    });
  } catch (err) {
    console.log("Error while getting following list:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching following list",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({
        status: 400,
        message: "Search query can't be empty",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            fullname: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      status: 200,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      status: 500,
      message: "Error while getting users search query",
    });
  }
};

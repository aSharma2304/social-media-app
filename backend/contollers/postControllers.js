import prisma from "../prisma/prismaClient.js";
import uploadOnCloudinary from "../utils/imageUpload.js";

export const createPost = async (req, res) => {
  const id = req.user.id;

  try {
    const body = req.body;

    // Ensure text field is present
    if (!body.text) {
      return res.status(400).json({
        status: 400,
        message: "Text field is required to create a post",
      });
    }

    const text = body.text;

    if (text.length > 500) {
      return res.status(400).json({
        status: 400,
        message: "Text should be of 500 characters at max",
      });
    }

    // Extract hashtags and mentions
    const hashtagsArray = text
      .split(" ")
      .filter((word) => word.startsWith("#"));
    console.log("Got hashtags in this post text:", hashtagsArray);

    const mentionsArray = text
      .split(" ")
      .filter((word) => word.startsWith("@"));
    console.log("Raw mentions in this post text:", mentionsArray);

    // Extract usernames from mentions (removing '@' symbol)
    const mentionedUsernames = mentionsArray.map((mention) => mention.slice(1));

    // Find valid users in the database
    const validUsers = await prisma.user.findMany({
      where: {
        username: { in: mentionedUsernames },
      },
      select: { username: true },
    });

    // Filter mentions to include only existing users
    const validMentions = validUsers.map((user) => `@${user.username}`);
    console.log("Valid mentions in this post:", validMentions);

    let imageLocalPath = req.file?.path;
    const uploadedImagePath = await uploadOnCloudinary(imageLocalPath);
    const cloudinaryUrl = uploadedImagePath?.secure_url;

    // Create the post with filtered mentions
    const post = await prisma.post.create({
      data: {
        text,
        image: cloudinaryUrl || "",
        postedBy: id,
        mentions: validMentions,
        hashtags: hashtagsArray,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Created post successfully", post });
  } catch (err) {
    console.log("Error while creating post:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating post",
      error: err.message,
    });
  }
};

export const getPost = async (req, res) => {
  // const id = req.user.id;

  try {
    const postId = req.params.postId;

    if (!postId) {
      return res
        .status(400)
        .json({ status: 400, message: "PostId is required to get post" });
    }

    const foundPost = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                avatar: true,
                username: true,
                fullname: true,
              },
            },
          },
        },
        likes: true,
        user: true,
      },
    });

    if (!foundPost) {
      return res
        .status(400)
        .json({ status: 400, message: "No post found with this postId" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Found post", post: foundPost });
  } catch (err) {
    console.log("Error while getting post:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while retreiving post",
      error: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const requesterId = req.user.id;

  try {
    const postId = req.params.postId;

    if (!postId) {
      return res
        .status(400)
        .json({ status: 400, message: "PostId is required to delete post" });
    }

    const foundPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!foundPost) {
      return res
        .status(400)
        .json({ status: 400, message: "No post found with this postId" });
    }

    if (foundPost.postedBy !== requesterId) {
      return res.status(400).json({
        status: 400,
        message: "Cannot delete post if you are not the author",
      });
    }

    if (foundPost.image !== "") {
      console.log("deleting old photo in the cloud of post");
      const temp = foundPost.image.split("/");

      console.log("deleting post image with url ", foundPost.image);

      const publicId = temp[temp.length - 1].split(".")[0];
      console.log(publicId);
      const res = await deleteImage(publicId);
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({ status: 200, message: "Deleted Post" });
  } catch (err) {
    console.log("Error while deleting post:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while deleting post",
      error: err.message,
    });
  }
};

export const likeUnlike = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    if (!postId) {
      return res.status(400).json({
        status: 400,
        message: "PostId is required to like/unlike post",
      });
    }

    const foundPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!foundPost) {
      return res.status(404).json({ status: 404, message: "Post not found" });
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Unliked post successfully" });
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });

      return res
        .status(200)
        .json({ status: 200, message: "Liked post successfully" });
    }
  } catch (err) {
    console.error("Error while liking/unliking post:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while liking/unliking post",
      error: err.message,
    });
  }
};

export const addComment = async (req, res) => {
  const userId = req.user.id;

  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        status: 400,
        message: "Must provide content to add as a comment",
      });
    }

    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({
        status: 400,
        message: "PostId is required to comment on post",
      });
    }

    const foundPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!foundPost) {
      return res.status(404).json({ status: 404, message: "Post not found" });
    }

    const addedComment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Added Comment successfully",
      comment: addedComment,
    });
  } catch (err) {
    console.error("Error while commenting on post:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while commenting on post",
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const userId = req.user.id;

  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({
        status: 400,
        message: "CommentId is required to delete a comment",
      });
    }

    const foundComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!foundComment) {
      return res
        .status(400)
        .json({ status: 400, message: "Comment not found" });
    }

    if (foundComment.userId !== userId) {
      return res.status(400).json({
        status: 400,
        message: "You can only delete your own comments",
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.error("Error while deleting comment:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while deleting the comment",
      error: err.message,
    });
  }
};

export const getFeed = async (req, res) => {
  const requesterId = req.user.id;
  try {
    const { page = 1, limit = 10 } = req.query;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        status: 400,
        message: "Page and limit must be positive integers",
      });
    }

    const skip = (page - 1) * limit;

    const feed = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        NOT: {
          OR: [
            { postedBy: requesterId }, // Exclude posts created by the requester
            { likes: { some: { userId: requesterId } } }, // Exclude posts liked by the requester
          ],
        },
      },
      include: {
        user: {
          select: { id: true, username: true, fullname: true, avatar: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Fetched feed successfully",
      data: feed,
      page,
      limit,
    });
  } catch (err) {
    console.error("Error while getting feed:", err);
    return res.status(500).json({
      status: 500,
      message: "Error while getting feed",
      error: err.message,
    });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const likedPosts = await prisma.like.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, avatar: true } },
            _count: { select: { comments: true, likes: true } },
          },
        },
      },
      orderBy: { post: { createdAt: "desc" } },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    return res.status(200).json({
      status: 200,
      message: "Fetched liked posts successfully",
      data: likedPosts.map((like) => like.post),
    });
  } catch (err) {
    console.error("Error fetching liked posts:", err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching liked posts",
      error: err.message,
    });
  }
};

export const baseUrl = "http://localhost:5050";

export const API_PATHS = {
  auth: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
    GET_USER_DETAILS: "/auth/getMe",
    LOGOUT: "/auth/logout",
  },
  user: {
    GET_PROFILE: "/user/getProfile", // Need to append username when using
    UPDATE_PROFILE: "/user/updateProfile",
    FOLLOW: "/user/follow", // Need to append id when using
    GET_FOLLOWERS: "/user/getFollowers",
    GET_FOLLOWING: "/user/getFollowing",
    BLOCK: "/user/block", // Need to append id when using
    GET_USERS: "/user/getUsers",
  },
  post: {
    CREATE_POST: "/post/createPost",
    GET_POST: "/post/getPost", // Append postId when using
    LIKE_UNLIKE: "/post/like", // Append postId when using
    DELETE_POST: "/post/deletePost", // Append postId when using
    ADD_COMMENT: "/post/comment", // Append postId when using
    DELETE_COMMENT: "/post/comment", // Append commentId when using
    GET_FEED: "/post/getFeed",
    GET_LIKED_FEED: "/post/getLikedFeed",
  },

  message: {
    SEND_MESSAGE: "/message", // POST request to send a message
    GET_MESSAGES: "/message/", // Append otherUserId when using
    GET_CONVERSATIONS: "/message/getConversations", // Get all conversations
  },
};

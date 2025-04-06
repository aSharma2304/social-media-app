import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MessageCircle } from "lucide-react";

const SmallPost = ({ post }) => {
  const { user } = useUser();

  const isLiked = post?.likes?.some((like) => like?.userId === user?.id);

  const [liked, setLiked] = useState(isLiked);
  const [noOfLikes, setNoOfLikes] = useState(post?.likes?.length || 0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigateToProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/profile/${post?.user?.username}`;
  };

  const handleLike = async (postId) => {
    const previousLiked = liked;
    const previousNoLikes = noOfLikes;

    setNoOfLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    setLiked((prev) => !prev);

    try {
      const res = await axios.post(
        baseUrl + API_PATHS.post.LIKE_UNLIKE + "/" + postId,
        {},
        { withCredentials: true }
      );

      if (res.status !== 200) {
        setNoOfLikes(previousNoLikes);
        setLiked(previousLiked);
      }
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      setNoOfLikes(previousNoLikes);
      setLiked(previousLiked);
    }
  };

  useEffect(() => {
    const currentIsLiked = post?.likes?.some(
      (like) => like?.userId === user?.id
    );
    setLiked(currentIsLiked);
    setNoOfLikes(post?.likes?.length || 0);

    if (post?.image) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [post?.id, user?.id]);

  return (
    <div className="flex flex-col space-y-2 p-3 w-full h-fit rounded-xl bg-[#121212] border border-white/5">
      <Link
        to={`/${post?.user?.username}/post/${post?.id}`}
        className="cursor-pointer"
      >
        {post?.image && (
          <div className="mt-3 w-full overflow-hidden rounded-lg">
            {!imageLoaded && !imageError && (
              <div className="w-full h-48 bg-gray-800 animate-pulse rounded-lg" />
            )}
            <img
              src={post?.image}
              alt="Post content"
              className={`w-full rounded-lg ${
                imageLoaded ? "block" : "hidden"
              }`}
              style={{
                maxHeight: "400px",
                objectFit: "contain",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {imageError && (
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-400 rounded-lg">
                Image could not be loaded
              </div>
            )}
          </div>
        )}
        <p className="text-gray-300 mt-2">{post?.text}</p>
      </Link>

      <footer className="flex justify-between mt-3">
        <div
          className="flex items-center space-x-3 w-fit cursor-pointer"
          onClick={navigateToProfile}
        >
          {post?.user?.avatar ? (
            <img
              src={post?.user?.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white text-xl font-medium">
              {post?.user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <p className="text-white font-semibold">{post?.user?.username}</p>
        </div>

        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-1 hover:text-red-500 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleLike(post?.id);
            }}
          >
            {liked ? (
              <FaHeart className="size-5 text-red-500" />
            ) : (
              <FaRegHeart className="size-5" />
            )}
            <span>{noOfLikes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
            <MessageCircle className="size-5" />
            <span>{post?._count?.comments}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SmallPost;

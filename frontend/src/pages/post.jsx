import React, { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import { useUser } from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import Comment from "../components/Comment";
import { BiCommentAdd } from "react-icons/bi";
import Modal from "../components/Modal";
import AddComment from "../components/AddComment";

// const placeholder = {
//   avatar: "https://i.pravatar.cc/40",
//   username: "JohnDoe",
//   content: "This is my first post on this amazing platform! 🚀",
//   image: "/musk.webp",
//   likes: 24,
//   comments: 12,
// };

const Post = () => {
  const { user } = useUser();

  const { username, postId } = useParams();

  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [nolikes, setNoLikes] = useState(0);

  const [postdata, setPostData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [openAddCommentModal, setOpenAddCommentModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log("Fetching post with postId:", postId);
        const res = await axios.get(
          baseUrl + API_PATHS.post.GET_POST + "/" + postId,
          {
            withCredentials: true,
          }
        );

        const data = res.data.post;
        console.log("got post data ", data);

        setPostData(data);
        setNoLikes(data.likes.length);
        setCommentsData(data.comments);
        // let isLiked = user?.Like?.some(
        //   (like) => String(like.postId) === String(data.id)
        // );

        let isLiked = data.likes.some(
          (like) => String(like.userId) === String(user.id)
        );

        console.log("is currently liked ", isLiked);
        setLiked(isLiked);
      } catch (err) {
        console.log("Error while getting posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, user]);

  const handleLike = async () => {
    console.log("post liked or unliked");

    // Save previous state in case we need to roll back
    const previousLiked = liked;
    const previousNoLikes = nolikes;

    // Optimistically update the UI
    setNoLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    setLiked((prev) => !prev);

    try {
      const res = await axios.post(
        baseUrl + API_PATHS.post.LIKE_UNLIKE + "/" + postId,
        {},
        { withCredentials: true }
      );

      if (res.status !== 200) {
        // Rollback on unexpected non-200 responses
        setNoLikes(previousNoLikes);
        setLiked(previousLiked);
      }
    } catch (err) {
      // Rollback on error
      console.error("Error liking/unliking post:", err);
      setNoLikes(previousNoLikes);
      setLiked(previousLiked);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border border-white/10 m-2  p-3 w-full min-w-[600px] h-fit">
        <Link to={`/profile/${username}`}>
          <div className="flex items-center space-x-3">
            {postdata?.user?.avatar ? (
              <img
                src={postdata?.user?.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover "
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white text-xl font-medium">
                {postdata?.user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <p className="text-white font-semibold">
              {postdata?.user?.username}
            </p>
          </div>
        </Link>

        <Link to="/abhinav/post/23">
          <p className="text-gray-300 mt-2">{postdata?.text}</p>

          {postdata?.image && (
            <img
              src={postdata?.image}
              alt="Post Image"
              className="rounded-lg mt-3 w-full max-h-[400px] object-cover"
            />
          )}
        </Link>

        <div className="flex justify-between space-x-2 items-center mt-3 px-4 text-gray-400 text-sm">
          <div className="flex space-x-2">
            <button
              className="flex items-center space-x-1 hover:text-red-500 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => {
                handleLike();
              }}
            >
              {liked ? (
                <FaHeart className="size-7 text-red-500" />
              ) : (
                <FaRegHeart className="size-7"></FaRegHeart>
              )}
              <span>{nolikes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
              <MessageCircle className="size-7" />
              <span>{commentsData.length || 0}</span>
            </button>
          </div>
          <button
            className="hover:text-yellow-500 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => setOpenAddCommentModal(true)}
          >
            <BiCommentAdd className="size-7"></BiCommentAdd>
          </button>
          <Modal
            open={openAddCommentModal}
            onClose={() => setOpenAddCommentModal(false)}
          >
            <AddComment
              postId={postdata?.id}
              setCommentsData={setCommentsData}
              setOpenAddCommentModal={setOpenAddCommentModal}
            ></AddComment>
          </Modal>
        </div>
      </div>

      <section className="flex flex-col space-y-1">
        {/* {postdata?.comments.map((comment) => {
          <Comment
            isAuthor={comment.userId === user?.id}
            content={comment.content}
            username={comment.userId}
          ></Comment>;
        })} */}
        {commentsData?.map((comment) => {
          return (
            <Comment
              commentData={commentsData}
              setCommentsData={setCommentsData}
              commentId={comment?.id}
              isAuthor={comment?.user?.username === user?.username}
              content={comment?.content}
              username={comment?.user?.username}
              avatar={comment?.user?.avatar}
            ></Comment>
          );
        })}
      </section>
    </div>
  );
};

export default Post;

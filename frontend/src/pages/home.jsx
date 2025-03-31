import React, { useEffect, useState } from "react";
import Post from "./post";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import SmallPost from "../components/SmallPost";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";

const posts = [
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    content: "This is my first post on this amazing platform! 🚀",
    image: "musk.webp",
    likes: 24,
    comments: 12,
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    content: "Loving the community here! 🔥",
    image: "",
    likes: 55,
    comments: 20,
  },
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    content: "This is my first post on this amazing platform! 🚀",
    image: "musk.webp",
    likes: 24,
    comments: 12,
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    content: "Loving the community here! 🔥",
    image: "",
    likes: 55,
    comments: 20,
  },
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    content: "This is my first post on this amazing platform! 🚀",
    image: "musk.webp",
    likes: 24,
    comments: 12,
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    content: "Loving the community here! 🔥",
    image: "",
    likes: 55,
    comments: 20,
  },
];

const likedPosts = [
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    content: "Excited to share my latest thoughts here! 🎉",
    image: "musk.webp",
    likes: 30,
    comments: 15,
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    content: "This platform keeps getting better! 🚀",
    image: "",
    likes: 60,
    comments: 25,
  },
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    content: "Just had an amazing discussion! 💡",
    image: "musk.webp",
    likes: 42,
    comments: 18,
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    content: "Great to see so much positivity here! ✨",
    image: "",
    likes: 48,
    comments: 22,
  },
];

const Home = () => {
  const [selection, setSelection] = useState("feed");
  const { user } = useUser();
  // const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(
          baseUrl + API_PATHS.post.GET_FEED + "?" + page,
          { withCredentials: true }
        );
        const data = res.data;
        console.log("home page got feed ", data.data);
        setFeed(data.data);
        setPage((prev) => prev + 1);
      } catch (err) {
        console.log("error occured while getting feed data", err);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="flex flex-col space-y-3 md:min-w-[600px] h-screen overflow-y-scroll px-1 overflow-x-hidden ">
      <div className="flex w-full justify-around border-b border-white/10">
        <button
          onClick={() => setSelection("feed")}
          className={`w-1/2 py-2 text-lg font-medium transition-colors duration-300 cursor-pointer ${
            selection === "feed"
              ? "text-white border-b-2 border-white"
              : "text-gray-400"
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setSelection("liked")}
          className={`w-1/2 py-2 text-lg font-medium transition-colors duration-300 cursor-pointer ${
            selection === "liked"
              ? "text-white border-b-2 border-white"
              : "text-gray-400"
          }`}
        >
          Liked
        </button>
      </div>

      {selection === "feed"
        ? feed?.map((post, index) => (
            <SmallPost key={post?.id} post={post}></SmallPost>
          ))
        : likedPosts.map((post, index) => <SmallPost></SmallPost>)}
    </div>
  );
};

export default Home;

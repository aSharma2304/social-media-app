import React, { useState } from "react";
import { Link } from "react-router-dom";

const users = [
  { id: 1, username: "john_doe", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, username: "jane_smith", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, username: "alex_wilson", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, username: "emma_jones", avatar: "https://i.pravatar.cc/40?img=4" },
];

const Suggestions = () => {
  const [following, setFollowing] = useState({});

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <h2 className="text-white text-xl font-semibold mb-5 text-center ">
        Who to follow
      </h2>
      <ul className="space-y-5 w-[250px]">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between hover:bg-white/5 p-3 rounded-lg"
          >
            {/* User Avatar & Name */}
            <Link to="/profile/abhinav" className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-white font-medium cursor-pointer">
                {user.username}
              </p>
            </Link>

            <button
              onClick={() => toggleFollow(user.id)}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                following[user.id]
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {following[user.id] ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Suggestions;

import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ id, username, avatar, fullname, isLink = true }) => {
  return isLink ? (
    <Link to={`/profile/${username}`} className="block w-full">
      <NormalCard username={username} avatar={avatar} fullname={fullname} />
    </Link>
  ) : (
    <NormalCard username={username} avatar={avatar} fullname={fullname} />
  );
};

const NormalCard = ({ username, avatar, fullname }) => {
  return (
    <div className="w-full p-2 my-2 rounded-lg hover:bg-white/10   bg-white/5   transition-all duration-200 flex items-center space-x-4 ">
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#101010] flex items-center justify-center text-white text-xl font-medium">
            {username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-medium text-base">{username}</p>
        <p className="text-sm text-white/50">{fullname}</p>
      </div>
    </div>
  );
};

export default UserCard;

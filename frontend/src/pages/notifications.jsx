import React from "react";
import { Link } from "react-router-dom";

const notifications = [
  {
    avatar: "https://i.pravatar.cc/40",
    username: "JohnDoe",
    action: "liked your post",
  },
  {
    avatar: "https://i.pravatar.cc/41",
    username: "JaneSmith",
    action: "commented on your post",
  },
  {
    avatar: "https://i.pravatar.cc/42",
    username: "MikeRoss",
    action: "followed you",
  },
];

const Notifications = () => {
  return (
    <div className="flex flex-col p-3 justify-start flex-1 md:min-w-[600px]">
      <h2 className="font-semibold text-3xl mb-4 ">Notifications</h2>
      {notifications.map((notif, index) => (
        <Notification
          key={index}
          avatar={notif.avatar}
          username={notif.username}
          action={notif.action}
        />
      ))}
    </div>
  );
};

const Notification = ({ avatar, username, action }) => {
  return (
    <Link
      to="/profile/username"
      className="flex items-center space-x-3 p-3  hover:bg-white/5 transition rounded-lg min-w-[400px]"
    >
      {/* Avatar */}
      <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />

      {/* Notification Content */}
      <p className="text-white text-sm">
        <span className="font-semibold">{username}</span> {action}.
      </p>
    </Link>
  );
};

export default Notifications;

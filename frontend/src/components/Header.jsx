import React from "react";
import { House, MessageCircle, Bell, CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="h-12 w-full min-w-[400px] flex items-center justify-between p-2">
      <p className="text-white text-2xl font-semibold">Z</p>

      <ul className="flex space-x-4 text-white">
        <NavItem element={<House className="size-6" />} path="/" />
        <NavItem element={<MessageCircle className="size-6" />} path="/chat" />
        <NavItem element={<Bell className="size-6" />} path="/notifications" />
        <NavItem
          element={<CircleUserRound className="size-6" />}
          path={`/profile/${user?.username}`}
        />
      </ul>
    </div>
  );
};

const NavItem = ({ element, path }) => {
  return (
    <Link to={path} className="p-2 hover:bg-white/10 rounded-lg transition">
      {element}
    </Link>
  );
};

export default Header;

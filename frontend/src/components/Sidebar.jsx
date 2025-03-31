import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useUser } from "../context/userContext";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { set } from "zod";

const Sidebar = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { user, removeUser } = useUser();
  const handleLogout = async () => {
    try {
      await axios.get(baseUrl + API_PATHS.auth.LOGOUT, {
        withCredentials: true,
      });
      localStorage.removeItem("thread-user");
      removeUser();
      navigate("/login");
    } catch (err) {
      console.log("error while logging out ", err);
      console.log(err);
    }
  };

  return (
    <div className="max-w-[350px]  h-full flex flex-col justify-between p-2">
      <div className="flex flex-col justify-center space-y-3">
        <Link
          to={`/profile/${user?.username}`}
          className="flex flex-col items-center space-y-2 p-3"
        >
          <div className="rounded-full overflow-hidden w-24 h-24 border-2 border-white/20">
            {user && user.avatar ? (
              <img
                className="object-cover w-full h-full"
                src={user?.avatar || "/trump.webp"}
                alt="profile image"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#101010] flex items-center justify-center text-white text-5xl font-medium">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <p className="text-lg font-semibold text-white">{user?.username}</p>
          <p className="text-sm text-white/50">{user?.fullname}</p>
        </Link>

        <ul className="flex flex-col items-start p-2 w-[200px] space-y-2">
          <SideBarItem path="/" name="Home"></SideBarItem>
          <SideBarItem path="/followers" name="Followers"></SideBarItem>
          <SideBarItem path="/following" name="Following"></SideBarItem>
          <SideBarItem path="/notifications" name="Notifications"></SideBarItem>
          <SideBarItem path="/chat" name="Chat"></SideBarItem>
        </ul>
      </div>

      {/* <button
        className="hover:text-red-500  transition-all duration-300  hover:bg-white/5 rounded-lg w-full p-2 flex justify-center items-center transiton transform ease-in-out cursor-pointer text-lg  "
        onClick={handleLogout}
      >
        <LogOut className="size-5 mx-3"></LogOut>Logout
      </button> */}
      <Modal open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
        <LogoutComponent
          handleLogout={handleLogout}
          openLogoutModal={openLogoutModal}
          setOpenLogoutModal={setOpenLogoutModal}
        ></LogoutComponent>
      </Modal>
      <button
        className="hover:text-red-500  transition-all duration-300  hover:bg-white/5 rounded-lg w-full p-2 flex justify-center items-center transiton transform ease-in-out cursor-pointer text-lg  "
        onClick={() => setOpenLogoutModal(true)}
      >
        {/* <LogOut className="size-5 mx-3"></LogOut> */}
        Logout
      </button>
    </div>
  );
};

const SideBarItem = ({ path, name }) => {
  return (
    <Link
      to={path}
      className="  w-full h-fit p-2 hover:bg-white/5 pl-3 flex items-center transiton transform ease-in-out cursor-pointer rounded-lg text-lg text-white"
    >
      {name}
    </Link>
  );
};

export const LogoutComponent = ({
  openLogoutModal,
  setOpenLogoutModal,
  handleLogout,
}) => {
  return (
    <div className="text-center w-56 ">
      <LogOut size={40} className="mx-auto " />
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-semibold  text-gray-100">Confirm Logout</h3>
        <p className="text-sm text-white/50 mt-2">
          Are you sure you want to logout from your account?
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className=" w-1/2 hover:bg-white/10 rounded-lg p-2 cursor-pointer"
          onClick={() => {
            handleLogout();
            setOpenLogoutModal(false);
          }}
        >
          Logout
        </button>
        <button
          className="w-1/2 hover:bg-white/10 rounded-lg p-2 cursor-pointer "
          onClick={() => setOpenLogoutModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

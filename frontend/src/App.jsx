import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Sidebar from "./components/Sidebar";
import Suggesstions from "./components/Suggesstions";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Chat from "./pages/chat";
import Profile from "./pages/user-profile";
import Post from "./pages/post";
import Notifications from "./pages/notifications";
import { useUser } from "./context/userContext";
import Cookies from "js-cookie";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Followers from "./pages/follower";
import Following from "./pages/following";
const isAuthenticated = () => {
  // const { user } = useUser();
  // if (user) {
  //   return true;
  // }
  // return false;

  return !!localStorage.getItem("thread-user");
};

const PublicRoutes = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/"></Navigate>;
  }
  return children;
};

const ProtectedRoutes = ({ children, skipLayout = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login"></Navigate>;
  }
  if (skipLayout) {
    return children;
  }
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <div className=" h-screen w-full  flex justify-center bg-[#141414] ">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login></Login>
            </PublicRoutes>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicRoutes>
              <Signup></Signup>
            </PublicRoutes>
          }
        ></Route>
        <Route
          path="/"
          element=<ProtectedRoutes>
            <Home></Home>
          </ProtectedRoutes>
        ></Route>

        <Route
          path="/followers"
          element=<ProtectedRoutes>
            <Followers></Followers>
          </ProtectedRoutes>
        ></Route>
        <Route
          path="/following"
          element=<ProtectedRoutes>
            <Following></Following>
          </ProtectedRoutes>
        ></Route>
        <Route
          path="/chat"
          element=<ProtectedRoutes skipLayout={true}>
            <Chat></Chat>
          </ProtectedRoutes>
        ></Route>
        <Route path="/profile/:username" element=<Profile></Profile>></Route>
        <Route path="/:username/post/:postId" element=<Post></Post>></Route>
        <Route
          path="/notifications"
          element=<ProtectedRoutes>
            <Notifications></Notifications>
          </ProtectedRoutes>
        ></Route>
      </Routes>
    </div>
  );
};

export default App;

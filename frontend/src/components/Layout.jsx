import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Suggesstions from "./Suggesstions";
import { useUser } from "../context/userContext";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingSpinner from "./LoadingSpinner";
import SearchUsers from "./SearchUsers";

const Layout = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  return (
    <div className=" h-full flex flex-col lg:flex-row   ">
      {/* Header appears only on small screens */}
      <header className="lg:hidden w-full flex items-center border-b-[1px] border-white/10 p-4 text-center text-white">
        <Header></Header>
      </header>

      {/* Sidebar (left) - Hidden on small screens */}
      <aside className="hidden lg:block   p-4 text-white border-r-2 border-white/10">
        <Sidebar></Sidebar>
      </aside>

      {/* Main content - Always visible */}
      <main className="w-full  p-4 text-white flex  justify-center">
        {children}
      </main>

      {/* Sidebar (right) - Hidden on small screens */}
      <aside className="hidden xl:block border-l-2 border-white/10  p-4 text-white">
        <SearchUsers isLink={true}></SearchUsers>
        <Suggesstions></Suggesstions>
      </aside>
    </div>
  );
};

export default Layout;

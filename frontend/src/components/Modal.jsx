import React from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={` 
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/60 " : "invisible"}
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-[#101010] rounded-xl shadow p-6 border border-white/20 transition-all 
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-center text-lg text-gray-600   hover:text-gray-400"
        >
          <IoMdClose className="bg-transparent cursor-pointer"></IoMdClose>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

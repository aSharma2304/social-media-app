import React from "react";
const Message = ({ message, isMine }) => {
  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 p-2 ${
          isMine ? "bg-blue-500 text-white" : "bg-white/85"
        }`}
      >
        <div className="text-sm">{message?.text}</div>
        <div
          className={`text-xs mt-1  ${
            isMine ? "text-blue-100 text-right" : " text-left text-gray-500"
          }`}
        >
          {new Date(message?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;

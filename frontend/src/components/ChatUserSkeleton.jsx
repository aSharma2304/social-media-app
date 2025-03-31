import React from "react";

const ChatUserCardSkeleton = () => {
  return (
    <div className="flex w-full items-center p-3 m-2 rounded-lg bg-white/20 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-white/30"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 w-2/3 bg-white/30 rounded mb-2"></div>
        <div className="h-3 w-1/3 bg-white/30 rounded"></div>
      </div>
    </div>
  );
};

export default ChatUserCardSkeleton;

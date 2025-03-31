const MessageSkeleton = ({ isMine }) => {
  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-lg p-3 animate-pulse bg-gray-300`}>
        <div className="h-4 w-32 bg-gray-400 rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;

import { Send } from "lucide-react";
import React from "react";

const MessageInput = ({
  message,
  setMessage,
  handleKeyPress,
  handleSendMessage,
}) => {
  return (
    <div className="p-4 border-t border-white/10 bg-[#181818] text-white">
      <div className="flex items-center space-x-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-3 border-white/10 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="1"
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-white/75 text-black rounded-full hover:bg-white/95 focus:outline-none "
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

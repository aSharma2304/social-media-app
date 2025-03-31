import React from "react";
import { CheckCheck } from "lucide-react";
const ChatUserCard = ({
  isOnline,
  contact,
  activeChatId,
  currUserId,
  setActiveChatId,
}) => {
  const otherUser = contact?.participants?.filter(
    (person) => person.id !== currUserId
  )[0];
  return (
    <div
      key={contact.id}
      onClick={() => {
        setActiveChatId(contact.id);
        // setMobileMenuVisible(false);
      }}
      className={`flex w-full items-center p-3 cursor-pointer m-2 rounded-lg hover:bg-white/10 ${
        activeChatId === contact.id ? "bg-white/15" : ""
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-medium">
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser?.fullname}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            otherUser?.fullname.charAt(0)
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>
      <div className="ml-3 flex-1 text-white/90">
        <div className="flex justify-between items-center">
          <span className="font-medium">{otherUser?.username}</span>
          <span className="text-xs text-zinc-500">
            {contact.lastMessage &&
              !isNaN(new Date(contact.lastMessage.createdAt)) &&
              new Date(contact.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-500 truncate flex space-x-2  max-w-[120px]">
            {currUserId === contact?.lastMessage?.userId ? (
              <CheckCheck className="size-4"></CheckCheck>
            ) : (
              ""
            )}
            {contact.lastMessage && contact?.lastMessage?.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatUserCard;

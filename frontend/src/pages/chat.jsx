import React, { useEffect, useRef, useState } from "react";
import { Search, Menu, Send, User, X } from "lucide-react";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import Header from "../components/Header";
import ChatUserCard from "../components/ChatUserCard";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import { useUser } from "../context/userContext";
import { PiChatSlash } from "react-icons/pi";
import ChatUserCardSkeleton from "../components/ChatUserSkeleton";
import MessageSkeleton from "../components/MessageSkeleton";
import SearchUsers from "../components/SearchUsers";
import { useSocket } from "../context/socketContext";

const ChatLayout = () => {
  const { user } = useUser();
  const { onlineUsers, socket } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [contacts, setContacts] = useState([]);

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

  const messageEndRef = useRef(null);

  const handleContactSelect = async (selectedUser) => {
    // here this function will be called when the  user searcher for a contact
    // and then the contact is selected and messages of that conversation is loaded;

    console.log("handleContactSelect got user ", selectedUser);
    const filteredContact = contacts.filter((contact) =>
      contact.participants.some(
        (participant) => participant.id === selectedUser.id
      )
    )[0];
    console.log("got conversationid ", filteredContact);

    if (filteredContact) {
      setActiveChatId(filteredContact.id);
      // try {
      //   const res = await axios.get(
      //     baseUrl + API_PATHS.message.GET_MESSAGES + "/" + filteredContact?.id,
      //     {
      //       withCredentials: true,
      //     }
      //   );
      //   const data = res.data;
      //   console.log("got back data of selected user conversation ", data);
      // } catch (err) {
      //   console.log("error while selected user chat loading", err);
      // }
    } else {
      console.log("conatacts has schema", contacts[0]);
      const newEntry = {
        id: contacts.length,
        lastMessage: null,
        participants: [
          {
            id: user?.id,
            username: user?.username,
            avatar: user?.avatar,
            fullname: user?.fullname,
          },
          {
            id: selectedUser?.id,
            username: selectedUser.username,
            avatar: selectedUser.avatar,
            fullname: selectedUser.fullname,
          },
        ],
      };
      contacts.push(newEntry);
      setActiveChatId(newEntry.id);
      setMessages([]);
    }
  };

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (activeChatId === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      setContacts((prev) => {
        const updatedConversations = prev.map((contact) => {
          if (message.conversationId === message.id) {
            return {
              ...contact,
              lastMessage: message,
            };
          }
          return contact;
        });
        return updatedConversations;
      });
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return;

      setMessagesLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${baseUrl}${API_PATHS.message.GET_MESSAGES}${activeChatId}`,
          { withCredentials: true }
        );
        // console.log("Got messages of this chat:", res.data);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();

    return () => {
      setMessages([]);
    };
  }, [activeChatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        setContactLoading(true);
        const res = await axios.get(
          baseUrl + API_PATHS.message.GET_CONVERSATIONS,
          {
            withCredentials: true,
          }
        );

        const conversations = res.data.conversations;
        console.log(res.data);
        setContacts(conversations);
      } catch (err) {
        console.log("error while getting conversations", err);
      } finally {
        setContactLoading(false);
      }
    };
    getConversations();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        userId: user?.id,
        text: message,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setContacts((prev) => {
        const updatedConversations = prev.map((contact) => {
          if (contact.id === activeChatId) {
            return {
              ...contact,
              lastMessage: newMessage,
            };
          }
          return contact;
        });
        return updatedConversations;
      });

      try {
        const activeContact = contacts?.filter(
          (contact) => contact.id === activeChatId
        )[0];
        // console.log("active contact ", activeContact);
        const receiverId = activeContact?.participants?.find(
          (participant) => participant.id !== user.id
        ).id;

        // console.log("receriverId got is ", receiverId);
        const res = await axios.post(
          baseUrl + API_PATHS.message.SEND_MESSAGE,
          {
            receiverId: receiverId,
            message: message,
          },
          {
            withCredentials: true,
          }
        );

        console.log(res.data);
      } catch (err) {
        console.log("error while sending new message", err);
      }
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const activeContact = contacts
    ?.find((contact) => contact?.id === activeChatId)
    ?.participants?.filter((participant) => participant?.id !== user?.id)[0];

  // console.log("current active contact is", activeContact);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 lg:w-[750px] xl:w-[850px]">
      <header className=" w-full flex items-center border-b-[1px] border-white/10 bg-[#111111] p-4 text-center text-white">
        <Header></Header>
      </header>

      <div className=" text-white md:hidden flex items-center justify-between p-4 h-12 bg-[#181818] border-b border-white/10">
        <button
          onClick={toggleMobileMenu}
          className="p-1 rounded-2xl hover:bg-white/10"
        >
          {!mobileMenuVisible ? <Menu size={20} /> : <X size={20}></X>}
        </button>
        {activeChatId && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {activeContact?.username?.charAt(0)}
            </div>
            <span className="font-medium">{activeContact?.username}</span>
          </div>
        )}
        <div className="w-6"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${
            mobileMenuVisible ? "block" : "hidden"
          } md:block absolute md:relative z-10 w-full md:w-1/3 max-w-xs bg-[#181818] border-r border-white/10 transition-opacity duration-300 flex flex-col h-full md:h-auto`}
        >
          <div className="px-4 pt-4 pb-2">
            {/* <input
              className="rounded-lg bg-white/15 text-white p-3 text-lg  w-full "
              placeholder="Search Followers"
            ></input> */}
            <SearchUsers
              isLink={false}
              onUserSelect={handleContactSelect}
            ></SearchUsers>
          </div>

          {/* Contacts list */}
          {/* <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center">
            {!contacts.length && (
              <p className="text-white mt-5 ">No convesations for now </p>
            )}
            {contacts.length &&
              contacts.map((contact) => (
                <ChatUserCard
                  currUserId={user?.id}
                  contact={contact}
                  activeChatId={activeChatId}
                  key={contact.id}
                  setActiveChatId={setActiveChatId}
                ></ChatUserCard>
              ))}
          </div> */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex-col flex  items-center sapce-y-2 ">
            {contactLoading ? (
              <>
                <ChatUserCardSkeleton />
                <ChatUserCardSkeleton />
                <ChatUserCardSkeleton />
              </>
            ) : contacts.length === 0 ? (
              <p className="text-white mt-5">No conversations for now</p>
            ) : (
              contacts.map((contact) => {
                const isOnline = contact?.participants.some(
                  (participant) =>
                    participant.id !== user?.id &&
                    onlineUsers.includes(participant.id)
                );

                return (
                  <ChatUserCard
                    isOnline={isOnline}
                    currUserId={user?.id}
                    contact={contact}
                    activeChatId={activeChatId}
                    key={contact.id}
                    setActiveChatId={setActiveChatId}
                  />
                );
              })
            )}
          </div>
        </div>

        {activeChatId ? (
          <div className="flex-1 flex flex-col">
            <div className="hidden md:flex items-center p-4 text-white bg-[#171717] border-b-2 border-white/10 ">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-medium">
                  {activeContact?.avatar ? (
                    <img
                      src={activeContact.avatar}
                      alt={activeContact?.fullname}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    activeContact?.fullname.charAt(0)
                  )}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.includes(activeContact?.id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div className="ml-3">
                <div className="font-medium">{activeContact?.username}</div>
                <div className="text-xs text-gray-500">
                  {onlineUsers.includes(activeContact?.id)
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </div>

            {/* <div className="flex-1 overflow-y-auto p-4 bg-[#171717]">
            {!messages && (
              <p className="text-white"> select a user to get messages</p>
            )}
            {messages &&
              messages?.map((message) => (
                <Message
                  message={message}
                  key={message.id}
                  isMine={message?.userId === user?.id}
                ></Message>
              ))}
          </div> */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#171717]">
              {messagesLoading ? (
                <>
                  <MessageSkeleton isMine={false} />
                  <MessageSkeleton isMine={true} />
                  <MessageSkeleton isMine={false} />
                  <MessageSkeleton isMine={true} />
                  <MessageSkeleton isMine={true} />
                  <MessageSkeleton isMine={false} />
                </>
              ) : !messages ? (
                <p className="text-white/50">Select a user to get messages</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    ref={
                      messages.length - 1 === messages.indexOf(message)
                        ? messageEndRef
                        : null
                    }
                  >
                    <Message
                      message={message}
                      isMine={message?.userId === user?.id}
                    />
                  </div>
                ))
              )}
            </div>

            <MessageInput
              message={message}
              setMessage={setMessage}
              handleKeyPress={handleKeyPress}
              handleSendMessage={handleSendMessage}
            ></MessageInput>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center bg-[#171717]  text-white/50 ">
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;

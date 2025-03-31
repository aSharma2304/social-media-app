import { useEffect, useState } from "react";
import { SocketContext } from "./socketContext";
import { useUser } from "./userContext";
import io from "socket.io-client";

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const socket = io("http://localhost:5050", {
      query: {
        userId: user?.id,
      },
    });
    setSocket(socket);

    socket.on("getOnlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    //clean up
    return () => {
      socket && socket.close();
    };
  }, [user]);

  console.log("got online users ", onlineUsers);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;

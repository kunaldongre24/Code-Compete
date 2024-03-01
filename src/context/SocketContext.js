import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";
import ENDPOINT from "../constant/Endpoint";

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const [userContext] = useContext(AuthContext); // Destructure the useContext result

  const [socket, setSocket] = useState(null); // Use state to manage the socket connection
  useEffect(() => {
    if (socket) {
      const intervalId = setInterval(() => {
        socket.emit("ping");
      }, 30000); // Send a ping every 30 seconds

      // Listen for the "pong" event from the server
      socket.on("pong", () => {});

      return () => {
        clearInterval(intervalId); // Clean up the interval on unmount
      };
    }
  }, [socket]);
  useEffect(() => {
    // Create a new socket connection when the user context changes
    if (userContext.token) {
      const newSocket = io(ENDPOINT, {
        transports: ["websocket", "polling"],
        auth: { token: userContext.token },
        reconnection: true,
        reconnectionAttempts: 1000,
      });
      setSocket(newSocket);

      // Clean up function to disconnect the socket when the component unmounts
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userContext]); // Trigger effect when user context changes

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };

import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { ipAdress } from "../config";

const useChat = (chatId, messagesHistory) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(ipAdress + ":5001");

    socketRef.current.on("connect", function () {
      socketRef.current.emit("join", chatId);
      console.log(chatId);
      setMessages((messages) => [...messages, ...messagesHistory]);
    });

    socketRef.current.on("newChatMessage", ({ message }) => {
      setMessages((messages) => [...messages, { message }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = ({ message }) => {
    socketRef.current.emit("newChatMessage", { message });
    setMessages((messages) => [...messages, { message }]);
  };

  return { messages, sendMessage };
};

export default useChat;

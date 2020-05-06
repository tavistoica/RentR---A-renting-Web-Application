import React, { Component, useState } from "react";
import socketIOClient from "socket.io-client";
import MessageBox from "./MessageBox";
import Messages from "./Messages";
import useChat from "./_useChat";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

import Axios from "axios";
import { ipAdress } from "../config";

const Chat = loggedUser => {
  const { messages, sendMessage } = useChat(
    loggedUser.chatId,
    loggedUser.messagesHistory
  );
  const target = {
    avatar: loggedUser.currentAvatar,
    username: loggedUser.currentUsername,
    id: loggedUser.currentId
  };
  const logged = {
    avatar: loggedUser.loggedAvatar,
    username: loggedUser.loggedUsername,
    id: loggedUser.loggedId
  };

  //messages = loggedUser.messagesHistory;

  console.log(loggedUser.chatId);

  return (
    // <div className="fixed-bottom m-5 border border-primary overflow-auto"></div>
    <div style={{ maxHeight: "80vh", minHeight: "80vh" }}>
      <div className="row justify-content-center p-3 bg-primary">
        <Link to={"/viewUser/" + target.id}>
          <Avatar src={target.avatar} style={{ height: "6vh", width: "6vh" }} />
        </Link>
        <Link to={"/viewUser/" + target.id}>
          <h3 className="pl-3 text-white">{target.username}</h3>
        </Link>
      </div>

      <Messages
        messages={messages}
        logged={logged}
        target={target}
        messagesHistory={loggedUser.messagesHistory}
      />

      <MessageBox
        onSendMessage={message => {
          sendMessage({ message });
        }}
        logged={logged}
        target={target}
        chatId={loggedUser.chatId}
      />
    </div>
  );
};

export default Chat;

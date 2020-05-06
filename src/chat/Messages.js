import React from "react";

import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function getUser(message, logged, target) {
  //console.log(message);
  if (message.message.name == logged.username) {
    return logged;
  } else {
    return target;
  }
}

// let scrollToBottom = messagesEnd => {
//   messagesEnd.current.scrollIntoView({ behavior: "smooth" });
// };

const Messages = ({ messages, logged, target, messagesHistory }) => {
  console.log(messages);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Paper style={{ minHeight: "40vh", overflow: "auto", maxHeight: "40vh" }}>
      <List>
        {messages.flatMap((message, index) => [
          <ListItem key={index}>
            <ListItemAvatar>
              <Link to={"/viewUser/" + getUser(message, logged, target).id}>
                <Avatar src={getUser(message, logged, target).avatar} />
              </Link>
            </ListItemAvatar>
            <ListItemText>{message.message.message}</ListItemText>
          </ListItem>,
          <Divider component="li" key={"divider-" + index} variant="inset" />
        ])}
        <div ref={messagesEndRef} />
      </List>
    </Paper>
  );
};

export default Messages;

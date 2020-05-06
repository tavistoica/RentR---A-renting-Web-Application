import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

const MessageBox = ({
  onSendMessage,
  onEnterMessage,
  logged,
  target,
  chatId
}) => {
  const [message, setMessage] = useState({
    message: ""
  });
  return (
    <TextField
      id="standard-basic"
      label="message"
      multiline
      name="message"
      rows="4"
      fullWidth
      onChange={e => {
        setMessage({
          ...message,
          [e.target.name]: e.target.value,
          user1_id: logged.id,
          user2_id: target.id,
          chatId: chatId,
          name: logged.username
        });
      }}
      onKeyDown={e => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSendMessage(message);
          console.log(message);
          setMessage({
            message: "",
            user1_id: "",
            user2_id: "",
            chatId: "",
            name: ""
          });
        }
      }}
      value={message.message}
    />
  );
};

export default MessageBox;

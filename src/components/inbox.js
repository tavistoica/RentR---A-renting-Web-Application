import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import ChatList from "../chat/ChatList";
import ChatRoom from "../chat/ChatRoom";

class Inbox extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
    console.log(props);
  }
  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="float-left">
            <ChatList />
          </div>
          {/* <ChatRoom /> */}
        </div>
      </>
    );
  }
}

export default Inbox;

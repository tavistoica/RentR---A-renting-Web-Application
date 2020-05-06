import React, { Component } from "react";
import Axios from "axios";
import { ipAdress } from "../config";
import Chat from "./Chat";
import ChatList from "./ChatList";

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser_id: this.props.match.params.id,
      loggedUser_id: "",
      currentUser_name: "",
      currentUser_avatar: "",
      loggedUser_name: "",
      loggedUser_avatar: "",
      loading1: true,
      loading2: true,
      loading3: true,
      roomId: "",
      messagesHistory: {},
    };
  }

  async componentDidMount() {
    try {
      const jwtToken = localStorage.getItem("JWT_TOKEN");
      Axios.defaults.headers.common["Authorization"] = jwtToken;
      await Axios.get(
        ipAdress + ":5001/users/profile/" + this.state.currentUser_id
      ).then((Response) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            currentUser_name: Response.data.user.lastName,
            currentUser_avatar: Response.data.user.avatar,
            loading1: false,
          };
        });
      });
      //Axios.defaults.headers.common["Authorization"] = jwtToken;
      await Axios.get(ipAdress + ":5001/users/profile/").then((Response) => {
        this.setState({
          loggedUser_name: Response.data.response.lastName,
          loggedUser_avatar: Response.data.response.avatar,
          loggedUser_id: Response.data.response._id,
          loading2: false,
        });
        this.state.roomId = this.GenerateRoomId(
          this.state.currentUser_id,
          this.state.loggedUser_id
        );
        console.log(this.state.roomId);
      });
      await Axios.get(ipAdress + ":5001/messages/" + this.state.roomId)
        .then((Response) => {
          this.setState({
            messagesHistory: Response.data,
            loading3: false,
          });
        })
        .catch(() => {
          this.setState({
            messagesHistory: [],
            loading3: false,
          });
        });
    } catch (e) {
      console.log(e);
    }
  }

  hashStringArray(array) {
    var code = 0;
    for (var i = 0; i < array.length; i++) {
      var n = 0;
      for (var j = 0; j < array[i].length; j++) {
        n = (n * 251) ^ array[i].charCodeAt(j);
      }
      code ^= n;
    }
    return code;
  }

  GenerateRoomId(logged, target) {
    const arr = [logged, target];
    console.log(logged);
    console.log(target);

    const hashed = this.hashStringArray(arr);
    console.log(hashed);
    Axios.get(ipAdress + ":5001/messages/checkMessage/" + hashed).then(
      (Response) => {
        if (!Response.data) {
          const arr = [target, logged];
          this.hashed = this.hashStringArray(arr);
          console.log(hashed);
        }
      }
    );

    return hashed;
  }

  callbackFunction = (id, avatar, name) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        currentUser_avatar: avatar,
        currentUser_id: id,
        currentUser_name: name,
      };
    });
  };

  renderChat() {
    return (
      <div className="row justify-content-start">
        <div className="col-2">
          <ChatList
            callbackFunction={this.callbackFunction}
            currentId={this.state.loggedUser_id}
          />
        </div>
        <div className="col-7">
          <Chat
            chatId={this.state.roomId}
            currentUsername={this.state.currentUser_name}
            currentAvatar={this.state.currentUser_avatar}
            currentId={this.state.currentUser_id}
            loggedUsername={this.state.loggedUser_name}
            loggedAvatar={this.state.loggedUser_avatar}
            loggedId={this.state.loggedUser_id}
            messagesHistory={this.state.messagesHistory}
          />
        </div>
      </div>
    );
  }

  isLoaded() {
    if (!this.state.loading1 && !this.state.loading2 && !this.state.loading3)
      return true;
    return false;
  }

  render() {
    let sameUser = false;
    if (!this.state.loading1 && !this.state.loading2) {
      if (this.state.currentUser_name === this.state.loggedUser_name) {
        sameUser = true;
      } else {
        sameUser = false;
      }
    }
    return (
      <div className="container-fluid">
        {this.isLoaded() ? this.renderChat() : "loading"}
        {/* {!sameUser
           ? this.renderChat()
           : window.location.replace(ipAdress + ":3000/")} */}
      </div>
    );
  }
}

export default Chatroom;

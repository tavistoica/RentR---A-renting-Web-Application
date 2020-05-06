import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import Axios from "axios";
import { ipAdress } from "../config";

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      userAvatarList: [],
      userNameList: [],
      loading: true,
    };
    console.log(props);
    this.routeChange = this.routeChange.bind(this);
  }

  async componentDidMount() {
    Axios.defaults.headers.common["Authorization"] = this.props.jwtToken;
    await Axios.get(
      ipAdress + ":5001/chatlist/get/" + this.props.currentId
    ).then((Response) => {
      this.state.userList = Response.data;
    });
    for (const item of this.state.userList) {
      const jwtToken = localStorage.getItem("JWT_TOKEN");
      Axios.defaults.headers.common["Authorization"] = jwtToken;
      await Axios.get(ipAdress + ":5001/users/profile/" + item).then(
        (Response) => {
          this.state.userAvatarList.push(Response.data.user.avatar);
          this.state.userNameList.push(Response.data.user.lastName);
        }
      );
    }
    this.setState({ loading: false });
  }

  routeChange() {
    window.location.reload(false);
  }

  renderList() {
    let users = [];
    for (let i = 0; i < this.state.userList.length; i++) {
      const id = this.state.userList[i];
      const avatar = this.state.userAvatarList[i];
      const name = this.state.userNameList[i];
      users[i] = { user: { id, avatar, name } };
    }
    console.log(users);
    return (
      <>
        <div className="row justify-content-center p-3 ">
          <h3>Contacts</h3>
        </div>
        <Paper style={{ overflow: "auto" }}>
          <List>
            {users.flatMap((user, index) => [
              <Link
                onClick={() =>
                  this.props.callbackFunction(
                    user.user.id,
                    user.user.avatar,
                    user.user.name
                  )
                }
              >
                {/* // to={"/messenger/" + user.user.id}
                // onClick={this.routeChange}
                // > */}
                ,
                <ListItem alignItems="flex-start" key={index}>
                  <ListItemAvatar>
                    <Avatar src={user.user.avatar} />
                  </ListItemAvatar>
                  <ListItemText>{user.user.name}</ListItemText>
                </ListItem>
                ,
              </Link>,
            ])}
          </List>
        </Paper>
      </>
    );
  }

  render() {
    return <>{!this.state.loading ? this.renderList() : "loading"}</>;
  }
}

export default ChatList;

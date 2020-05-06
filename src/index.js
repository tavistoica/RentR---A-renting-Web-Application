import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import "bootstrap/dist/css/bootstrap.css";
import reducers from "./reducers";
import App from "./pages/App";
import reduxThunk from "redux-thunk";
import Axios from "axios";
import Homepage from "./components/homepage";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import authGuard from "./components/authGuard";
import Profile from "./components/profile";
import "rsuite/dist/styles/rsuite-default.css";
import ChangeEmail from "./components/changeEmail";
import changePassword from "./components/changePassword";
import ChangeProfile from "./components/editProfile";
import CreatePost from "./components/createPost";
import PostPage from "./components/PostPage";
import ChangeAvatar from "./components/changeAvatar";
import EditPost from "./components/editPost";
import Chatroom from "./chat/ChatRoom";
import "./main.scss";
import ViewProfile from "./components/viewProfile";
import Inbox from "./components/inbox";
const jwtToken = localStorage.getItem("JWT_TOKEN");
Axios.defaults.headers.common["authorization"] = jwtToken;

render(
  <Provider
    store={createStore(
      reducers,
      {
        auth: {
          token: jwtToken,
          isAuthenticated: jwtToken ? true : false,
        },
      },
      applyMiddleware(reduxThunk)
    )}
  >
    <BrowserRouter>
      <App>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/profile" component={authGuard(Profile)} />
        <Route exact path="/editEmail" component={authGuard(ChangeEmail)} />
        <Route exact path="/editProfile" component={authGuard(ChangeProfile)} />
        <Route exact path="/editAvatar" component={authGuard(ChangeAvatar)} />
        <Route exact path="/editPost/:id" component={authGuard(EditPost)} />
        <Route exact path="/messenger/:id" component={authGuard(Chatroom)} />
        <Route exact path="/viewUser/:id" component={ViewProfile} />
        <Route
          exact
          path="/editPassword"
          component={authGuard(changePassword)}
        />
        <Route exact path="/post/:id" component={PostPage} />
        <Route exact path="/createPost" component={authGuard(CreatePost)} />
        <Route exact path="/inbox" component={authGuard(Inbox)} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector("#root")
);

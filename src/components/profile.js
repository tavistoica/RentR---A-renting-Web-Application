import React, { Component } from "react";
import Axios from "axios";
import CustomInput from "./customInput";
import { reduxForm, Field } from "redux-form";
import * as actions from "../actions";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { compose } from "redux";
import ProfileSidebar from "./profileSideMenu";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { ipAdress } from "../config";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCred: {
        firstName: "",
        lastName: "",
      },
      posts: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    Axios.get(ipAdress + ":5001/post/getPost").then((Response) => {
      this.setState({ posts: Response.data.posts });
      console.log(Response.data.posts);
    });
  }

  componentWillUnmount() {
    this.state.posts = {};
  }

  async onSubmit(formData) {
    await this.props.deletePost(formData);
    this.componentDidMount();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  routeChange = (id) => {
    if (!this.props.errorMessage) {
      this.props.history.push("/editPost/" + id);
    }
  };

  renderPosts() {
    // const displayPosts = this.state.posts;
    if (this.state.posts.length === 0) {
      return (
        <div className="row justify-content-center mt-5">
          <h2 style={{ color: "grey" }}>No posts to show!</h2>
        </div>
      );
    }
    let x = this.state.posts.map((n) => {
      let $imagePreview = <img src={n.photoBase64} className="img-fluid" />;
      return (
        <div className="row border border-3 justify-content-end m-3">
          <div className="col-md-3 col-sm-5 col-xs-3">{$imagePreview}</div>
          <div className="col-md-4 col-sm-7 col-xs-4 pt-3">
            <Link to={"/post/" + n._id} style={{ textDecoration: "none" }}>
              <h4 align="center">
                <div className="d-inline-block">
                  <MeetingRoomIcon fontSize="default" />
                  {n.rooms + " room/s"}
                </div>
                <div className="d-inline-block pl-3">
                  <OpenWithIcon fontSize="large" />
                  {n.size + " m"}
                  <sup>2</sup>
                </div>
              </h4>
              <p align="center">{n.location}</p>
              <div align="center">
                <h3 className="d-inline-block pl-3">{n.price + "€"}</h3>
                <h5 className="d-inline-block pl-3">/month</h5>
              </div>
            </Link>
          </div>
          <div className="col-5 m-auto">
            <Button
              onClick={() => {
                this.routeChange(n._id);
              }}
              className="mr-3 "
            >
              edit
            </Button>
            <Button
              onClick={() => {
                this.onSubmit(n._id);
              }}
              style={{ backgroundColor: "#d10606" }}
            >
              delete
            </Button>
          </div>
        </div>
      );
    });
    return x;
  }

  renderContent() {
    if (isMobile) {
      return this.renderPosts();
    } else {
      return (
        <div className="row">
          <div className="col-3 profile-menu">
            <ProfileSidebar />
          </div>
          <div className="col-9 ">
            <div className="container">{this.renderPosts()}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="container-fluid">{this.renderContent()}</div>;
  }
}

function MapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}

export default compose(
  connect(MapStateToProps, actions),
  reduxForm({ form: "editUser" })
)(Profile);

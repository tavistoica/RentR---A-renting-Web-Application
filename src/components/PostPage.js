import React, { Component } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ExampleComponent from "react-rounded-image";
import { ipAdress } from "../config";
import Skeleton from "react-loading-skeleton";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import MapContainer from "./mapContainer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.id,
      post: {},
      user: {},
      loading: true,
    };
    this.routeChange = this.routeChange.bind(this);
  }

  routeChange() {
    let path = "/messenger/" + this.state.post.user;
    this.props.history.push(path);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  refreshPage() {
    window.location.reload(false);
  }

  refreshPost = (res) => {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    console.log(this.state.postId);
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    Axios.get(ipAdress + ":5001/post/" + this.state.postId).then((Response) => {
      this.setState({ post: Response.data.foundPost, loading: false });
      console.log(Response.data.foundPost);
      this.getUser(Response.data.foundPost.user);
    });
  };

  getUser = (userId) => {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    Axios.get(ipAdress + ":5001/users/profile/" + userId).then((Response) => {
      this.setState({ user: Response.data.user });
      console.log(Response.data.user);
    });
  };

  async componentDidMount() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    console.log(this.state.postId);
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    Axios.get(ipAdress + ":5001/post/" + this.state.postId).then((Response) => {
      this.setState({ post: Response.data.foundPost, loading: false });
      console.log(Response.data.foundPost);
      this.getUser(Response.data.foundPost.user);
    });
  }

  renderPost() {
    // this.refreshPost();
    let $imagePreview = null;
    let $avatarPreview = null;
    $imagePreview = <img src={this.state.post.photoBase64} width="25%" />;
    $avatarPreview = (
      <Image src={this.state.user.avatar} width="60" roundedCircle />
    );
    let marker = {
      lng: this.state.post.longitude,
      lat: this.state.post.latitude,
    };
    console.log(marker);
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
    };
    return (
      <div className="container-fluid">
        <div
          className="row justify-content-center m-2 p-2 pt-3 text-center h-25"
          key={this.state.post._id}
        >
          <div>
            <Slider {...settings}>
              <div>
                <img
                  src={this.state.post.photoBase64}
                  width="100%"
                  // width="25%"
                />
              </div>
              <div>
                <img
                  src={this.state.post.photoBase64}
                  width="100%"
                  // width="25%"
                />
              </div>
              <div>
                <img
                  src={this.state.post.photoBase64}
                  width="100%"
                  // width="25%"
                />
              </div>
            </Slider>
          </div>
          {/* <AliceCarousel
            mouseTrackingEnabled
            buttonsDisabled
            touchTrackingEnabled
          >
            <img
              src={this.state.post.photoBase64}
              onDragStart={handleOnDragStart}
              width="25%"
            />
            <img
              src={this.state.post.photoBase64}
              onDragStart={handleOnDragStart}
              width="25%"
            />
            <img
              src={this.state.post.photoBase64}
              onDragStart={handleOnDragStart}
              width="25%"
            />
          </AliceCarousel> */}
        </div>
        <h2 className="row justify-content-center p-2 pt-3 border">
          <div className="col-5" align="center">
            <h4>
              <OpenWithIcon fontSize="large" />
              {this.state.post.size + "m"}
              <sup>2</sup>
            </h4>
          </div>
          <div className="col-5" align="center">
            <h4>
              <MeetingRoomIcon fontSize="large" />
              {this.state.post.rooms + " room/s"}
            </h4>
          </div>
        </h2>
        <div className="row justify-content-center p-2 pt-3 border">
          <h3>{this.state.post.price + "€"}</h3>
          <h5>/month</h5>
        </div>
        <div className="row justify-content-center p-2 pt-3 border">
          <h4>{this.state.post.location}</h4>
        </div>
        <MapContainer coords={marker} zoom={18} markers={[marker]} />
        <div className="row justify-content-center p-2 pt-3">
          <div className="p-2 pt-3">
            <Button onClick={this.routeChange}>Message</Button>
          </div>
          <div className="p-2">
            <Link to={"/viewUser/" + this.state.post.user}>
              {$avatarPreview}
            </Link>
            <Link to={"/viewUser/" + this.state.post.user}>
              <h5>
                {this.state.user.firstName} {this.state.user.lastName}
              </h5>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  renderSkeleton() {
    return (
      <div className="container-fluid">
        <div
          className="row justify-content-center m-2 p-2 pt-3"
          key={this.state.post._id}
        >
          <Skeleton square={true} height={200} width={200} />
        </div>
        <h2 className="row justify-content-center  p-2 pt-3 border">
          <Skeleton />
        </h2>
        <div className="row justify-content-center p-2 pt-3 border">
          <h3>
            <Skeleton /> {" €"}
          </h3>
        </div>
        <div className="row justify-content-center p-2 pt-3 border">
          <Skeleton />
        </div>
        <div className="row justify-content-center m-2 p-2 pt-3">
          <div className="col-3">
            <Skeleton circle={true} height={50} width={50} />
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>{this.state.loading ? this.renderSkeleton() : this.renderPost()}</>
    );
  }
}

function MapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}

export default PostPage;

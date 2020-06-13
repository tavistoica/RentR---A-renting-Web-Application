import React, { Component } from "react";
// import RegisterPart from "./registerPart";
import Axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SortBar from "./sortBar";
import ReactPaginate from "react-paginate";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import SearchComponent from "./searchComponent";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import MapContainer from "./mapContainer";
import InfiniteScroll from "react-infinite-scroller";
const { ipAdress } = require("../config");

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      offset: 0,
      posts: [],
      elements: [],
      elementsSkeleton: [],
      perPage: 5,
      currentPage: 0,
      pageCount: null,
      longitude: null,
      latitude: null,
      markers: [],
      hasMoreItems: true,
      startOffset: 0,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  loadPosts = (page) => {
    const ip_now = ipAdress + ":5001";
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    Axios.post(ip_now + "/post/allPosts", {
      startOffset: this.state.startOffset,
    }).then((Response) => {
      if (Response.data.posts.length > 0)
        this.setState(
          {
            posts: [...this.state.posts, ...Response.data.posts],
            //posts: this.state.posts.push(Response.data.posts)
            startOffset: this.state.startOffset + 10,
          },
          () => {
            this.renderPosts();
          }
        );
      else
        this.setState({
          hasMoreItems: false,
        });
    });
  };

  async componentDidMount() {
    const ip_now = ipAdress + ":5001";
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    this.loadPosts(jwtToken, ip_now);
    await Axios.get("https://ipapi.co/json/").then((Response) => {
      this.setState({
        latitude: Response.data.latitude,
        longitude: Response.data.longitude,
      });
    });
    await Axios.post(ip_now + "/post/LocationBasedPosts", {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }).then(
      (Response) => {
        let LatLngMarkers = [];
        Response.data.posts.forEach((element) => {
          LatLngMarkers.push({
            lat: parseFloat(element.latitude),
            lng: parseFloat(element.longitude),
            _id: element._id,
          });
        });
        this.setState({ markers: LatLngMarkers, loading: false });
        console.log(LatLngMarkers);
      },
      (error) => {
        console.log(error);
        this.setState({ markers: [], loading: false });
      }
    );
  }

  // handlePageClick = () => {
  //   this.setState(
  //     {
  //       startOffset: this.state.startOffset + 10,
  //     },
  //     () => {
  //       this.loadPosts();
  //     }
  //   );
  // };

  renderPosts() {
    let x = this.state.posts.slice(0, this.state.posts.length).map((n) => {
      let $imagePreview = <img src={n.photoBase64} className="img-fluid" />;
      return (
        <Link to={"/post/" + n._id} style={{ textDecoration: "none" }}>
          <div
            className="row border border-2 justify-content-center m-3"
            key={n._id}
          >
            <div className="col-md-3 col-sm-5 col-xs-3">{$imagePreview}</div>
            <div className="col-md-4 col-sm-7 col-xs-4 pt-3">
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
            </div>
          </div>
        </Link>
      );
    });
    this.setState({ elements: x });
  }

  renderSkeleton() {
    return (
      <>
        <div className="row border border-2 justify-content-center m-3">
          <div className="col-md-3 col-sm-5 ">
            <Skeleton square={true} height={200} width={200} />
          </div>
          <div className="col-md-4 col-sm-7">
            <h3>
              <Skeleton />
            </h3>
            <p>
              <Skeleton />
            </p>
          </div>
        </div>
        <div className="row border border-2 justify-content-center m-3">
          <div className="col-md-3 col-sm-5 ">
            <Skeleton square={true} height={200} width={200} />
          </div>
          <div className="col-md-4 col-sm-7">
            <h3>
              <Skeleton />
            </h3>
            <p>
              <Skeleton />
            </p>
          </div>
        </div>
        <div className="row border border-2 justify-content-center m-3">
          <div className="col-md-3 col-sm-5 ">
            <Skeleton square={true} height={200} width={200} />
          </div>
          <div className="col-md-4 col-sm-7">
            <h3>
              <Skeleton />
            </h3>
            <p>
              <Skeleton />
            </p>
          </div>
        </div>
      </>
    );
  }

  renderElments() {
    let coords = { lat: this.state.latitude, lng: this.state.longitude };
    let coords2 = {
      lat: this.state.latitude - 0.5,
      lng: this.state.longitude - 0.5,
    };
    const loader = <div className="loader">Loading ...</div>;
    return (
      <div className="row">
        <div className="contentContainer col-7">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadPosts.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={loader}
            useWindow={true}
          >
            <div className="posts">{this.state.elements}</div>
          </InfiniteScroll>
        </div>
        <div className="mapContainer col-5 ">
          <MapContainer
            coords={coords}
            zoom={14}
            markers={this.state.markers}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="mr-0 pl-0 pr-0">
          <SortBar />
          {this.state.loading ? this.renderSkeleton() : this.renderElments()}
        </div>
      </>
    );
  }
}

export default Homepage;

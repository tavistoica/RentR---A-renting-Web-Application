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
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const ip_now = ipAdress + ":5001";
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    await Axios.get(ip_now + "/post/allPosts").then((Response) => {
      this.setState(
        {
          posts: Response.data.posts,
          pageCount: Math.ceil(Response.data.posts.length / this.state.perPage),
        },
        () => this.renderPosts()
      );
    });
    await Axios.get("https://ipapi.co/json/").then((Response) => {
      this.setState({
        latitude: Response.data.latitude,
        longitude: Response.data.longitude,
      });
    });
    await Axios.post(ip_now + "/post/LocationBasedPosts", {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }).then((Response) => {
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
    });
  }

  handlePageClick = (data) => {
    const selectedPage = 1;
    const offset = selectedPage * this.state.perPage;
    this.setState(
      {
        currentPage: this.state.currentPage + 1,
        offset: this.state.offset + this.state.perPage,
      },
      () => {
        this.renderPosts();
      }
    );
  };

  // setElementsForCurrentPage() {
  //   let elements = this.state.posts
  //     .slice(this.state.offset, this.state.offset + this.state.perPage)
  //     .map(post => <img src="{post.thumburl}" />);
  //   this.setState({ elements: elements });
  // }

  renderPosts() {
    let x = this.state.posts
      .slice(0, this.state.offset + this.state.perPage)
      // .reverse()
      .map((n) => {
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
    let paginationElement;
    if (this.state.currentPage < this.state.pageCount) {
      paginationElement = (
        <div className="row justify-content-center m-3">
          <Button className="col-5" onClick={this.handlePageClick}>
            Load More
          </Button>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="contentContainer col-7 ">
          {this.state.elements}
          {paginationElement}
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
          {this.state.loading ? this.renderSkeleton() : this.renderElments()}
        </div>
      </>
    );
  }
}

export default Homepage;

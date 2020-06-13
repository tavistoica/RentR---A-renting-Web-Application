import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginPopup from "./loginPopup";
import * as actions from "../actions";
import CheeseburgerMenu from "cheeseburger-menu";
import HamburgerMenu from "react-hamburger-menu";
import ProfileSidebar from "./profileSideMenu";
import { isMobile } from "react-device-detect";
import { ipAdress, defaultAvatar } from "../config";
import Axios from "axios";
import ExampleComponent from "react-rounded-image";
import Image from "react-bootstrap/Image";
import { Dropdown, Menu } from "semantic-ui-react";
import InboxIcon from "@material-ui/icons/Inbox";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import SortBar from "./sortBar";
import Search from "./search";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      avatar: "",
      firstName: "",
      lastName: "",
      query: "",
    };
    this.signOut = this.signOut.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.logged = this.logged.bind(this);
    this.inboxRedirect = this.inboxRedirect.bind(this);
  }

  async logged() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    try {
      const response = await Axios.get(ipAdress + ":5001/users/avatar");
      this.setState({
        avatar: response.data.avatar,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
      });
    } catch (e) {
      this.setState({
        avatar: defaultAvatar,
      });
      console.log(e);
    }
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value,
    });
  };

  async componentDidMount() {
    if (this.props.isAuth) this.logged();
  }

  inboxRedirect() {
    window.location.replace(ipAdress + ":3000/inbox");
  }

  openMenu() {
    this.setState({ menuOpen: true });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
    console.log(this.state.menuOpen);
  }

  signOut() {
    console.log(this.props);
    this.props.SignOut();
  }

  renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => (
    <div className="autocomplete-root">
      <input {...getInputProps()} />
      <div className="autocomplete-dropdown-container">
        {<div>Loading...</div>}
        {suggestions.map((suggestion) => (
          <div {...getSuggestionItemProps(suggestion)}>
            <span>{suggestion.description}</span>
          </div>
        ))}
      </div>
    </div>
  );

  menuRenderer() {
    let $avatarPreview = null;
    $avatarPreview = (
      <div className="custom-file-upload">
        <Image
          src={this.state.avatar}
          width="50vh"
          height="50vh"
          roundedCircle
        />
      </div>
    );
    const trigger = (
      <span style={{ color: "white" }}>
        <div className="custom-file-upload mr-2">
          <Image
            avatar
            src={this.state.avatar}
            width="40vh"
            height="40vh"
            roundedCircle
          />
        </div>
        {this.state.firstName + " " + this.state.lastName}
      </span>
    );
    const options = [
      {
        key: "profile",
        icon: "user",
        text: "profile",
        value: "profile",
        href: "/profile",
      },
      {
        key: "logout",
        icon: "sign out",
        text: "logout",
        value: "logout",
        onClick: this.signOut,
      },
    ];
    if (isMobile) {
      return (
        <>
          <CheeseburgerMenu
            isOpen={this.state.menuOpen}
            closeCallback={this.closeMenu.bind(this)}
          >
            <div className="row justify-content-start">
              <div className="col-8 p-3">
                <Link to="/" onClick={this.closeMenu}>
                  <h3 className="row justify-content-center">RentR</h3>
                </Link>
              </div>
              <div className="col-2 p-3 float-left">
                <HamburgerMenu
                  isOpen={this.state.menuOpen}
                  menuClicked={this.closeMenu.bind(this)}
                  width={32}
                  height={24}
                  strokeWidth={3}
                  rotate={0}
                  color="black"
                  borderRadius={0}
                  animationDuration={0.5}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <ProfileSidebar
                isOpen={this.state.menuOpen}
                closeCallback={this.closeMenu.bind(this)}
              />
            </div>
          </CheeseburgerMenu>
          <HamburgerMenu
            isOpen={this.state.menuOpen}
            menuClicked={this.openMenu.bind(this)}
            width={32}
            height={24}
            strokeWidth={3}
            rotate={0}
            color="white"
            borderRadius={0}
            animationDuration={0.5}
          />
        </>
      );
    } else {
      return (
        <>
          <Link class="navbar-brand col-1" to="/" style={{ color: "white" }}>
            RentR
          </Link>
          <Search
            value={this.state.value}
            onChange={(value) => this.setState({ value })}
          >
            {this.renderFunc}
          </Search>
          <ul className="nav navbar-nav navbar-right col-1">
            <li>
              {!this.props.isAuth ? (
                <>
                  <Link
                    className="nav-link"
                    to="/signin"
                    style={{ color: "white" }}
                  >
                    Login
                  </Link>
                </>
              ) : null}
              {this.props.isAuth ? (
                <div className="row justify-content-center pr-3">
                  <IconButton
                    size="medium"
                    color="secondary"
                    onClick={this.inboxRedirect}
                  >
                    <InboxIcon>Inbox</InboxIcon>
                  </IconButton>
                  <Divider orientation="vertical" flexItem />
                  <Dropdown
                    trigger={trigger}
                    options={options}
                    pointing="top right"
                    floating
                    icon={null}
                  />
                </div>
              ) : null}
            </li>
          </ul>
        </>
      );
    }
  }

  render() {
    return (
      <div className="sticky-top">
        <nav
          className="navbar navbar-light bg-dark container-fluid"
          style={{ backgroundColor: "#48a832" }}
        >
          {this.menuRenderer()}
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, actions)(Header);

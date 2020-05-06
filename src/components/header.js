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

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      avatar: "",
      firstName: "",
    };
    this.signOut = this.signOut.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.logged = this.logged.bind(this);
    this.unlogged = this.unlogged.bind(this);
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
      });
    } catch (e) {
      this.setState({
        avatar: defaultAvatar,
      });
      console.log(e);
    }
  }

  async unlogged() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    try {
      const response = await Axios.get(ipAdress + ":5001/users/avatar");
      this.setState({
        firstName: response.data.firstName,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    if (this.props.isAuth) {
      this.logged();
    } else {
      this.unlogged();
    }
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
    const options = [
      {
        key: "profile",
        icon: "address card",
        text: "profile",
        value: "profile",
        href: "/profile",
      },
      {
        key: "logout",
        icon: "logout",
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
          <div className="nav navbar-nav">
            <Link to="/" style={{ color: "white", fontSize: 30 }}>
              RentR
            </Link>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              {!this.props.isAuth ? (
                <>
                  {/* <LoginPopup {...this.props} /> */}
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
                <div className="row justify-content-center">
                  <IconButton
                    size="medium"
                    color="secondary"
                    onClick={this.inboxRedirect}
                  >
                    <InboxIcon>Inbox</InboxIcon>
                  </IconButton>
                  <Divider orientation="vertical" flexItem />
                  <Dropdown
                    icon={$avatarPreview}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile" icon="address card">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.signOut} icon="logout">
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
          className="navbar navbar-inverse "
          style={{ backgroundColor: "#48a832" }}
        >
          {this.menuRenderer()}
        </nav>
        <SortBar />
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

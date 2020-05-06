import { Sidenav, Dropdown, Nav, Icon } from "rsuite";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from "react";
import propTypes from "prop-types";

class ProfileSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const show = false;
    return (
      <Sidenav defaultOpenKeys={["3"]} activeKey="1">
        <Sidenav.Body>
          <Nav>
            <Nav.Item
              eventKey="1"
              icon={<Icon icon="dashboard" className="img-fluid" />}
            >
              <Link to="/profile" onClick={this.props.closeCallback}>
                Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item
              eventKey="1"
              icon={<Icon icon="plus" className="img-fluid" />}
            >
              <Link to="/createPost" onClick={this.props.closeCallback}>
                New Post
              </Link>
            </Nav.Item>
            <Dropdown
              eventKey="3"
              title="Security"
              icon={<Icon icon="magic" className="img-fluid" />}
            >
              <Link to="/editProfile" onClick={this.props.closeCallback}>
                <Dropdown.Item eventKey="3-3">Edit profile</Dropdown.Item>
              </Link>
              <Link to="/editEmail" onClick={this.props.closeCallback}>
                <Dropdown.Item eventKey="3-1">Edit email</Dropdown.Item>
              </Link>
              <Link to="/editPassword" onClick={this.props.closeCallback}>
                <Dropdown.Item eventKey="3-2">Edit password</Dropdown.Item>
              </Link>
              <Link to="/editAvatar" onClick={this.props.closeCallback}>
                <Dropdown.Item eventKey="3-2">Edit avatar</Dropdown.Item>
              </Link>
            </Dropdown>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    );
  }
}

ProfileSidebar.propTypes = {
  closeCallback: propTypes.func.isRequired
};

export default ProfileSidebar;

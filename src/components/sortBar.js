import React, { Component } from "react";

class SortBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <nav
        className="navbar navbar"
        style={{ backgroundColor: "#495057", color: "white" }}
      >
        <div className="container-fluid">Filter Bar</div>
      </nav>
    );
  }
}

export default SortBar;

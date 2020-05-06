import React, { Component } from "react";
import _ from "lodash";
import { Sidenav, Dropdown, Nav, Icon } from "rsuite";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";

const initialState = { isLoading: false, results: [], value: "" };

class SearchComponent extends Component {
  state = initialState;
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false
        // results: _.filter(source, isMatch)
      });
    }, 300);
  };

  // searchbar() {
  //   const { isLoading, value, results } = this.state;

  //   return (
  //     <Search
  //       fluid
  //       loading={isLoading}
  //       onResultSelect={this.handleResultSelect}
  //       onSearchChange={_.debounce(this.handleSearchChange, 500, {
  //         leading: true
  //       })}
  //       results={results}
  //       value={value}
  //       size="mini"
  //       {...this.props}
  //     />
  //   );
  // }

  render() {
    const { isLoading, value, results } = this.state;
    return (
      <div className="container-fluid">
        <Sidenav defaultOpenKeys={["3"]} activeKey="1">
          <Sidenav.Body>
            <Nav>
              <Nav.Item>
                {/* <Search
                  fluid
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true
                  })}
                  results={results}
                  value={value}
                  width="100px"
                  {...this.props}
                /> */}
                <TextField
                  id="standard-basic"
                  multiline
                  fullWidth
                  //onChange={e => setMessage(e.target.value, loggedUser)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      alert("rpessed");
                    }
                  }}
                />
              </Nav.Item>
              <Nav.Item eventKey="1">
                <Link to="/createPost" onClick={this.props.closeCallback}>
                  <div className="row justify-content-center">
                    <Icon icon="plus" className="img-fluid">
                      New Post
                    </Icon>
                  </div>
                </Link>
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    );
  }
}

export default SearchComponent;

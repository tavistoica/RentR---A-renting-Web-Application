import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RegisterPopup from "./registerPopup";
import LoginPage from "./signIn";

class LoginPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
    this.handleShow = this.handleShow.bind(this);
  }

  handleShow(st) {
    this.setState(prevState => ({
      show: !prevState.show
    }));
  }

  render() {
    const Wrap = props => <div>{props.children}</div>;
    return (
      <>
        <Button onClick={this.handleShow}>Log In</Button>

        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header
            className="d-flex justify-content-start"
            closeButton
          ></Modal.Header>
          <Modal.Body>
            <Wrap>
              <LoginPage history={this.props.history} />
            </Wrap>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-start">
            <p>
              Dont have an account? <RegisterPopup />
            </p>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default LoginPopup;

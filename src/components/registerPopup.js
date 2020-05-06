import React from "react";
import Modal from "react-bootstrap/Modal";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RegisterPart from "./signUp";

class RegisterPopup extends React.Component {
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
    return (
      <>
        <Link onClick={this.handleShow}>Sign In</Link>

        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header
            className="d-flex justify-content-start"
            closeButton
          ></Modal.Header>
          <Modal.Body>
            <RegisterPart />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default RegisterPopup;

import React, { Component } from "react";
import Axios from "axios";
import { ipAdress } from "../config";
import Image from "react-bootstrap/Image";

class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.id,
      user: {}
    };
  }

  async componentDidMount() {
    console.log(this.state.userId);
    Axios.get(ipAdress + ":5001/users/profile/" + this.state.userId).then(
      Response => {
        this.setState({ user: Response.data.user });
      }
    );
    console.log(this.state.user);
  }

  render() {
    let $avatarPreview = null;
    $avatarPreview = (
      <Image src={this.state.user.avatar} width="120" roundedCircle />
    );
    return (
      <>
        <div className="container-fluid mt-5">
          <div className="row justify-content-center">{$avatarPreview}</div>
          <div className="row justify-content-center">
            <h2>
              {this.state.user.firstName + " " + this.state.user.lastName}
            </h2>
          </div>
        </div>
      </>
    );
  }
}

export default ViewProfile;

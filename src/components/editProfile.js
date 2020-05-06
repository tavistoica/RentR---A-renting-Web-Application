import React, { Component } from "react";
import ProfileSidebar from "./profileSideMenu";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import * as actions from "../actions";
import CustomInput from "./customInput";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { isMobile } from "react-device-detect";
import { ipAdress } from "../config";

class ChangeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCred: {
        firstName: "",
        lastName: ""
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    try {
      const response = await Axios.get(ipAdress + ":5001/users/profile");
      this.setState({ userCred: response.data.response });
    } catch (e) {
      console.log(e);
    }
  }

  async onSubmit(formData) {
    await this.props.changeProfile(formData);
    console.log(this.props);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  renderForm() {
    const { handleSubmit } = this.props;
    return (
      <form className="col-9" onSubmit={handleSubmit(this.onSubmit)}>
        {this.props.errorMessage ? (
          <div className="alert alert-danger ">{this.props.errorMessage}</div>
        ) : null}
        <Field
          name="firstName"
          type="text"
          id="firstName"
          fullWidth
          placeholder={this.state.userCred.firstName}
          component={CustomInput}
        />
        <Field
          name="lastName"
          type="text"
          id="lastName"
          fullWidth
          placeholder={this.state.userCred.lastName}
          component={CustomInput}
        />
        <Button type="submit" className="btn btn-block mr-auto">
          Edit
        </Button>
      </form>
    );
  }

  renderContent() {
    if (isMobile) {
      return (
        <div className="row justify-content-center">{this.renderForm()}</div>
      );
    } else {
      return (
        <div className="row justify-content-center">
          <div className="col-3 profile-menu">
            <ProfileSidebar />
          </div>
          <div className="col-9 ">
            <div className="container">{this.renderForm()}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="container-fluid">{this.renderContent()}</div>;
  }
}

function MapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(MapStateToProps, actions),
  reduxForm({ form: "changeProfile" })
)(ChangeProfile);

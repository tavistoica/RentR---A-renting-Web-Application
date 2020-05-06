import React, { Component } from "react";
import ProfileSidebar from "./profileSideMenu";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import * as actions from "../actions";
import CustomInput from "./customInput";
import Button from "react-bootstrap/Button";
import { isMobile } from "react-device-detect";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCred: {
        password: "",
        newPassword: "",
        newPasswordAgain: ""
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(formData) {
    await this.props.editPassword(formData);
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
          name="password"
          type="text"
          id="email"
          fullWidth
          placeholder={"old password"}
          component={CustomInput}
        />
        <Field
          name="newPassword"
          type="text"
          id="newPassword"
          fullWidth
          placeholder={"new password"}
          component={CustomInput}
        />
        <Field
          name="newPassword2"
          type="text"
          id="newPassword2"
          fullWidth
          placeholder={"new password again"}
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
        <div className="row">
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
  reduxForm({ form: "editPassword" })
)(ChangePassword);

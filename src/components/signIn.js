import React, { Component } from "react";
import { BrowserRouter as Link } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { compose } from "redux";
//import actions from "../../act";
//import authReducer from "../../reducers/Auth";
import * as actions from "../actions";
import CustomInput from "./customInput";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  async onSubmit(formData) {
    await this.props.SignIn(formData);
    console.log(this.props);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  routeChange = () => {
    if (!this.props.errorMessage) {
      this.props.history.push("/signup");
    }
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="justify-content-center">
          {this.props.errorMessage ? (
            <div className="alert alert-danger ">{this.props.errorMessage}</div>
          ) : null}
          <Field
            name="email"
            type="text"
            id="email"
            fullWidth
            placeholder="example@example.com"
            component={CustomInput}
          />
          <Field
            name="password"
            type="password"
            id="password"
            fullWidth
            placeholder="Password"
            component={CustomInput}
          />
          <Button type="submit" className="btn btn-block mr-auto">
            Sign In
          </Button>
          <Button style={{ marginTop: 10 }} onClick={this.routeChange}>
            Create a new account
          </Button>
        </div>
      </form>
    );
  }
}

function MapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(MapStateToProps, actions),
  reduxForm({ form: "signin" })
)(SignIn);

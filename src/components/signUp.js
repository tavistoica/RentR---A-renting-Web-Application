import React, { Component } from "react";
import { BrowserRouter as Link } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
//import actions from "../../act";
//import authReducer from "../../reducers/Auth";
import * as actions from "../actions";
import CustomInput from "./customInput";

const ImgUpload = ({ onChange, src }) => {
  return (
    <div className="container-fluid">
      <label for="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload">
          <img for="photo-upload" src={src} width="120" height="120" />
        </div>
        <input id="photo-upload" type="file" onChange={onChange} />
      </label>
    </div>
  );
};

class signUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagePreviewUrl:
        "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async onSubmit(formData) {
    //console.log(formData);
    await this.props.SignUp(formData);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  photoUpload(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
      this.props.change("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  }

  render() {
    const { handleSubmit } = this.props;
    console.log(handleSubmit);
    return (
      <form className="form-login" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="justify-content-center">
          {this.props.errorMessage ? (
            <div className="alert alert-danger ">{this.props.errorMessage}</div>
          ) : null}
          <ImgUpload
            onChange={e => this.photoUpload(e)}
            src={this.state.imagePreviewUrl}
          />
          <Field
            name="email"
            type="text"
            id="email"
            fullWidth
            placeholder="example@example.com"
            component={CustomInput}
          />
          <Field
            name="firstName"
            type="text"
            id="firstName"
            fullWidth
            placeholder="First Name"
            component={CustomInput}
          />
          <Field
            name="lastName"
            type="text"
            id="lasstName"
            placeholder="Last Name"
            component={CustomInput}
            onChange={this.onChange}
          />
          <Field
            name="password"
            type="password"
            id="password"
            fullWidth
            placeholder="Password"
            component={CustomInput}
          />
          <Field
            name="avatar"
            type="hidden"
            id="avatar"
            component={CustomInput}
            onChange={this.onChange}
          />
          <Button type="submit" className="btn btn-block ">
            Sign Up
          </Button>
          <Link className="d-flex justify-content-center" closeButton>
            Already have an account?
          </Link>
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
  reduxForm({ form: "signup" })
)(signUp);

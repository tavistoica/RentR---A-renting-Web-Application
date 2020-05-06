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

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.id,
      post: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    Axios.defaults.headers.common["Authorization"] = jwtToken;
    try {
      const response = await Axios.get(
        ipAdress + ":5001/post/" + this.props.match.params.id
      );
      this.setState({ post: response.data.foundPost });
      console.log(this.props.match.params);
    } catch (e) {
      console.log(e);
    }
  }

  async onSubmit(formData) {
    await this.props.changeProfile(formData);
    console.log(this.props);
    if (!this.props.errorMessage) {
      this.props.history.push("/profile");
    }
  }

  renderForm() {
    const { handleSubmit } = this.props;
    let $imagePreview = null;
    if (this.state.imagePreviewUrl) {
      $imagePreview = <img src={this.state.imagePreviewUrl} />;
    }
    return (
      <form id="create-post-form" onSubmit={handleSubmit(this.onSubmit)}>
        {this.props.errorMessage ? (
          <div className="alert alert-danger ">{this.props.errorMessage}</div>
        ) : null}
        <table>
          <tr>
            <th>Title</th>
            <th>
              <Field
                name="title"
                type="text"
                id="title"
                width="50%"
                placeholder={"Title"}
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th>Location</th>
            <th>
              <Field
                name="location"
                type="text"
                id="location"
                width="50%"
                placeholder={"Location"}
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th>Price</th>
            <th>
              <Field
                name="price"
                type="number"
                id="price"
                placeholder={"Price"}
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th>Photo</th>
            <th>
              <div className="imgPreview">{$imagePreview}</div>
              <Field
                name="photo"
                type="file"
                id="photo"
                width="20%"
                onChange={(e) => this._handleImageChange(e)}
                component={CustomInput}
              />
              <Field
                name="photo1"
                type="hidden"
                id="photoBase64"
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th className="pr-5">Description</th>
            <th>
              <Field
                name="description"
                type="text"
                id="description"
                placeholder={"Enter description..."}
                component="textarea"
                onChange={this.onChange}
              />
            </th>
          </tr>
        </table>
        <Button type="submit" className="col-8 btn btn-block mt-5">
          Submit
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
          <div className="col-9">{this.renderForm()}</div>
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
    errorMessage: state.auth.errorMessage,
  };
}

export default compose(
  connect(MapStateToProps, actions),
  reduxForm({ form: "EditPost" })
)(EditPost);

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
import Image from "react-bootstrap/Image";
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";

const ImgUpload = ({ onChange, src }) => {
  return (
    <label for="photo-upload" className="custom-file-upload fas">
      <div className="img-wrap img-upload">
        <img for="photo-upload" src={src} width="120" height="120" />
      </div>
      <input id="photo-upload" type="file" onChange={onChange} />
    </label>
  );
};

class ChangeAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCred: {
        currentPhoto: "",
        newPhoto: ""
      },
      user: {},
      file: "",
      imagePreviewUrl: "",
      name: "",
      status: "",
      active: "edit"
    };
    this.onSubmit = this.onSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let holder = "";

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        photo: reader.result[1]
      });
      this.props.change("avatar", reader.result);
    };

    reader.readAsDataURL(file);

    //holder = reader.result[1];

    // document
    //   .getElementsByName("photoBase64")[0]
    //   .setAttribute("photoBase64", this.state.imagePreviewUrl);
  }

  async componentDidMount() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    //Axios.defaults.headers.common["Authorization"] = jwtToken;
    try {
      const response = await Axios.get("http://127.0.0.1:5001/users/profile");
      this.setState({
        user: response.data.response,
        imagePreviewUrl: response.data.response.avatar
      });
    } catch (e) {
      console.log(e);
    }
  }

  async onSubmit(formData) {
    await this.props.editAvatar(formData);
    console.log(this.props);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async function(resolve, reject) {
      // We create an image to receive the Data URI
      var img = document.createElement("img");

      // When the event "onload" is triggered we can resize the image.
      img.onload = function() {
        // We create a canvas and get its context.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

        var dataURI = canvas.toDataURL();

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;
    });
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

  renderForm() {
    let $avatarPreview = null;
    const { handleSubmit } = this.props;
    $avatarPreview = (
      <Image
        src={this.state.user.avatar}
        width="200"
        roundedCircle
        onClick={e => this._handleImageChange(e)}
      />
    );
    return (
      <form className="col-9" onSubmit={handleSubmit(this.onSubmit)}>
        {this.props.errorMessage ? (
          <div className="alert alert-danger ">{this.props.errorMessage}</div>
        ) : null}
        <div className="row justify-content-center">
          <ImgUpload
            onChange={e => this.photoUpload(e)}
            src={this.state.imagePreviewUrl}
          />
        </div>
        <div className="row justify-content-center">
          {/* <Field
            name="photo"
            type="file"
            id="photo"
            width="20%"
            onChange={e => this._handleImageChange(e)}
            component={CustomInput}
          /> */}
          <Field
            name="photo1"
            type="hidden"
            id="photoBase64"
            component={CustomInput}
            onChange={this.onChange}
          />
        </div>
        <div className="row justify-content-center ml-5 mr-5">
          <Button type="submit" className="btn btn-block mr-auto">
            Edit
          </Button>
        </div>
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
  reduxForm({ form: "ChangeAvatar" })
)(ChangeAvatar);

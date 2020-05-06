import React, { Component } from "react";
import ProfileSidebar from "./profileSideMenu";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import * as actions from "../actions";
import CustomInput from "./customInput";
import Button from "react-bootstrap/Button";
import { isMobile } from "react-device-detect";
import * as fs from "fs";
import Axios from "axios";
import { Map, GoogleApiWrapper, Marker, Circle } from "google-maps-react";
import MapContainer from "./mapContainer";

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

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      photo: "",
      price: "",
      location: "",
      size: "",
      rooms: "",
      imagePreviewUrl: "",
      initial_longitude: null,
      initial_latitude: null,
      loading: true,
      coords: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.base64_encode = this.base64_encode.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  base64_encode(file) {
    // read binary data
    let bitmap = fs.readFile(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString("base64");
  }

  async componentDidMount() {
    await Axios.get("https://ipapi.co/json/").then((Response) => {
      this.setState({
        initial_latitude: Response.data.latitude,
        initial_longitude: Response.data.longitude,
        loading: false,
      });
    });
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let holder = "";

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        photo: reader.result[1],
      });
      this.props.change("photoBase64", reader.result);
    };

    reader.readAsDataURL(file);
  }

  async onSubmit(formData) {
    await this.props.CreatePost(formData);
    console.log(this.state.imagePreviewUrl);
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
        imagePreviewUrl: reader.result,
      });
      this.props.change("photoBase64", reader.result);
    };
    reader.readAsDataURL(file);
  }

  callbackFunction = (childData) => {
    this.setState({ coords: childData });
    this.props.change("latitude", this.state.coords.lat);
    this.props.change("longitude", this.state.coords.lng);
    console.log(this.state.coords);
  };

  renderForm() {
    const { handleSubmit } = this.props;
    let $imagePreview = null;
    if (this.state.imagePreviewUrl) {
      $imagePreview = <img src={this.state.imagePreviewUrl} />;
    }
    const coords = {
      lat: parseFloat(this.state.initial_latitude),
      lng: parseFloat(this.state.initial_longitude),
    };

    return (
      <form
        className="row justify-content-center"
        id="create-post-form"
        onSubmit={handleSubmit(this.onSubmit)}
      >
        {this.props.errorMessage ? (
          <div className="alert alert-danger ">{this.props.errorMessage}</div>
        ) : null}
        <table>
          <tr>
            <th>Photo</th>
            <th>
              {/* <div className="imgPreview">{$imagePreview}</div> */}
              <ImgUpload
                onChange={(e) => this.photoUpload(e)}
                src={this.state.imagePreviewUrl}
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
            {/* <th>Location</th> */}
            <th colspan="2">
              <MapContainer
                coords={coords}
                drag={true}
                getCoords={this.callbackFunction}
              />
              <Field
                name="latitude"
                type="hidden"
                id="latitude"
                component={CustomInput}
                onChange={this.onChange}
              />
              <Field
                name="longitude"
                type="hidden"
                id="longitude"
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th>Number of Rooms</th>
            <th>
              <Field
                name="rooms"
                type="text"
                id="rooms"
                width="50%"
                component={CustomInput}
                onChange={this.onChange}
              />
            </th>
          </tr>
          <tr>
            <th>m^2</th>
            <th>
              <Field
                name="size"
                type="text"
                id="size"
                width="50%"
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
          <div className="col-9 ">
            <div className="container">{this.renderForm()}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container-fluid" style={{ flex: 0.8 }}>
        {this.state.loading ? "loading" : this.renderContent()}
      </div>
    );
  }
}

function MapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}

export default compose(
  connect(MapStateToProps, actions),
  reduxForm({ form: "CreatePost" })
)(CreatePost);

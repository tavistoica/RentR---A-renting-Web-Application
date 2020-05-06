import React, { Component, useState, useRef, useCallback } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  SearchBox,
} from "react-google-maps";
import Axios from "axios";

const DraggableMarkerMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      ref={props.refMap}
      defaultZoom={props.zoom}
      defaultCenter={{
        lat: parseFloat(props.latitude),
        lng: parseFloat(props.longitude),
      }}
      onBoundsChanged={props.handleMove}
    >
      {props.isMarkerShown && <Marker position={props.center} />}
    </GoogleMap>
  ))
);

const NormalMap = withScriptjs(
  withGoogleMap((props) => {
    const markers = props.markers;
    return (
      <GoogleMap
        defaultZoom={props.zoom}
        defaultCenter={{
          lat: parseFloat(props.latitude),
          lng: parseFloat(props.longitude),
        }}
        onBoundsChanged={props.handleMove}
      >
        {props.isMarkerShown &&
          markers.map((marker) => (
            <Marker position={{ lng: marker.lng, lat: marker.lat }} />
          ))}
        {console.log(props.latitude)}
      </GoogleMap>
    );
  })
);

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      loading: true,
      center: {},
    };
    this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
    this.refMap = React.createRef();
  }

  async componentDidMount() {
    // await navigator.geolocation.getCurrentPosition(
    //   (position) =>
    //     this.setState(
    //       {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       },
    //       (newState) => console.log(newState)
    //     ),
    //   (err) => console.log(err)
    // );
    //delete Axios.defaults.headers.common["authorization"];
    // await Axios.get("https://ipapi.co/json/").then((Response) => {
    //   this.setState({
    //     latitude: Response.data.latitude,
    //     longitude: Response.data.longitude,
    //     loading: false,
    //   });
    //   console.log(Response);
    // });
  }

  handleBoundsChanged = () => {
    const mapCenter = this.refMap.current.getCenter(); //get map center
    this.setState({ center: mapCenter });
    const lat = mapCenter.lat();
    const lng = mapCenter.lng();
    this.props.getCoords({ lat, lng });
  };

  ipLookUp() {
    Axios("http://ip-api.com/json/").then((Response) => {
      this.setState({
        latitude: Response.lat,
        longitude: Response.lon,
        loading: false,
      });
    });
  }

  renderMapDrag(coords) {
    return (
      <>
        <DraggableMarkerMap
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDhjFD-RDNmRgyzo7eDZyoD-XvW-i9q6-s&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          longitude={coords.lng}
          latitude={coords.lat}
          zoom={14}
          handleMove={this.handleBoundsChanged}
          refMap={this.refMap}
          center={this.state.center}
        />
        {/* <SearchBox
          controlPosition={0}
          // onPlacesChanged={props.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Customized your placeholder"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              marginTop: `27px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </SearchBox> */}
      </>
    );
  }

  renderMap(coords, zoom) {
    return (
      <>
        <NormalMap
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDhjFD-RDNmRgyzo7eDZyoD-XvW-i9q6-s&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `82vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          longitude={coords.lng}
          latitude={coords.lat}
          markers={this.props.markers}
          zoom={zoom}
        />
      </>
    );
  }

  render() {
    this.state.loading = false;
    return (
      <>
        {this.state.loading
          ? "loading"
          : this.props.drag
          ? this.renderMapDrag(this.props.coords)
          : this.renderMap(this.props.coords, this.props.zoom)}
      </>
    );
  }
}

export default MapContainer;

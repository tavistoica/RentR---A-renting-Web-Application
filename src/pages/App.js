import React from "react";
import Header from "../components/header";

export default (props) => {
  return (
    <div>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDhjFD-RDNmRgyzo7eDZyoD-XvW-i9q6-s"></script>
      <Header />
      {props.children}
    </div>
  );
};

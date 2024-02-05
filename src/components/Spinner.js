import React from "react";
import "../style/loader.css";

function Spinner(props) {
  return (
    <div className="spinner-container">
      <div
        className="loader"
        style={{
          borderColor: props.color,
          borderLeftColor: "transparent",
          ...props.style,
        }}
      ></div>
    </div>
  );
}

export default Spinner;

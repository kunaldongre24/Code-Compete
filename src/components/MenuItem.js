import React from "react";
import { Link } from "react-router-dom";

function MenuItem({ iconPath, address, title }) {
  return (
    <Link to={address} className="header-link">
      <button className="dashboard__btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d={iconPath} />
        </svg>
        <span className="svgBtn_text">{title}</span>
      </button>
    </Link>
  );
}

export default MenuItem;

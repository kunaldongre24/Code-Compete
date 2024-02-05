import React from "react";
import { NavLink } from "react-router-dom";

function SidebarItem({ title, Icon, link }) {
  return (
    <div className="link-btn">
      <NavLink to={link}>
        <div className="c">{Icon}</div>
        <div className="title">{title}</div>
      </NavLink>
    </div>
  );
}

export default SidebarItem;

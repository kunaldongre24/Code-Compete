import React from "react";
import "../style/nav.css";
import { NavLink } from "react-router-dom";

function NavItem({ path, title, Icon }) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
    >
      <div className="flex-nav">
        <Icon style={{ fontSize: 20 }} className="nav-icon" />
        <div>{title}</div>
      </div>
    </NavLink>
  );
}

export default NavItem;

import React from "react";

function NavBtn({ isActive, onClick, title, Icons }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "9px 10px",
      }}
      className={isActive ? "sel-nav" : ""}
    >
      {Icons}

      <span style={{ marginLeft: 16 }}>{title}</span>
    </div>
  );
}

export default NavBtn;

import React from "react";

function ProfileItem({ title, img, svg }) {
  const encodedSvg = encodeURIComponent(svg);
  const svgSrc = `data:image/svg+xml,${encodedSvg}`;

  return (
    <li className="profile-emo">
      <div className="pfp-cnt">
        <div className="pfp">
          <img src={svgSrc} className="pfp-img" />
        </div>
      </div>
      <div className="title">{title}</div>
    </li>
  );
}

export default ProfileItem;

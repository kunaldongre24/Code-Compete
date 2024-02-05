import React from "react";

function ProfileItem({ title }) {
  return (
    <div className="profile-emo">
      <div className="pfp-cnt">
        <div className="pfp"></div>
      </div>
      <div className="title">{title}</div>
    </div>
  );
}

export default ProfileItem;

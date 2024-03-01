import React from "react";

function UserList({
  handleMute,
  handleKick,
  isMe,
  isMuted,
  title,
  isReady,
  isAdmin,
  isSpectator,
  svg,
}) {
  const encodedSvg = encodeURIComponent(svg);
  const svgSrc = `data:image/svg+xml,${encodedSvg}`;
  return (
    <div className="flex-col">
      <div className="flex-1in">
        <div className="profile-emo">
          <div className="pfp-cnt">
            <div className="pfp">
              <img src={svgSrc} className="pfp-img" />
            </div>
          </div>
        </div>
        <div>
          <div className="pname">
            {title} {isMe ? "(you)" : null}
          </div>
          {isSpectator ? (
            <div className="status-msg info-msg">Spectating</div>
          ) : (
            <div
              className={`status-msg ${
                isReady ? "success-msg" : "critical-msg"
              }`}
            >
              {isReady ? "Ready" : "No Ready"}
            </div>
          )}
        </div>
      </div>
      {isAdmin && !isMe ? (
        <div className="flex-1in">
          <button className="mute-btn" onClick={() => handleMute()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="19"
              viewBox="0 -960 960 960"
              width="19"
            >
              <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z" />
            </svg>
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button onClick={() => handleKick()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="19"
              viewBox="0 -960 960 960"
              width="19"
            >
              <path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z" />
            </svg>
            <span>Kick</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default UserList;

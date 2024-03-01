import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../constant/Api_base_url";
import Spinner from "./Spinner";
import Spectate from "./Spectate";
import CodeEditor from "./CodeEditor";

function InRace({ roomId, raceId, config, members, socket, userContext }) {
  const [isSpectator, setSpectator] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    checkRole();
  }, [roomId]);
  const checkRole = async () => {
    const response = await axios.post(
      `${API_BASE_URL}/race/checkRole`,
      { roomId },
      config
    );
    if (response.data && response.data.fetched) {
      setSpectator(response.data.role === "spectator");
    } else {
      navigate("/");
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="body-content">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner color="#aaa" />
        </div>
      </div>
    );
  }
  if (isSpectator) {
    return (
      <Spectate
        config={config}
        members={members}
        raceId={raceId}
        socket={socket}
        userContext={userContext}
      />
    );
  }
  return (
    <CodeEditor
      config={config}
      members={members}
      raceId={raceId}
      socket={socket}
      roomId={roomId}
    />
  );
}

export default InRace;

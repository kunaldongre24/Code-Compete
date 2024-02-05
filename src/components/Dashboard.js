import React, { useContext, useState } from "react";
import "../style/dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const [userContext, setUserContext] = useContext(AuthContext);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const navigate = useNavigate();
  const config = {
    headers: { Authorization: `Bearer ${userContext.token}` },
  };
  const handleCreateRoom = async () => {
    setCreatingRoom(true);
    const response = await axios.post(
      `${API_BASE_URL}/room/createRoom`,
      {},
      config
    );
    if (response.status === 200) {
      const data = response.data;
      navigate(`/room/${data.roomId}`);
    }
    setCreatingRoom(false);
  };
  return (
    <div>
      <section className="wc">
        <div className="wc-cnt">
          <div className="left-1">
            <div className="left-cont box">
              <h1>ICCP - Compete with your friends in CP</h1>
              <h3>Practice coding questions with your friends and challenge</h3>
              <Link className="enter-btn">Enter a Coding Room</Link>
            </div>
            <div className="div-2 box sml">
              <h1>Create Private Room</h1>
              <h3>Invite friends and compete with them</h3>
              <Link className="enter-btn" onClick={() => handleCreateRoom()}>
                {creatingRoom ? (
                  <Spinner color="#fff" />
                ) : (
                  <span>Create Room</span>
                )}
              </Link>
            </div>
            <div className="div-3 box sml">
              <h1>Practice</h1>
              <h3>Improve your pace by your own.</h3>
              <Link to={"/practice"} className="enter-btn">
                Practice Yourself
              </Link>
            </div>
          </div>
          <div className="right-cont">
            <div className="welcome-screen box">
              <h1>Welcome to ICCP</h1>
              <div>
                <p />A private environment where you can compete with your
                friends in Competitive Programming.
                <p />
                <ul>
                  <li>
                    Immerse yourself in a series of thought-provoking questions
                    displayed on your screen.
                  </li>
                  <li>
                    Race against your friends to claim the top spot on the
                    leaderboard with every keystroke.
                  </li>
                  <li>
                    One can spectate their friends, after solving the problems
                    or as a spectator
                  </li>
                  <li>
                    More than just a contest - it's a fun-filled journey of
                    problem-solving and camaraderie.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

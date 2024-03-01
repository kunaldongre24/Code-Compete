import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/dashboard.css";
import "../style/createRoom.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "../context/SocketContext";
import UserList from "./UserList";
import "../style/animate.css";
import InRace from "./InRace";

function Room({ inRoom, setInRoom }) {
  const { roomId } = useParams();
  const modalRef = useRef(null);
  const spanRef = useRef(null);
  const messagesContainerRef = useRef();
  const navigate = useNavigate();
  const [joinedRace, setJoinedRace] = useState(false);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceId, setRaceId] = useState("");
  const [userContext, setUserContext] = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const config = {
    headers: { Authorization: `Bearer ${userContext.token}` },
  };

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [readyLoading, setReadyLoading] = useState(false);
  const [isReady, setReady] = useState(false);
  const [userList, showUserList] = useState(false);
  const [startingRace, setStartingRace] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [showMembers, setShowMember] = useState(false);
  const [roomExists, setRoomExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const ratingArray = Array.from(
    { length: Math.ceil((3200 - 800 + 1) / 100) },
    (_, i) => 800 + i * 100
  );
  const maxRatingArray = Array.from(
    { length: Math.ceil((3200 - roomInfo.minRating + 1) / 100) },
    (_, i) => roomInfo.minRating + i * 100
  );

  const tppArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
  const copyUrl = () => {
    if (spanRef.current) {
      spanRef.current.select();
      document.execCommand("copy");
    }
  };
  const checkRoom = async () => {
    setLoading(true);
    const response = await axios.get(
      `${API_BASE_URL}/room/getRoomInfo/${roomId}`,
      config
    );
    const { status } = response.data;
    if (response.data.room) {
      if (response.data.room.admin === userContext.details._id) {
        setAdmin(true);
      }
      if (response.data.room.minRating > response.data.room.maxRating) {
        response.data.room.maxRating = response.data.room.minRating;
      }
      setRoomInfo(response.data.room);
      setRoomExists(status);
      setInRoom(status);
    }
    setLoading(false);
  };
  const createRace = async () => {
    setStartingRace(true);
    const response = await axios.post(
      `${API_BASE_URL}/race/createRace`,
      {},
      config
    );
    setTimeout(() => {
      setStartingRace(false);
    }, 5000);
  };

  useEffect(() => {
    socket.emit(
      "login",
      { userId: userContext.details._id, room: roomId },
      (error) => {
        if (error) {
          return toast.error("Some error occurred!");
        }
        return;
      }
    );
    socket.on("users", (members) => {
      if (
        members.filter(
          (member) => member.userId._id === userContext.details._id
        ).length > 0
      ) {
        const member = members.filter(
          (member) => member.userId._id === userContext.details._id
        )[0];
        setReady(member.isAdmin || member.isReady);
        setMembers(members);
      } else {
        navigate("/");
      }
    });
    socket.on("room", (room) => {
      if (room.roomId === roomId) {
        setRoomInfo(room);
        if (room.minRating > room.maxRating) {
          room.maxRating = room.minRating;
        }
      } else {
        navigate("/");
      }
    });
    socket.on("count", ({ count }) => {
      setCount(count);
    });
    socket.on("raceStarted", ({ status, raceId }) => {
      setJoinedRace(status);
      setRaceId(raceId);
      setRaceStarted(status);
    });
    socket.on("message", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    socket.on("notification", (notif) => {
      setMessages((messages) => [
        ...messages,
        { text: notif.description, type: notif.type, createdAt: Date.now() },
      ]);
    });
  }, [socket, toast]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSendingMessage(true);
    if (message.trim() !== "") {
      socket.emit("sendMessage", message, () => setSendingMessage(false));
    }
    setMessage("");
  };
  const handleMute = (userId, status) => {
    socket.emit("handleMute", { userId, status });
  };
  const handleKickUser = async (userId) => {
    socket.emit("kickUser", userId);
  };

  const checkRaceStarted = async () => {
    setLoading2(true);
    const response = await axios.post(
      API_BASE_URL + "/race/checkRaceStarted",
      { roomId },
      config
    );
    setRaceStarted(response.data.status);
    setRaceId(response.data.raceId);
    setLoading2(false);
  };
  const handleStatus = (status) => {
    setReadyLoading(true);
    socket.emit("updateStatus", status, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      } else {
        setReadyLoading(false);
      }
      setReadyLoading(false);
    });
  };
  const handleSpectate = (status) => {
    socket.emit("updateSpectate", status, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      }
    });
  };
  const handleTpp = (val) => {
    socket.emit("updateTpp", { val, roomId }, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      } else {
      }
    });
  };
  const handleRounds = (val) => {
    socket.emit("updateRounds", { val, roomId }, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      } else {
      }
    });
  };

  const handleMinRating = (val) => {
    socket.emit("updateMinRating", { val, roomId }, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      } else {
      }
    });
  };
  const handleMaxRating = (val) => {
    socket.emit("updateMaxRating", { val, roomId }, (error) => {
      if (error) {
        return toast.error("Some error occurred!");
      } else {
      }
    });
  };
  const handleChatScroll = () => {
    const scrollContainer = document.getElementById("chat-screen");

    if (
      Math.abs(
        parseInt(scrollContainer.scrollTop + scrollContainer.clientHeight) -
          parseInt(scrollContainer.scrollHeight)
      ) < 5
    ) {
      document.getElementById("chat-screen").classList.remove("scroll-top");
    } else {
      document.getElementById("chat-screen").classList.add("scroll-top");
    }
  };
  useEffect(() => {
    checkRoom();
    checkRaceStarted();
    return () => {
      setInRoom(false);
      setRaceStarted(false);
    };
  }, [roomId]);

  useEffect(() => {
    setTimeout(() => {
      setShowMember(false);
    }, 200);
    return () => {
      setShowMember(false);
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading || loading2) {
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

  if (!roomExists) {
    return (
      <div className="wc-cnt center-wd ">
        <div className="wc">Room doesn't exist</div>
      </div>
    );
  }
  if (joinedRace && raceId) {
    return (
      <InRace
        raceId={raceId}
        config={config}
        members={members}
        socket={socket}
        roomId={roomId}
        userContext={userContext}
      />
    );
  }
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <header className={!inRoom ? "hidden-header" : "room-header"}>
        <div className="flex__align">
          <div className="fheader">
            <span>I</span> <span>C</span> <span>C</span> <span>P</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span onClick={() => setShowModal(true)} className="invite">
              <span>Invite Friends</span>
            </span>
            <div className="btn-cnt">
              {isMuted ? (
                <svg
                  onClick={() => setMuted(false)}
                  title="muted"
                  alt="muted"
                  className="header-btn"
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z" />
                </svg>
              ) : (
                <svg
                  onClick={() => setMuted(true)}
                  title="Unmuted"
                  alt="Unmuted"
                  className="header-btn"
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z" />
                </svg>
              )}
              <svg
                onClick={() => showUserList(true)}
                className="header-btn"
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                viewBox="0 -960 960 960"
                width="28"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <section className="wc">
        <div className="wc-cnt center-wd room-wc">
          {showModal ? (
            <div className="modal">
              <div className="success" ref={modalRef}>
                <div>Give this URL to the people you want to invite </div>
                <input
                  ref={spanRef}
                  type="text"
                  className="url"
                  value={`https://iccp-live.web.app/room/${roomId}`}
                  readOnly
                  onClick={copyUrl}
                  style={{ cursor: "pointer" }}
                />
                <div className="copy-btn" onClick={copyUrl}>
                  Copy this URL
                </div>
                <div
                  className="copy-btn conf-btn"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </div>
              </div>
            </div>
          ) : null}
          {userList ? (
            <div className="modal">
              <div className="box welcome-screen userList modal-list">
                <div className="flex-heading">
                  <h1>Members</h1>
                  <div>
                    <svg
                      className="cancel-btn"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      onClick={() => showUserList(false)}
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </div>
                </div>
                <div className="user-row">
                  {members.map((member) => {
                    return (
                      <UserList
                        title={member.userId.username}
                        key={member.userId._id}
                        isReady={
                          member.isReady || member.isAdmin || member.isSpectator
                        }
                        svg={member.userId.svg}
                        isSpectator={member.isSpectator}
                        isMe={member.userId._id === userContext.details._id}
                        isMuted={member.isMuted}
                        isAdmin={isAdmin}
                        handleMute={() =>
                          handleMute(member.userId._id, !member.isMuted)
                        }
                        handleKick={() => handleKickUser(member.userId._id)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
          <div className="left-1 room-left-1">
            {raceStarted ? (
              <div className="create-room box j-rc" style={{ padding: 0 }}>
                <div className="abs-cnt">
                  <div className="text-container">
                    <div className="ps-ab">
                      <div>
                        <h1>A race is currently in session</h1>
                        <h3>Join the race to compete</h3>
                      </div>

                      <Link
                        role="button"
                        className="enter-btn join-btn"
                        onClick={() => setJoinedRace(true)}
                      >
                        <div>Join Race</div>
                        <div className="sl-txt">Join race and compete</div>
                      </Link>
                    </div>
                  </div>
                  <div className="gradient-bg">
                    <svg xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="goo">
                          <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="10"
                            result="blur"
                          />
                          <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                            result="goo"
                          />
                          <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                      </defs>
                    </svg>
                    <div className="gradients-container">
                      <div className="g1"></div>
                      <div className="g2"></div>
                      <div className="g3"></div>
                      <div className="g4"></div>
                      <div className="g5"></div>
                      <div className="interactive"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {count > 0 ? (
                  <>
                    <div className="create-room box countr">
                      <h1>Race starting in</h1>
                      <div>
                        <h1 className="count-num">
                          {`${count}`.padStart(2, "0")}
                        </h1>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {isAdmin ? (
                      <div className="create-room box">
                        <div>
                          <h1>Create a Race</h1>
                          <h3>
                            Change the settings and create a race to compete
                            with your.
                          </h3>
                        </div>
                        <div>
                          <div className="flex-class">
                            <div className="input-group">
                              <label className="enabled">
                                Time Per Problem: <span>{roomInfo.tpp}</span>
                              </label>
                              <div>
                                <div>
                                  <select
                                    value={roomInfo.tpp}
                                    onChange={(e) => handleTpp(e.target.value)}
                                  >
                                    {tppArray.map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="input-group">
                              <label className="enabled">
                                Rounds: <span>{roomInfo.rounds}</span>
                              </label>
                              <div>
                                <div>
                                  <select
                                    value={roomInfo.rounds}
                                    onChange={(e) =>
                                      handleRounds(e.target.value)
                                    }
                                  >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-class">
                            <div className="input-group">
                              <label className="enabled">
                                Min Rating: <span>{roomInfo.minRating}</span>
                              </label>
                              <select
                                value={roomInfo.minRating}
                                onChange={(e) =>
                                  handleMinRating(e.target.value)
                                }
                              >
                                {ratingArray.map((rating) => (
                                  <option key={rating} value={rating}>
                                    {rating}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="input-group">
                              <label className="enabled">
                                Max Rating: <span>{roomInfo.maxRating}</span>
                              </label>

                              <select
                                value={roomInfo.maxRating}
                                onChange={(e) =>
                                  handleMaxRating(e.target.value)
                                }
                              >
                                {maxRatingArray.map((rating) => (
                                  <option key={rating}>{rating}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <Link
                          role="button"
                          onClick={() =>
                            !members.filter((x) => !x.isSpectator).length > 0
                              ? {}
                              : members.filter(
                                  (x) =>
                                    !x.isReady && !x.isAdmin && !x.isSpectator
                                ).length > 0
                              ? {}
                              : createRace()
                          }
                          className={`enter-btn ${
                            !members.filter((x) => !x.isSpectator).length > 0
                              ? "disabled-ebtn"
                              : members.filter(
                                  (x) =>
                                    !x.isReady && !x.isAdmin && !x.isSpectator
                                ).length > 0
                              ? "disabled-ebtn"
                              : ""
                          }`}
                          title={
                            !members.filter((x) => !x.isSpectator).length > 0
                              ? "Atleast 1 member should be in the race!"
                              : members.filter(
                                  (x) =>
                                    !x.isReady && !x.isAdmin && !x.isSpectator
                                ).length > 0
                              ? "Waiting for all members to be ready!"
                              : "Start the race"
                          }
                        >
                          {startingRace || count > 0 ? (
                            <div>
                              Starting...
                              <div className="sl-txt">Starting</div>
                            </div>
                          ) : members.filter(
                              (x) => !x.isReady && !x.isAdmin && !x.isSpectator
                            ).length > 0 ? (
                            <div>
                              Start Race
                              <div className="sl-txt">Members not ready</div>
                            </div>
                          ) : (
                            <div>
                              Start Race
                              <div className="sl-txt">All members ready</div>
                            </div>
                          )}
                        </Link>
                      </div>
                    ) : (
                      <div className="create-room box">
                        <div style={{}}>
                          <h1>Welcome to Race</h1>
                          <h3>Only admin can edit the room settings.</h3>
                        </div>
                        <div>
                          <div className="flex-class">
                            <div className="input-group">
                              <div>
                                <label>
                                  Time Per Problem: <span>{roomInfo.tpp}</span>
                                </label>

                                <div>
                                  <select disabled></select>
                                </div>
                              </div>
                            </div>

                            <div className="input-group">
                              <div>
                                <label>
                                  Rounds: <span>{roomInfo.rounds}</span>
                                </label>
                                <div>
                                  <select disabled></select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-class">
                            <div className="input-group">
                              <label>
                                Min Rating: <span>{roomInfo.minRating}</span>
                              </label>
                              <select disabled></select>
                            </div>
                            <div className="input-group">
                              <label>
                                Max Rating: <span>{roomInfo.maxRating}</span>
                              </label>

                              <select disabled></select>
                            </div>
                          </div>
                        </div>
                        {members.length > 0 &&
                        !members.filter(
                          (x) => x.userId._id === userContext.details._id
                        )[0].isSpectator ? (
                          <Link
                            role="button"
                            className={`enter-btn ${
                              isReady ? "not-ready-btn" : "ready-btn"
                            }`}
                            onClick={() => handleStatus(!isReady)}
                          >
                            {readyLoading ? (
                              <div>
                                "UPDATING...
                                <div className="sl-txt">Updating Status</div>
                              </div>
                            ) : (
                              <div>
                                {isReady ? "READY" : "NOT READY"}
                                <div className="sl-txt">
                                  {isReady
                                    ? "You are now Ready"
                                    : "You are not Ready"}
                                </div>
                              </div>
                            )}
                          </Link>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            <div className="in-room box flex-left">
              <div className="container-user">
                <div className="box welcome-screen userList list-box">
                  <div className="flex-heading">
                    <h1>In Race</h1>
                    {members.length > 0 &&
                    members.filter(
                      (x) => x.userId._id === userContext.details._id
                    )[0].isSpectator ? (
                      count > 0 ? null : (
                        <span
                          className="invite"
                          onClick={() =>
                            count > 0 ? {} : handleSpectate(false)
                          }
                        >
                          <span>Join Race</span>
                        </span>
                      )
                    ) : null}
                  </div>
                  <div className="user-row">
                    {members.filter((x) => !x.isSpectator).length ? (
                      members
                        .filter((x) => !x.isSpectator)
                        .sort((a, b) => a.userId.username - b.userId.username)
                        .map((member) => {
                          return (
                            <UserList
                              title={member.userId.username}
                              key={member.userId._id}
                              isReady={
                                member.isReady ||
                                member.isAdmin ||
                                member.isSpectator
                              }
                              isSpectator={member.isSpectator}
                              isMe={
                                member.userId._id === userContext.details._id
                              }
                              svg={member.userId.svg}
                              isMuted={member.isMuted}
                              isAdmin={isAdmin}
                              handleMute={() =>
                                handleMute(member.userId._id, !member.isMuted)
                              }
                              handleKick={() =>
                                handleKickUser(member.userId._id)
                              }
                            />
                          );
                        })
                    ) : (
                      <div className="no-ser">No Members</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="container-user">
                <div className="box welcome-screen userList list-box">
                  <div className="flex-heading">
                    <h1>Spectator</h1>
                    {members.length > 0 &&
                    !members.filter(
                      (x) => x.userId._id === userContext.details._id
                    )[0].isSpectator ? (
                      count > 0 ? null : (
                        <span
                          className="invite"
                          onClick={() =>
                            count > 0 ? {} : handleSpectate(true)
                          }
                        >
                          <span>Spectate</span>
                        </span>
                      )
                    ) : null}
                  </div>
                  <div className="user-row">
                    {members.filter((x) => x.isSpectator).length ? (
                      members
                        .filter((x) => x.isSpectator)
                        .sort((a, b) => a.userId.username - b.userId.username)
                        .map((member) => {
                          return (
                            <UserList
                              title={member.userId.username}
                              key={member.userId._id}
                              isReady={
                                member.isReady ||
                                member.isAdmin ||
                                member.isSpectator
                              }
                              isSpectator={member.isSpectator}
                              isMe={
                                member.userId._id === userContext.details._id
                              }
                              svg={member.userId.svg}
                              isMuted={member.isMuted}
                              isAdmin={isAdmin}
                              handleMute={() =>
                                handleMute(member.userId._id, !member.isMuted)
                              }
                              handleKick={() =>
                                handleKickUser(member.userId._id)
                              }
                            />
                          );
                        })
                    ) : (
                      <div className="no-ser">No Spectators</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-cont">
            <div className="box welcome-screen chatbox">
              <div className="chat-area">
                <div
                  className="chat-fb"
                  id="chat-screen"
                  ref={messagesContainerRef}
                  onScroll={handleChatScroll}
                >
                  {messages
                    .sort(
                      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    )
                    .map((message, index) => {
                      return (
                        <div
                          key={index}
                          className={`chat-msg ${
                            message.type !== undefined
                              ? message.type === 2
                                ? "info-msg"
                                : message.type
                                ? "success-msg"
                                : "critical-msg"
                              : ""
                          }`}
                        >
                          {message.user ? (
                            <span className={`s-id`}>{message?.user}: </span>
                          ) : null}
                          {message.text}
                        </div>
                      );
                    })}
                </div>

                <form className="input-box" onSubmit={handleSendMessage}>
                  <input
                    placeholder="Type message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Room;

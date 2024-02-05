import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/dashboard.css";
import "../style/createRoom.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProfileItem from "./ProfileItem";
import ToggleButton from "react-toggle-button";
import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "../context/SocketContext";
import UserList from "./UserList";

function Room({ setInRoom }) {
  const { roomId } = useParams();
  const modalRef = useRef(null);
  const spanRef = useRef(null);
  const messagesContainerRef = useRef();
  const navigate = useNavigate();

  const [userContext, setUserContext] = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const config = {
    headers: { Authorization: `Bearer ${userContext.token}` },
  };
  const [loading, setLoading] = useState(false);
  const [userList, showUserList] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [showMembers, setShowMember] = useState(false);
  const [roomExists, setRoomExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [spectate, setSpectate] = useState(true);
  const ratingArray = [800, 1200, 1600, 2000, 2400, 2800, 3200];
  const borderRadiusStyle = {};
  const trackStyle = {
    paddingLeft: 14,
    boxSizing: "border-box",
  };

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
    if (response.data.room.admin === userContext.details._id) {
      setAdmin(true);
    }
    setRoomExists(status);
    setInRoom(status);
    setLoading(false);
  };

  useEffect(() => {
    socket.emit(
      "login",
      { userId: userContext.details._id, room: roomId },
      (error) => {
        if (error) {
          console.log(error);
          return toast.error("some error occurred!");
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
        setMembers(members);
      } else {
        navigate("/");
      }
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
    if (message.trim() !== "") {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
    setMessage("");
  };
  const handleMute = (userId, status) => {
    socket.emit("handleMute", { userId, status });
  };
  const handleKickUser = async (userId) => {
    socket.emit("kickUser", userId);
  };

  const handleStatus = (status) => {
    socket.emit("updateStatus", status);
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
    return () => {
      setInRoom(false);
    };
  }, [roomId]);

  useEffect(() => {
    setTimeout(() => {
      setShowMember(true);
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

  if (loading) {
    return (
      <div className="body-content">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "cener",
          }}
        >
          <Spinner color="#222" />
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
      <header className={!showMembers ? "hidden-header" : "room-header"}>
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
        <div
          className={`sidebar ${
            !showMembers ? "hidden-sidebar" : ""
          }  fullSidebar
            `}
        >
          <div className="side-container">
            {members.map((member) => {
              return (
                <ProfileItem
                  title={member.userId.username}
                  key={member.userId._id}
                  Icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28"
                      viewBox="0 -960 960 960"
                      width="28"
                    >
                      <path d="M560-600q-17 0-28.5-11.5T520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560ZM160-440q-17 0-28.5-11.5T120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160Zm400 320q-17 0-28.5-11.5T520-160v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560Zm-400 0q-17 0-28.5-11.5T120-160v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160Z" />
                    </svg>
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="wc-cnt center-wd room-wc">
          {showModal ? (
            <div className="modal">
              <div className="success" ref={modalRef}>
                <div>Give this URL to the people you want to invite </div>
                <input
                  ref={spanRef}
                  type="text"
                  className="url"
                  value={`localhost:3000/room/${roomId}`}
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
              <div className="box welcome-screen userList">
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
                        isReady={member.isReady}
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
          <div className="left-1">
            {isAdmin ? (
              <div className="create-room box">
                <div style={{ paddingBottom: 10 }}>
                  <h1 style={{ color: "#ccc" }}>Create a Race</h1>
                  <h3 style={{ color: "#ccc" }}>
                    Change the settings and create a race to compete with your.
                  </h3>
                </div>
                <div>
                  <div className="input-group">
                    <label>Time Per Problem</label>
                    <div>
                      <div>
                        <select>
                          <option>80</option>
                        </select>
                      </div>
                      <div className="input-info">Max time per question</div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Rounds</label>
                    <div>
                      <div>
                        <select>
                          <option>3</option>
                        </select>
                      </div>
                      <div className="input-info">
                        Number of questions in series
                      </div>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Rating</label>
                    <div>
                      <div className="flex-input">
                        <select>
                          <option>From</option>
                          {ratingArray.map((rating) => (
                            <option key={rating}>{rating}</option>
                          ))}
                        </select>
                        <select>
                          <option>To</option>
                          {ratingArray.map((rating) => (
                            <option key={rating}>{rating}</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-info">
                        Select the problem rating between from and to
                      </div>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Tags</label>
                    <div>
                      <div>
                        <textarea />
                      </div>
                      <div className="input-info">
                        The Problemsets will be given from the selected tags
                      </div>
                    </div>
                  </div>
                </div>
                <Link className="enter-btn">Start Race</Link>
              </div>
            ) : (
              <div className="in-room box">
                <h1>In room</h1>
                <div className="container-user"></div>
              </div>
            )}
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
                              ? message.type
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
            <div className="box welcome-screen userList">
              <div className="flex-heading">
                <h1>Members</h1>
              </div>
              <div className="user-row">
                {members.map((member) => {
                  return (
                    <UserList
                      title={member.userId.username}
                      key={member.userId._id}
                      isReady={member.isReady}
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
        </div>
      </section>
    </div>
  );
}

export default Room;

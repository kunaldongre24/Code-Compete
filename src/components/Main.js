import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useContext,
} from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../constant/Api_base_url";
import axios from "axios";
import Spinner from "./Spinner";
import { ReqCallContext } from "../context/ReqCallContext";
import Dashboard from "./Dashboard";
import SidebarItem from "./SidebarItem";
import Search from "./Search";
import Room from "./Room";

function Main(props) {
  const navigate = useNavigate();
  const [fullSidebar, setSidebar] = useState(true);
  const [inRoom, setInRoom] = useState(false);
  const [reqCall, setReqCall] = useContext(ReqCallContext);
  const { userContext, setUserContext } = props;
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebar, showSidebar] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        },
        withCredentials: true,
        validateStatus: function (status) {
          return status >= 200; // Treat any status code in the 2xx range as a success
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, details: null, token: null };
        });
      }
    } catch (error) {
      // Handle network or other errors here
      console.error("An error occurred:", error);
    } finally {
      setDataLoading(false);
    }
  }, [setUserContext, userContext.token]);
  useEffect(() => {
    fetchUserDetails();
  }, [userContext.token]);
  useEffect(() => {
    setReqCall(reqCall + 1);
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.get(API_BASE_URL + "/auth/userLogout", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });

      window.localStorage.setItem("userLogout", Date.now());
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (dataLoading) {
    return (
      <div className="body-content no-padding">
        <Spinner color="#555" />
      </div>
    );
  }
  return (
    <div>
      <div>
        <header className={inRoom ? "hidden-header" : ""}>
          <div
            onClick={() => {
              showSidebar(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="35"
              viewBox="0 -960 960 960"
              width="35"
            >
              <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
            </svg>
          </div>
          <div className="flex__align">
            <div className="fheader">
              <span>I</span> <span>C</span> <span>C</span> <span>P</span>
            </div>

            <button
              className="dashboard__btn logout__btn"
              onClick={() => {
                logoutHandler();
                navigate("/");
              }}
            >
              <span className="svgBtn_text">LOGOUT</span>
            </button>
          </div>
        </header>
        <div
          className={`sidebar ${inRoom ? "hidden-sidebar" : ""} ${
            fullSidebar ? "fullSidebar" : "noSidebar"
          }`}
        >
          <div className="side-container">
            <SidebarItem
              link={"/"}
              title="Home"
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
            <SidebarItem
              link={"/search"}
              title="Search"
              Icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              }
            />

            <SidebarItem
              link={"/contibute"}
              title="contribute"
              Icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M600-160q-17 0-28.5-11.5T560-200q0-17 11.5-28.5T600-240h80q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720h-80q-17 0-28.5-11.5T560-760q0-17 11.5-28.5T600-800h80q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560t28.5 11.5Q880-537 880-520v80q0 17-11.5 28.5T840-400t-28.5 11.5Q800-377 800-360v80q0 50-35 85t-85 35h-80Zm-320 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400t-28.5-11.5Q80-423 80-440v-80q0-17 11.5-28.5T120-560t28.5-11.5Q160-583 160-600v-80q0-50 35-85t85-35h80q17 0 28.5 11.5T400-760q0 17-11.5 28.5T360-720h-80q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h80q17 0 28.5 11.5T400-200q0 17-11.5 28.5T360-160h-80Z" />
                </svg>
              }
            />

            <SidebarItem
              link={"/profile"}
              title="profile"
              Icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
      <div className={fullSidebar ? "left-space" : "no-space"}>
        <Routes>
          <Route
            exact
            path="/"
            index
            element={
              <Suspense
                fallback={<Spinner color="#222" style={{ marginTop: 20 }} />}
              >
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            exact
            path="/search"
            index
            element={
              <Suspense
                fallback={<Spinner color="#222" style={{ marginTop: 20 }} />}
              >
                <Search />
              </Suspense>
            }
          />
          <Route
            exact
            path="/room/:roomId"
            index
            element={
              <Suspense
                fallback={<Spinner color="#222" style={{ marginTop: 20 }} />}
              >
                <Room
                  setRoomCreated={props.setRoomCreated}
                  setInRoom={setInRoom}
                />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Main;

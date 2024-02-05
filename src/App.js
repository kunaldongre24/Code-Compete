import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  useContext,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import "./style/app.css";
import "./style/adminhome.css";
import "./style/inPlay.css";
import "./style/odds.css";
import Spinner from "./components/Spinner";
import axios from "axios";
import API_BASE_URL from "./constant/Api_base_url";
import { ReqCallContext, ReqCallProvider } from "./context/ReqCallContext";
import Register from "./components/Register";
import { SocketProvider } from "./context/SocketContext";
const Main = lazy(() => import("./components/Main"));
const Login = lazy(() => import("./components/Login"));

function App() {
  const [userContext, setUserContext] = useContext(AuthContext);
  const [reqCall, setReqCall] = useContext(ReqCallContext);
  const [roomCreated, setRoomCreated] = useState(false);
  const navigate = useNavigate();

  const verifyUser = async () => {
    try {
      if (userContext.token) {
        const response = await axios.post(
          API_BASE_URL + "/auth/checkUserActive",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
        }
      }
    } catch (error) {
      setUserContext((oldValues) => {
        return { ...oldValues, token: null };
      });
    }
  };
  useEffect(() => {
    verifyUser();
  }, [reqCall]);
  const syncLogout = useCallback((event) => {
    if (event.key === "userLogout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload();
      navigate("/");
    }
  }, []);
  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  return (
    <div className="app">
      {roomCreated ? <div id="uv-background"></div> : ""}
      <Suspense fallback={<Spinner color="#222" style={{ marginTop: 20 }} />}>
        {userContext.token ? (
          <Main
            userContext={userContext}
            setUserContext={setUserContext}
            setRoomCreated={setRoomCreated}
          />
        ) : (
          <div>
            <div className="content non-user">
              <Routes>
                <Route
                  exact
                  path="/"
                  index
                  element={
                    <Suspense
                      fallback={
                        <Spinner color="#222" style={{ marginTop: 20 }} />
                      }
                    >
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  exact
                  path="/register"
                  index
                  element={
                    <Suspense
                      fallback={
                        <Spinner color="#222" style={{ marginTop: 20 }} />
                      }
                    >
                      <Register />
                    </Suspense>
                  }
                />

                <Route path="*" element={<Login />} />
              </Routes>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}

const AppWrapper = () => (
  <AuthProvider>
    <SocketProvider>
      <ReqCallProvider>
        <Router>
          <App />
        </Router>
      </ReqCallProvider>
    </SocketProvider>
  </AuthProvider>
);
export default AppWrapper;

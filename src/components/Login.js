import React, { useContext, useEffect, useState } from "react";
import "../style/login.css";
import "../style/register.css";
import Spinner from "./Spinner";
import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [authContext, setAuthContext] = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/userLogin`,
        {
          username: username.toLowerCase(),
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const data = await response.data;
        setAuthContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
        navigate("/");
      } else {
        setError(response.data.err);
      }
    } catch (error) {
      setError(
        error.response.data.err ? error.response.data.err : "Incorrect Password"
      );
      setPassword("");
      setCaptchaValue("");
    } finally {
      setLoading(false);
      setPassword("");
      setCaptchaValue("");
    }
  };

  return (
    <div className="login">
      <form className="form-container" onSubmit={login}>
        <div
          className="form-header"
          style={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: 40,
          }}
        >
          <span>I</span> <span>C</span> <span>C</span> <span>P</span>
        </div>
        <div className="login__container">
          {err ? <div className="error-message">{err}</div> : ""}
          <div className="row-input">
            <label>Username</label>
            <input
              type="text"
              className="input__textBox"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="row-input">
            <label>PASSWORD</label>
            <input
              type="password"
              className="input__textBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button className="main__btn" type="submit">
            {isLoading ? <Spinner /> : "LOGIN"}
          </button>
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              fontWeight: "600",
            }}
          ></div>
        </div>
        <div>
          <div className="login-button link">
            <Link to="/register">Register</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Login;

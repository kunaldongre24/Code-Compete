import React, { useContext, useEffect, useState } from "react";
import "../style/login.css";
import "../style/register.css";
import Spinner from "./Spinner";
import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [comfirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [authContext, setAuthContext] = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (password !== comfirmPassword) {
        setLoading(false);
        return setError("Password and Confirm Password should be same");
      }
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        { name: name, username: username.toLowerCase(), password, email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.userCreated) {
        const data = await response.data;
        setMessage(data.msg);
      } else {
        setError(response.data.msg);
      }
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setName("");
      setEmail("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(
        error.response.data.msg
          ? error.response.data.msg
          : "Please fill all fields"
      );
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="form-container" onSubmit={signup}>
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
          {message ? <div className="success-message">{message}</div> : ""}
          <div className="row-input">
            <label>Name</label>
            <input
              type="text"
              className="input__textBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="row-input">
            <label>Username</label>
            <input
              type="text"
              className="input__textBox"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <div>
              Be careful you will not be able to change your username once you
              choose.
            </div>
          </div>
          <div className="row-input">
            <label>Email</label>
            <input
              type="email"
              className="input__textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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
            <div>Password should contain at least six characters</div>
          </div>
          <div className="row-input">
            <label>CONFIRM PASSWORD</label>
            <input
              type="password"
              className="input__textBox"
              value={comfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </div>

          <button className="main__btn" type="submit">
            {isLoading ? <Spinner /> : "REGISTER"}
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
            <Link to="/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Register;

import React, { useEffect, useRef, useState } from "react";
import "../styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { setToken, setUsername } from "../../redux/slices/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Toast } from "../extraFunctions";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ref = useRef();
  const passwordRef = useRef();

  const { url } = useSelector((state) => state.config);

  // input ma'lumotlari saqlanadi
  const [usernameInput, setUsernameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  const [passwordShow, setPasswordShow] = useState(false);

  // Kirish, token olish
  function signIn() {
    if (usernameInput && passwordInput) {
      axios
        .post(`${url}/jwt/access`, {
          username: usernameInput,
          password: passwordInput,
        })
        .then((result) => {
          if (result.data.accessToken) {
            dispatch(setToken(result.data.accessToken));
            dispatch(setUsername(result.data.username));
            Cookies.set("token", result.data.accessToken);
            Cookies.set("username", result.data.username);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.response.data.message) {
            Toast.error(error.response.data.message);
          } else if (error.response.data.password) {
            Toast.error(error.response.data.password);
          } else if (error.response.data.username) {
            Toast.error(error.response.data.message);
          }
        });
    } else {
      Toast.error("Ma'lumotingizni to'ldiring");
    }
  }

  // parol inputga enter bosilganda signIn ishga tushadi
  function submitLogin(e) {
    if (e.key === "Enter") {
      signIn();
    }
  }

  function targetPassword(e) {
    if (e.key === "Enter") {
      ref.current.focus();
    }
  }

  return (
    <div className="login">
      <div className="login_box">
        <h1>Signin</h1>
        <div className="login_input_box">
          <input
            ref={passwordRef}
            onKeyDown={targetPassword}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="login_input"
            required
            type="text"
          />
          <div className="login_input_animation">
            <FontAwesomeIcon icon={faUser} /> Ismingiz
          </div>
        </div>
        <div className="login_input_box">
          <input
            ref={ref}
            onKeyDown={submitLogin}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="login_input login_input_password"
            required
            type={passwordShow ? "text" : "password"}
          />
          <div className="login_input_animation">
            <FontAwesomeIcon icon={faLock} /> Parol
          </div>
          <div className="login_input_eye">
            {" "}
            {passwordShow ? (
              <FontAwesomeIcon
                onClick={() => setPasswordShow(false)}
                icon={faEyeSlash}
              />
            ) : (
              <FontAwesomeIcon
                onClick={() => setPasswordShow(true)}
                icon={faEye}
              />
            )}
          </div>
        </div>
        <div>
          <button onClick={signIn} className="login_btn">
            Kirish
          </button>
        </div>
      </div>
    </div>
  );
}

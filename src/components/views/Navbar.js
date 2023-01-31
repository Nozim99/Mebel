import React, { useEffect, useRef, useState } from "react";
import "../styles/nav.css";
import mebelLogo from "../images/mebelLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAngleDown,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setToken, setUsername } from "../../redux/slices/config";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  const { token, username } = useSelector((state) => state.config);

  const [modal, setModal] = useState(false);

  // modaldan tashqariga bossa modal yopiladi
  useEffect(() => {
    function handler(e) {
      if (ref.current) {
        if (!ref.current.contains(e.target)) {
          setModal(false);
        }
      }
    }

    document.addEventListener("mousedown", handler);
  });

  function exit() {
    dispatch(setToken());
    dispatch(setUsername());
    Cookies.remove("token");
    Cookies.remove("username");
    navigate("/login");
  }

  return (
    <>
      <div className="nav">
        <img
          onClick={() => navigate("/")}
          className="nav_logo"
          src={mebelLogo}
          alt="mebel logo"
        />
        <div className="nav_right">
          {token ? (
            <div
              ref={ref}
              onClick={() => setModal(!modal)}
              className="nav_account"
            >
              <FontAwesomeIcon className="nav_account_user" icon={faUser} />
              <span className="nav_account_name">
                {username ? username : ""}
              </span>
              <FontAwesomeIcon
                className="nav_accont_angle"
                icon={faAngleDown}
              />
              {/* modal */}
              {modal ? (
                <div className="nav_account_modals">
                  <div onClick={exit} className="nav_account_modal">
                    Chiqish <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import {
  setAdminData,
  addAdminData,
  updateAdminData,
} from "../../redux/slices/pagesData";
import axios from "axios";
import { URLS } from "../../url";
import Loading from "./extra/Loading";
import CurrencyInput from "react-currency-input-field";
import { PatternFormat } from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Toast } from "../extraFunctions";
import Loading2 from "./extra/Loading2";

export default function Admin() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { adminData } = useSelector((state) => state.data);

  const [createTermModal, setCreateTermModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);

  // Ref
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const phoneRef = useRef();

  // create Admin
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();
  const [phone, setPhone] = useState();

  // Class create
  const [nameClass, setNameClass] = useState();
  const [passwordClass, setPasswordClass] = useState();
  const [fullNameClass, setFullNameClass] = useState();
  const [phoneClass, setPhoneClass] = useState();

  // change Admin
  const [namec, setNamec] = useState();
  const [passwordc, setPasswordc] = useState();
  const [fullNamec, setFullNamec] = useState();
  const [phonec, setPhonec] = useState();

  const [userId, setUserId] = useState();

  // Ref change
  const passwordcRef = useRef();
  const namecRef = useRef();
  const phonecRef = useRef();

  // Class change
  const [namecClass, setNamecClass] = useState();
  const [passwordcClass, setPasswordcClass] = useState();
  const [fullNamecClass, setFullNamecClass] = useState();
  const [phonecClass, setPhonecClass] = useState();

  const createAdmin = () => {
    if (name && password && fullName && phone) {
      axios
        .post(
          URLS.start + URLS.create_admin,
          {
            username: String(name),
            password: String(password),
            name: String(fullName),
            phone: String(phone),
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setCreateTermModal(false);
          Toast.success("Admin yaratildi");
          dispatch(
            addAdminData({
              username: String(name),
              password: String(password),
              name: String(fullName),
              phone: Number(phone),
              role: "USER",
            })
          );
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Admin yaratilmadi");
        });
    } else {
      if (!name) setNameClass("border-red");
      if (!password) setPasswordClass("border-red");
      if (!fullName) setFullNameClass("border-red");
      if (!phone) setPhoneClass("border-red");
    }
  };

  const [userInfo, setUserInfo] = useState();

  const openModal = (id) => {
    setUserInfo();
    setChangeModal(true);
    setUserId(id);

    axios
      .get(URLS.start + URLS.admin + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setUserInfo(result.data);
        setNamec(result.data.username);
        setFullNamec(result.data.name);
        setPhonec(result.data.phone);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateAdmin = () => {
    if (namec && passwordc && fullNamec && phonec) {
      axios
        .put(
          URLS.start + URLS.admin_update + userId,
          {
            username: String(namec),
            password: String(passwordc),
            name: String(fullNamec),
            phone: String(phonec),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("Admin ma'lumoti o'zgartirildi");
          dispatch(
            updateAdminData([
              userId,
              String(namec),
              String(fullNamec),
              String(phonec),
            ])
          );
        })
        .catch((error) => {
          Toast.error("Admin ma'lumoti o'zgartirilmadi");
          console.error(error);
        });
    } else {
      if (!namec) setNamecClass("border-red");
      if (!passwordc) setPasswordcClass("border-red");
      if (!fullNamec) setFullNamecClass("border-red");
      if (!phonec) setPhonecClass("border-red");
    }
  };

  useEffect(() => {
    dispatch(setPage("/admin"));

    if (!adminData) {
      axios
        .get(URLS.start + URLS.admins, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setAdminData(result.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!adminData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Adminlar ro'yxati</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Adminlar ro'yxati</h3>
              <button
                onClick={() => setCreateTermModal(true)}
                type="button"
                className="btn btn-success"
              >
                Admin yaratish
              </button>
            </div>

            <div className="mahsulotlar_items contracts_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">Nomi</th>
                    <th scope="col">Telefon raqami</th>
                    <th scope="col">Foydalanuvchi nomi</th>
                    <th scope="col">Foydalanuvchi roli</th>
                  </tr>
                </thead>
                <tbody>
                  {!adminData.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    adminData.map((item, index) => {
                      return (
                        <tr
                          onClick={() => openModal(item.id)}
                          className="mahsulotlar_lists"
                          key={item.id}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{item.name}</td>
                          <td>{item.phone} </td>
                          <td>{item.username} </td>
                          <td>{item.role}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Admin yaratish modal */}
      {createTermModal ? (
        <>
          <div
            onClick={() => setCreateTermModal(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setCreateTermModal(false)}
                icon={faXmark}
              />{" "}
              <span>Admin yaratish</span>
            </div>

            <label
              htmlFor="admin-name-input"
              className="product_change_input_name"
            >
              <span className={name ? "opacity-none" : "red"}>*</span>{" "}
              Foydalanuvchi nomi
            </label>
            <input
              className={nameClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordRef.current.focus();
                }
              }}
              onChange={(e) => {
                setName(e.target.value);
                setNameClass();
              }}
              id="admin-name-input"
              type="text"
              required
            />

            <label
              htmlFor="adminn-parol-input"
              className="product_change_input_name"
            >
              <span className={password ? "opacity-none" : "red"}>*</span> Parol
            </label>
            <input
              className={passwordClass}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordClass();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fullNameRef.current.focus();
                }
              }}
              ref={passwordRef}
              autoComplete="new-password"
              type="password"
              id="adminn-parol-input"
            />

            <label
              htmlFor="admin-username-input"
              className="product_change_input_name"
            >
              <span className={fullName ? "opacity-none" : "red"}>*</span> Nomi
            </label>
            <input
              className={fullNameClass}
              ref={fullNameRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  phoneRef.current.focus();
                }
              }}
              onChange={(e) => {
                setFullName(e.target.value);
                setFullNameClass();
              }}
              id="admin-username-input"
              type="text"
              required
            />

            <label
              htmlFor="admin-phone-input"
              className="product_change_input_name"
            >
              <span className={phone ? "opacity-none" : "red"}>*</span> Telefon
              raqami
            </label>
            <PatternFormat
              getInputRef={phoneRef}
              className={phoneClass}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[()_-]/g, ""));
                setPhoneClass();
              }}
              id="admin-phone-input"
              format="(##)-###-##-##"
              mask="_"
            />

            <button
              onClick={createAdmin}
              className="btn btn-success btn-sm mt-3"
            >
              Yaratish
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {/* Adminni ma'lumotini o'zgartirish */}
      {changeModal ? (
        <>
          <div
            onClick={() => setChangeModal(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setChangeModal(false)}
                icon={faXmark}
              />{" "}
              <span>Admin O'zgartirish</span>
            </div>
            {userInfo ? (
              <>
                <label
                  htmlFor="admin-name-input-change"
                  className="product_change_input_name"
                >
                  <span className={namec ? "opacity-none" : "red"}>*</span>{" "}
                  Foydalanuvchi nomi
                </label>
                <input
                  defaultValue={userInfo.username}
                  className={namecClass}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      passwordcRef.current.focus();
                    }
                  }}
                  onChange={(e) => {
                    setNamec(e.target.value);
                    setNamecClass();
                  }}
                  id="admin-name-input-change"
                  type="text"
                  required
                />

                <label
                  htmlFor="adminn-parol-input-change"
                  className="product_change_input_name"
                >
                  <span className={passwordc ? "opacity-none" : "red"}>*</span>{" "}
                  Parol
                </label>
                <input
                  className={passwordcClass}
                  onChange={(e) => {
                    setPasswordc(e.target.value);
                    setPasswordcClass();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      namecRef.current.focus();
                    }
                  }}
                  ref={passwordcRef}
                  autoComplete="new-password"
                  type="password"
                  id="adminn-parol-input-change"
                />

                <label
                  htmlFor="admin-username-input-change"
                  className="product_change_input_name"
                >
                  <span className={fullNamec ? "opacity-none" : "red"}>*</span>{" "}
                  Nomi
                </label>
                <input
                  defaultValue={userInfo.name}
                  className={fullNamecClass}
                  ref={namecRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      phonecRef.current.focus();
                    }
                  }}
                  onChange={(e) => {
                    setFullNamec(e.target.value);
                    setFullNamecClass();
                  }}
                  id="admin-username-input-change"
                  type="text"
                  required
                />

                <label
                  htmlFor="admin-phone-input-change"
                  className="product_change_input_name"
                >
                  <span className={phonec ? "opacity-none" : "red"}>*</span>{" "}
                  Telefon raqami
                </label>
                <PatternFormat
                  defaultValue={userInfo.phone}
                  getInputRef={phonecRef}
                  className={phonecClass}
                  onChange={(e) => {
                    setPhonec(e.target.value.replace(/[()_-]/g, ""));
                    setPhonecClass();
                  }}
                  id="admin-phone-input-change"
                  format="(##)-###-##-##"
                  mask="_"
                />

                <button
                  onClick={updateAdmin}
                  className="btn btn-success btn-sm mt-3"
                >
                  Yaratish
                </button>
              </>
            ) : (
              <Loading2 />
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import {
  setCargoData,
  addCargoData,
  changeCargoData,
} from "../../redux/slices/pagesData";
import axios from "axios";
import { URLS } from "../../url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faMoneyBill,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Loading from "./extra/Loading";
import { PatternFormat } from "react-number-format";
import { Toast } from "../extraFunctions";
import CurrencyInput from "react-currency-input-field";

export default function Cargo() {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.config);
  const { cargoData } = useSelector((state) => state.data);

  // Yetkazib beruvchi YARATISH
  const [createModal, setCreateModal] = useState(false);

  const phoneRef = useRef();

  const [name, setName] = useState();
  const [phone, setPhone] = useState();

  const [nameClass, setNameClass] = useState();
  const [phoneClass, setPhoneClass] = useState();

  const create = () => {
    if (name && phone) {
      axios
        .post(
          URLS.start + URLS.merchant_create,
          {
            name: String(name),
            phone: String(phone),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("Yetkazib beruvchi yaratildi");
          dispatch(
            addCargoData({
              name: String(name),
              phone: String(phone),
            })
          );
        });
    } else {
      if (!name) setNameClass("border-red");
      if (!phone) setPhoneClass("border-red");
    }
  };
  // Yetkazib beruvchi YARATISH /

  // Yetkazib beruvchini O'ZGARTIRISH
  const [changeModal, setChangeModal] = useState(false);

  const [changeId, setChangeId] = useState();

  const chPhoneRef = useRef();

  const [chName, setChName] = useState();
  const [chPhone, setChPhone] = useState();

  const [chNameC, setChNameC] = useState();
  const [chPhoneC, setChPhoneC] = useState();

  const open = (id) => {
    setChangeModal(true);
    setChangeId(id);

    const changeItems = cargoData.find((e) => e.id === id);
    setChName(changeItems.name);
    setChPhone(changeItems.phone);
  };

  const change = () => {
    if (chName && chPhone) {
      axios
        .put(
          URLS.start + URLS.merchant_update + changeId,
          {
            name: String(chName),
            phone: String(chPhone),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          Toast.success("O'zgartirildi");
          dispatch(
            changeCargoData([changeId, String(chName), String(chPhone)])
          );
        })
        .catch((error) => {
          console.error(error);
          Toast.error("O'zgartirilmadi");
        });
    } else {
      if (!chName) setChNameC("border-red");
      if (!chPhone) setChPhoneC("border-red");
    }
  };
  // Yetkazib beruvchini O'ZGARTIRISH /

  // To'lov qilish
  const [payM, setPayM] = useState(false);
  // To'lov qilish /

  // Qarzni hisoblash
  const [debt, setDebt] = useState([]);

  const closeDebt = (id) => {
    setDebt(debt.filter((item) => item.id !== id));
  };

  const openDebt = (id) => {
    axios
      .get(URLS.start + URLS.merchant_calc + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setDebt([...debt, { debt: result.data.debt, id }]);
      })
      .catch((error) => {
        console.error(error);
        Toast.error("Keyinroq urunib ko'ring");
      });
  };
  // Qarzni hisoblash /

  useEffect(() => {
    dispatch(setPage("/cargo"));

    axios
      .get(URLS.start + URLS.merchants, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setCargoData(result.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!cargoData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Yetkazib beruvchilar ro'yxati</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Yetkazib beruvchilar ro'yxati</h3>
              <button
                onClick={() => setCreateModal(true)}
                type="button"
                className="btn btn-primary"
              >
                Yetkazib beruvchi yaratish
              </button>
            </div>

            <div className="mahsulotlar_items contracts_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">id</th>
                    <th scope="col">Nomi</th>
                    <th scope="col">Telefon raqami</th>
                    <th scope="col">Yaratdi</th>
                    <th scope="col">Yaratilgan vaqti</th>
                    <th scope="col">Qarzni hisoblash</th>
                    <th scope="col">To'lov qilish</th>
                    <th scope="col">O'zgartirish</th>
                  </tr>
                </thead>
                <tbody>
                  {!cargoData.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    cargoData.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.name} </td>
                          <td>{item.phone} </td>
                          <td>{item.createdBy}</td>
                          <td>{item.createdAt}</td>
                          <td>
                            {" "}
                            {debt.some((obj) => obj.id === item.id) ? (
                              debt
                                .find((obj) => obj.id === item.id)
                                .debt.toLocaleString() + " so'm"
                            ) : (
                              <button
                                onClick={() => openDebt(item.id)}
                                type="button"
                                className="btn btn-primary btn-sm"
                              >
                                <span>
                                  <FontAwesomeIcon
                                    className="cargo_btn_svg"
                                    icon={faCalculator}
                                  />{" "}
                                  Qarzni hisoblash
                                </span>
                              </button>
                            )}
                          </td>
                          <td>
                            {" "}
                            <button
                              onClick={() => setPayM(true)}
                              type="button"
                              className="btn btn-success btn-sm"
                            >
                              <FontAwesomeIcon
                                className="cargo_btn_svg"
                                icon={faMoneyBill}
                              />{" "}
                              To'lov qilish
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => open(item.id)}
                              style={{
                                background: "#FB923C",
                                borderColor: "#FB923C",
                              }}
                              type="button"
                              className="btn btn-success btn-sm"
                            >
                              <FontAwesomeIcon
                                className="cargo_btn_svg"
                                icon={faPenToSquare}
                              />{" "}
                              O'zgartirish
                            </button>
                          </td>
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

      {/* Yetkazib beruvchi YARATISH modali */}
      {createModal ? (
        <>
          <div
            onClick={() => setCreateModal(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setCreateModal(false)}
                icon={faXmark}
              />{" "}
              <span>Yetkazib beruvchi yaratish</span>
            </div>

            <label
              htmlFor="create-cargo-name"
              className="product_change_input_name"
            >
              <span className={name ? "opacity-none" : "red"}>*</span> Nomi
            </label>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") phoneRef.current.focus();
              }}
              className={nameClass}
              onChange={(e) => {
                setName(e.target.value);
                setNameClass();
              }}
              id="create-cargo-name"
              type="text"
              required
            />

            <label
              htmlFor="create-cargo-phone"
              className="product_change_input_name"
            >
              <span className={phone ? "opacity-none" : "red"}>*</span> Telefon
              raqami
            </label>
            <PatternFormat
              getInputRef={phoneRef}
              className={phoneClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") create();
              }}
              onChange={(e) => {
                setPhone(e.target.value.replace(/-/g, ""));
                setPhoneClass();
              }}
              id="create-cargo-phone"
              format="##-###-##-##"
              mask="_"
            />

            <button onClick={create} className="btn btn-success btn-sm mt-3">
              Qo'shish
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {/* Yetkazib bervchini O'ZGARTIRISH modali */}
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
              <span style={{ fontSize: "0.98em" }}>
                Yetkazib beruvchini o'zgartirish
              </span>
            </div>

            <label
              htmlFor="change-cargo-name"
              className="product_change_input_name"
            >
              <span className={chName ? "opacity-none" : "red"}>*</span> Nomi
            </label>
            <input
              defaultValue={chName}
              onKeyDown={(e) => {
                if (e.key === "Enter") chPhoneRef.current.focus();
              }}
              className={chNameC}
              onChange={(e) => {
                setChName(e.target.value);
                setChNameC();
              }}
              id="change-cargo-name"
              type="text"
              required
            />

            <label
              htmlFor="change-cargo-phone"
              className="product_change_input_name"
            >
              <span className={chPhone ? "opacity-none" : "red"}>*</span>{" "}
              Telefon raqami
            </label>
            <PatternFormat
              defaultValue={chPhone}
              onKeyDown={(e) => {
                if (e.key === "Enter") change();
              }}
              getInputRef={chPhoneRef}
              className={chPhoneC}
              onChange={(e) => {
                setChPhone(e.target.value.replace(/-/g, ""));
                setChPhoneC();
              }}
              id="change-cargo-phone"
              format="##-###-##-##"
              mask="_"
            />

            <button onClick={change} className="btn btn-success btn-sm mt-3">
              O'zgartirish
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {/* To'lov qilish modali */}
      {payM ? (
        <>
          <div
            onClick={() => setPayM(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon onClick={() => setPayM(false)} icon={faXmark} />{" "}
              <span style={{ fontSize: "0.95em" }}>
                Yetkazib beruvchiga to'lov qilish
              </span>
            </div>

            <label
              htmlFor="to'lov-qilish-naqd-pul"
              className="product_change_input_name"
            >
              <span className={chName ? "opacity-none" : "red"}>*</span> Naqd
              pul
            </label>
            <CurrencyInput placeholder="so'm" id="narx" decimalsLimit={2} />

            <label
              htmlFor="to'lov-qilish-karta-orqali"
              className="product_change_input_name"
            >
              <span className={chName ? "opacity-none" : "red"}>*</span> Karta
              orqali
            </label>
            <CurrencyInput
              placeholder="so'm"
              id="to'lov-qilish-karta-orqali"
              decimalsLimit={2}
            />

            <label
              htmlFor="to'lov-qilish-terminal-orqali"
              className="product_change_input_name"
            >
              <span className={chName ? "opacity-none" : "red"}>*</span>{" "}
              Terminal orqali
            </label>
            <CurrencyInput
              placeholder="so'm"
              id="to'lov-qilish-terminal-orqali"
              decimalsLimit={2}
            />

            <label
              htmlFor="to'lov-qilish-izoh"
              className="product_change_input_name"
            >
              <span className={chName ? "opacity-none" : "red"}>*</span> Izoh
            </label>
            <textarea name="" id="to'lov-qilish-izoh" rows="5"></textarea>

            <button onClick={change} className="btn btn-success btn-sm mt-3">
              To'lash
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

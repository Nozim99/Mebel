import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import "../styles/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { URLS } from "../../url";
import axios from "axios";
import {
  setClientsData,
  addClient,
  updateClient,
} from "../../redux/slices/pagesData";
import { Toast } from "../extraFunctions";
import Loading from "./extra/Loading";
import { PatternFormat } from "react-number-format";
import Loading2 from "./extra/Loading2";

export default function Clients() {
  const dispatch = useDispatch();
  const { clientsData } = useSelector((state) => state.data);
  const { token } = useSelector((state) => state.config);

  const [createModal, setCreateModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);

  // serverga yuboriladigan ma'lumotlar
  const [name, setName] = useState();
  const [pnfl, setPnfl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [secondPhoneNumber, setSecondPhoneNumber] = useState("");
  const [thirdPhoneNumber, setThirdPhoneNumber] = useState("");
  const [occupation, setOccupation] = useState();

  // ma'lumot kiritilmagan input uchun xatoni ko'rsatish
  const [nameClass, setNameClass] = useState();
  const [pnflClass, setPnflClass] = useState();
  const [birthDateClass, setBirthDataClass] = useState();
  const [addressClass, setAddressClass] = useState();
  const [phoneNumberClass, setPhoneNumberClass] = useState();
  const [phoneSecondNumberClass, setPhoneSecondNumberClass] = useState();
  const [phoneThirdNumberClass, setPhoneThirdNumberClass] = useState();
  const [occupationClass, setOccupationClass] = useState();

  // id bo'yicha olingan mijoz ma'lumoti
  const [clientData, setClientData] = useState();
  const [clientId, setClientId] = useState();

  // mijozni o'zgartiriladigan ma'lumotlar
  const [changeName, setChangeName] = useState();
  const [changePnfl, setChangePnfl] = useState("");
  const [changeBirthDate, setChangeBirthDate] = useState("");
  const [changeAddress, setChangeAddress] = useState();
  const [changePhoneNumber, setChangePhoneNumber] = useState();
  const [changeSecondPhoneNumber, setChangeSecondPhoneNumber] = useState("");
  const [changeThirdPhoneNumber, setChangeThirdPhoneNumber] = useState("");
  const [changeOccupation, setChangeOccupation] = useState();

  // ma'lumot kiritilmagan input uchun xatoni ko'rsatish
  const [changeNameClass, setChangeNameClass] = useState();
  const [changePnflClass, setChangePnflClass] = useState();
  const [changeBirthDateClass, setChangeBirthDataClass] = useState();
  const [changeAddressClass, setChangeAddressClass] = useState();
  const [changePhoneNumberClass, setChangePhoneNumberClass] = useState();
  const [changeOccupationClass, setChangeOccupationClass] = useState();
  const [changePhoneSecondNumberClass, setChangePhoneSecondNumberClass] =
    useState();
  const [changePhoneThirdNumberClass, setChangePhoneThirdNumberClass] =
    useState();

  function saveClientData(id) {
    setClientData();
    setChangeModal(true);
    setClientId(id);

    axios
      .get(URLS.start + URLS.client + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setClientData(result.data);

        setChangeName(result.data.fullName);
        setChangePnfl(result.data.pinfl);
        setChangeBirthDate(result.data.dateOfBirth);
        setChangeAddress(result.data.address);
        setChangePhoneNumber(result.data.phoneNumber.replace(/-/g, ""));
        setChangeSecondPhoneNumber(result.data.secondPhoneNumber || "");
        setChangeThirdPhoneNumber(result.data.thirdPhoneNumber || "");
        setChangeOccupation(result.data.workplace);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function changeClientData() {
    if (
      !changeName ||
      (changePnfl ? changePnfl.includes("_") : !changePnfl) ||
      (changeBirthDate ? changeBirthDate.includes("_") : true) ||
      (changeSecondPhoneNumber
        ? changeSecondPhoneNumber.includes("_")
        : false) ||
      (changeThirdPhoneNumber ? changeThirdPhoneNumber.includes("_") : false) ||
      !changeAddress ||
      (changePhoneNumber ? changePhoneNumber.includes("_") : true) ||
      !changeOccupation
    ) {
      if (!changeName) setChangeNameClass("border-red");
      if (!changePnfl) setChangePnflClass("border-red");
      if (changePnfl) {
        if (changePnfl.includes("_")) setChangePnflClass("border-red");
      }
      if (!changeBirthDate) setChangeBirthDataClass("border-red");
      if (changeBirthDate) {
        if (changeBirthDate.includes("_"))
          setChangeBirthDataClass("border-red");
      }
      if (!changeAddress) setChangeAddressClass("border-red");
      if (!changePhoneNumber) setChangePhoneNumberClass("border-red");
      if (changePhoneNumber) {
        if (changePhoneNumber.includes("_")) {
          setChangePhoneNumberClass("border-red");
        }
      }
      if (changeSecondPhoneNumber) {
        if (changeSecondPhoneNumber.includes("_")) {
          setChangePhoneSecondNumberClass("border-red");
        }
      }
      if (changeThirdPhoneNumber) {
        if (changeThirdPhoneNumber.includes("_")) {
          setChangePhoneThirdNumberClass("border-red");
        }
      }
      if (!changeOccupation) setChangeOccupationClass("border-red");
    } else {
      axios
        .put(
          URLS.start + URLS.client_update + clientId,
          {
            fullName: String(changeName),
            pinfl: String(changePnfl),
            dateOfBirth: changeBirthDate,
            address: String(changeAddress),
            phoneNumber: String(changePhoneNumber),
            secondPhoneNumber: changeSecondPhoneNumber
              ? String(changeSecondPhoneNumber)
              : "",
            thirdPhoneNumber: changeThirdPhoneNumber
              ? String(changeThirdPhoneNumber)
              : "",
            workplace: String(changeOccupation),
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
            updateClient([
              clientId,
              {
                id: clientId,
                fullName: String(changeName),
                pinfl: String(changePnfl),
                dateOfBirth: changeBirthDate,
                address: String(changeAddress),
                phoneNumber: String(changePhoneNumber),
                secondPhoneNumber: changeSecondPhoneNumber
                  ? String(changeSecondPhoneNumber)
                  : "",
                thirdPhoneNumber: changeThirdPhoneNumber
                  ? String(changeThirdPhoneNumber)
                  : "",
                workplace: String(changeOccupation),
              },
            ])
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function create() {
    if (
      !name ||
      (pnfl ? pnfl.includes("_") : true) ||
      (birthDate ? birthDate.includes("_") : !birthDate) ||
      (secondPhoneNumber ? secondPhoneNumber.includes("_") : false) ||
      (thirdPhoneNumber ? thirdPhoneNumber.includes("_") : false) ||
      !address ||
      (phoneNumber ? phoneNumber.includes("_") : true) ||
      !occupation
    ) {
      if (!name) setNameClass("border-red");
      if (!pnfl) setPnflClass("border-red");
      if (pnfl) {
        if (pnfl.includes("_")) setPnflClass("border-red");
      }
      if (!birthDate) setBirthDataClass("border-red");
      if (birthDate) {
        if (birthDate.includes("_")) setBirthDataClass("border-red");
      }
      if (!address) setAddressClass("border-red");
      if (!phoneNumber) setPhoneNumberClass("border-red");
      if (phoneNumber) {
        if (phoneNumber.includes("_")) {
          setPhoneNumberClass("border-red");
        }
      }
      if (secondPhoneNumber) {
        if (secondPhoneNumber.includes("_")) {
          setPhoneSecondNumberClass("border-red");
        }
      }
      if (thirdPhoneNumber) {
        if (thirdPhoneNumber.includes("_")) {
          setPhoneThirdNumberClass("border-red");
        }
      }
      if (!occupation) setOccupationClass("border-red");
    } else {
      axios
        .post(
          URLS.start + URLS.client_create,
          {
            fullName: String(name),
            pinfl: String(pnfl),
            dateOfBirth: birthDate,
            address: String(address),
            phoneNumber: String(phoneNumber),
            secondPhoneNumber: String(secondPhoneNumber),
            thirdPhoneNumber: String(thirdPhoneNumber),
            workplace: String(occupation),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        )
        .then((result) => {
          Toast.success("Mijoz qo'shildi");
          dispatch(
            addClient({
              fullName: String(name),
              dateOfBirth: birthDate,
              phoneNumber: String(phoneNumber),
              pinfl: String(pnfl),
              workplace: String(occupation),
            })
          );
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Mijoz qo'shilmadi");
        });
    }
  }

  useEffect(() => {
    dispatch(setPage("/clients"));

    axios
      .get(URLS.start + URLS.clients, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setClientsData(result.data));
      })
      .catch((error) => {
        console.error(error);
        Toast.error("Serverda xatolik yuz berdi");
      });
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!clientsData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Mijozlar</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Mijozlar ro'yhati</h3>
              <button
                className="btn btn-primary"
                onClick={() => setCreateModal(true)}
              >
                Mijoz qo'shish
              </button>
            </div>

            <div className="mahsulotlar_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Ismi</th>
                    <th scope="col">Tug'ilgan sanasi</th>
                    <th scope="col">Telefon raqami</th>
                    <th scope="col">PNFL</th>
                    <th scope="col">Ish joyi</th>
                    <th scope="col">O'zgartirish</th>
                  </tr>
                </thead>
                <tbody>
                  {!clientsData.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    clientsData.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.fullName}</td>
                          <td>{item.dateOfBirth}</td>
                          <td>{item.phoneNumber}</td>
                          <td>{item.pinfl}</td>
                          <td>{item.workplace}</td>
                          <td>
                            <button
                              onClick={() => saveClientData(item.id)}
                              style={{
                                background: "#FB923C",
                                borderColor: "#FB923C",
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />{" "}
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

      {/* Mijoz yaratish modal */}
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
              <span>Mijoz qo'shish</span>
            </div>

            <label htmlFor="nomi" className="product_change_input_name">
              <span className="red">*</span> Ism Sharif
            </label>
            <input
              className={nameClass}
              onChange={(e) => {
                setName(e.target.value);
                setNameClass();
              }}
              id="nomi"
              type="text"
              required
            />

            <label htmlFor="pnfl" className="product_change_input_name">
              <span className="red">*</span> PNFL
            </label>
            <PatternFormat
              className={pnflClass}
              onChange={(e) => {
                setPnfl(e.target.value);
                setPnflClass();
              }}
              id="pnfl"
              format="##############"
              mask="_"
            />

            <label htmlFor="birthDate" className="product_change_input_name">
              <span className="red">*</span> Tug'ilgan sanasi
            </label>
            <PatternFormat
              className={birthDateClass}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setBirthDataClass();
              }}
              id="birthDate"
              format="####-##-##"
              mask="_"
            />

            <label htmlFor="address" className="product_change_input_name">
              <span className="red">*</span> Manzil
            </label>
            <input
              className={addressClass}
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressClass();
              }}
              id="address"
              type="text"
              required
            />

            <label htmlFor="phone1" className="product_change_input_name">
              <span className="red">*</span> Telefon raqam
            </label>
            <PatternFormat
              className={phoneNumberClass}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/-/g, ""));
                setPhoneNumberClass();
              }}
              id="phone1"
              format="##-###-##-##"
              mask="_"
            />

            <label htmlFor="phone2" className="product_change_input_name">
              Qo'shimcha telefon raqam
            </label>
            <PatternFormat
              className={phoneSecondNumberClass}
              onChange={(e) => {
                setSecondPhoneNumber(e.target.value.replace(/-/g, ""));
                setPhoneSecondNumberClass();
              }}
              id="phone2"
              format="##-###-##-##"
              mask="_"
            />

            <label htmlFor="phone3" className="product_change_input_name">
              Qo'shimcha telefon raqam
            </label>
            <PatternFormat
              className={phoneThirdNumberClass}
              onChange={(e) => {
                setThirdPhoneNumber(e.target.value.replace(/-/g, ""));
                setPhoneThirdNumberClass();
              }}
              id="phone3"
              format="##-###-##-##"
              mask="_"
            />

            <label htmlFor="occupation" className="product_change_input_name">
              <span className="red">*</span> Kasbi
            </label>
            <input
              className={occupationClass}
              onChange={(e) => {
                setOccupation(e.target.value);
                setOccupationClass();
              }}
              id="occupation"
              type="text"
              required
            />

            <button onClick={create} className="btn btn-success btn-sm mt-3">
              Yaratish
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {/* Mijoz ma'lumotini o'zgartirish modali */}
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
              <span>Mijoz ma'lumotini o'zgartirish</span>
            </div>
            {!clientData ? (
              <Loading2 />
            ) : (
              <>
                <label htmlFor="nomic" className="product_change_input_name">
                  <span className="red">*</span> Ism Sharif
                </label>
                <input
                  className={changeNameClass}
                  defaultValue={changeName}
                  onChange={(e) => {
                    setChangeName(e.target.value);
                    setChangeNameClass();
                  }}
                  id="nomic"
                  type="text"
                  required
                />

                <label htmlFor="pnflc" className="product_change_input_name">
                  <span className="red">*</span> PNFL
                </label>
                <PatternFormat
                  defaultValue={changePnfl}
                  className={changePnflClass}
                  onChange={(e) => {
                    setChangePnfl(e.target.value);
                    setChangePnflClass();
                  }}
                  id="pnflc"
                  format="##############"
                  mask="_"
                />

                <label
                  htmlFor="birthDatec"
                  className="product_change_input_name"
                >
                  <span className="red">*</span> Tug'ilgan sanasi
                </label>
                <PatternFormat
                  defaultValue={changeBirthDate}
                  className={changeBirthDateClass}
                  onChange={(e) => {
                    setChangeBirthDate(e.target.value);
                    setChangeBirthDataClass();
                  }}
                  id="birthDatec"
                  format="####-##-##"
                  mask="_"
                />

                <label htmlFor="addressc" className="product_change_input_name">
                  <span className="red">*</span> Manzil
                </label>
                <input
                  className={changeAddressClass}
                  defaultValue={changeAddress}
                  onChange={(e) => {
                    setChangeAddress(e.target.value);
                    setChangeAddressClass();
                  }}
                  id="addressc"
                  type="text"
                  required
                />

                <label htmlFor="phone1" className="product_change_input_name">
                  <span className="red">*</span> Telefon raqam
                </label>
                <PatternFormat
                  defaultValue={changePhoneNumber}
                  className={changePhoneNumberClass}
                  onChange={(e) => {
                    setChangePhoneNumber(e.target.value.replace(/-/g, ""));
                    setChangePhoneNumberClass();
                  }}
                  id="phone1"
                  format="##-###-##-##"
                  mask="_"
                />
                <label htmlFor="phone2c" className="product_change_input_name">
                  <span className="red">*</span> Qo'shimcha telefon raqam
                </label>
                <PatternFormat
                  defaultValue={
                    changeSecondPhoneNumber ? changeSecondPhoneNumber : ""
                  }
                  className={changePhoneSecondNumberClass}
                  onChange={(e) => {
                    setChangeSecondPhoneNumber(
                      e.target.value.replace(/-/g, "")
                    );
                    setChangePhoneSecondNumberClass();
                  }}
                  id="phone2c"
                  format="##-###-##-##"
                  mask="_"
                />
                <label htmlFor="phone3c" className="product_change_input_name">
                  <span className="red">*</span> Qo'shimcha telefon raqam
                </label>
                <PatternFormat
                  defaultValue={
                    changeThirdPhoneNumber ? changeThirdPhoneNumber : ""
                  }
                  className={changePhoneThirdNumberClass}
                  onChange={(e) => {
                    setChangeThirdPhoneNumber(e.target.value.replace(/-/g, ""));
                    setChangePhoneThirdNumberClass();
                  }}
                  id="phone3c"
                  format="##-###-##-##"
                  mask="_"
                />
                <label
                  htmlFor="occupationc"
                  className="product_change_input_name"
                >
                  <span className="red">*</span> Kasbi
                </label>
                <input
                  defaultValue={changeOccupation}
                  className={changeOccupationClass}
                  onChange={(e) => {
                    setChangeOccupation(e.target.value);
                    setChangeOccupationClass();
                  }}
                  id="occupationc"
                  type="text"
                  required
                />

                <button
                  onClick={changeClientData}
                  className="btn btn-success btn-sm mt-3"
                >
                  O'zgartirish
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

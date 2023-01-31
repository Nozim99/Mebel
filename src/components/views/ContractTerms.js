import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import {
  setContractTermsData,
  addContractTermsData,
  changeContractTermsData,
} from "../../redux/slices/pagesData";
import { URLS } from "../../url";
import axios from "axios";
import { faFilePen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./extra/Loading";
import { Toast } from "../extraFunctions";

export default function ContractTerms() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { contractTermsData } = useSelector((state) => state.data);

  // Change term
  const [changeTermModal, setChangeTermModal] = useState(false);

  const [changeTermId, setChangeTermId] = useState();

  const [changeTermItems, setChangeTermItems] = useState();

  const changeMonthRef = useRef();
  const changeRateRef = useRef();

  const [changeTermNameClass, setChangeTermNameClass] = useState();
  const [changeNumberOfMonthClass, setChangeNumberOfMonthClass] = useState();
  const [changeTermRateClass, setChangeTermRateClass] = useState();

  const [changeTermName, setChangeTermName] = useState();
  const [changeNumberOfMonth, setChangeNumberOfMonth] = useState();
  const [changeTermRate, setChangeTermRate] = useState();

  const openModal = (id) => {
    setChangeTermId(id);
    setChangeTermModal(true);
    const changeItems = contractTermsData.find((obj) => obj.id === id);

    setChangeTermName(changeItems.name);
    setChangeNumberOfMonth(changeItems.numberOfMonth);
    setChangeTermRate(changeItems.rate);
  };
  const change = () => {
    if (
      changeTermName &&
      (changeNumberOfMonth || changeNumberOfMonth === 0) &&
      (changeTermRate || changeTermRate === 0)
    ) {
      axios
        .put(
          URLS.start + URLS.term_update + changeTermId,
          {
            name: String(changeTermName),
            numberOfMonth: changeNumberOfMonth,
            rate: changeTermRate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          console.log(result.data);
          Toast.success("Shart o'zgartirildi");
          dispatch(
            changeContractTermsData([
              changeTermId,
              String(changeTermName),
              changeTermRate,
              changeNumberOfMonth,
            ])
          );
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Shart o'zgartirilmadi");
        });
    } else {
      if (!changeTermName) setChangeTermNameClass("border-red");
      if (!changeNumberOfMonth) setChangeNumberOfMonthClass("border-red");
      if (!changeTermRate) setChangeTermRateClass("border-red");
    }
  };

  // Change term /

  // Create term
  const [createTermModal, setCreateTermModal] = useState(false);

  const monthRef = useRef();
  const termRateRef = useRef();

  const [termNameClass, setTermNameClass] = useState();
  const [numberOfMonthClass, setNumberOfMonthClass] = useState();
  const [termRateClass, setTermRateClass] = useState();

  const [termName, setTermName] = useState();
  const [numberOfMonth, setNumberOfMonth] = useState();
  const [termRate, setTermRate] = useState();

  const create = () => {
    if (
      termName &&
      (numberOfMonth || numberOfMonth === 0) &&
      (termRate || termRate === 0)
    ) {
      axios
        .post(
          URLS.start + URLS.term_create,
          {
            name: String(termName),
            numberOfMonth,
            rate: termRate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("Shart yaratildi");
          dispatch(
            addContractTermsData({
              termName,
              numberOfMonth,
              termRate,
            })
          );
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Shart yaratilmadi");
        });
    } else {
      if (!termName) setTermNameClass("border-red");
      if (!numberOfMonth) setNumberOfMonthClass("border-red");
      if (!termRate) setTermRateClass("border-red");
    }
  };
  // Create term /

  useEffect(() => {
    dispatch(setPage("/contract-terms"));

    if (!contractTermsData) {
      axios
        .get(URLS.start + URLS.terms, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setContractTermsData(result.data));
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
        {!contractTermsData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Shartlar ro'yxati</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Shartlar ro'yhati</h3>
              <button
                onClick={() => setCreateTermModal(true)}
                type="button"
                className="btn btn-primary"
              >
                Shart yaratish
              </button>
            </div>

            <div className="mahsulotlar_items contracts_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">Nomi</th>
                    <th scope="col">Foizi</th>
                    <th scope="col">Oylar soni</th>
                    <th scope="col">Yaratilgan sanasi</th>
                    <th scope="col">O'zgartirish</th>
                  </tr>
                </thead>
                <tbody>
                  {!contractTermsData.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    contractTermsData.map((item) => {
                      return (
                        <tr key={item.id}>
                          <th scope="row">{item.id}</th>
                          <td>{item.name} </td>
                          <td>{item.rate} </td>
                          <td>{item.numberOfMonth} oy</td>
                          <td>{item.createdAt}</td>
                          <td>
                            <button
                              onClick={() => openModal(item.id)}
                              type="button"
                              className="btn btn-primary btn-sm"
                            >
                              <FontAwesomeIcon icon={faFilePen} /> O'zgartirish
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

      {/* Shart yaratish modal */}
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
              <span>Shart yaratish</span>
            </div>

            <label htmlFor="termName" className="product_change_input_name">
              <span className={termName ? "opacity-none" : "red"}>*</span> Shart
              nomi
            </label>
            <input
              className={termNameClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") monthRef.current.focus();
              }}
              onChange={(e) => {
                setTermName(e.target.value);
                setTermNameClass();
              }}
              id="termName"
              type="text"
              required
            />

            <label
              htmlFor="numberOfMonth"
              className="product_change_input_name"
            >
              <span
                className={
                  numberOfMonth === 0
                    ? "opacity-none"
                    : numberOfMonth
                    ? "opacity-none"
                    : "red"
                }
              >
                *
              </span>{" "}
              Oylar soni
            </label>
            <input
              ref={monthRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") termRateRef.current.focus();
              }}
              className={numberOfMonthClass}
              onChange={(e) => {
                setNumberOfMonth(e.target.value);
                setNumberOfMonthClass();
              }}
              id="numberOfMonth"
              type="number"
              required
            />

            <label htmlFor="termRate" className="product_change_input_name">
              <span
                className={
                  termRate === 0
                    ? "opacity-none"
                    : termRate
                    ? "opacity-none"
                    : "red"
                }
              >
                *
              </span>{" "}
              Foiz
            </label>
            <input
              ref={termRateRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") create();
              }}
              className={termRateClass}
              onChange={(e) => {
                setTermRate(e.target.value);
                setTermRateClass();
              }}
              id="termRate"
              type="number"
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

      {/* Shartni o'zgartirish */}
      {changeTermModal ? (
        <>
          <div
            onClick={() => setChangeTermModal(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setChangeTermModal(false)}
                icon={faXmark}
              />{" "}
              <span>Shartni o'zgartirish</span>
            </div>

            <label htmlFor="termName" className="product_change_input_name">
              <span className={changeTermName ? "opacity-none" : "red"}>*</span>{" "}
              Shart nomi
            </label>
            <input
              defaultValue={changeTermName}
              className={changeTermNameClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") changeMonthRef.current.focus();
              }}
              onChange={(e) => {
                setChangeTermName(e.target.value);
                setChangeTermNameClass();
              }}
              id="termName"
              type="text"
              required
            />

            <label
              htmlFor="numberOfMonth"
              className="product_change_input_name"
            >
              <span
                className={
                  changeNumberOfMonth === 0
                    ? "opacity-none"
                    : changeNumberOfMonth
                    ? "opacity-none"
                    : "red"
                }
              >
                *
              </span>{" "}
              Oylar soni
            </label>
            <input
              defaultValue={changeNumberOfMonth}
              ref={changeMonthRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") changeRateRef.current.focus();
              }}
              className={changeNumberOfMonthClass}
              onChange={(e) => {
                setChangeNumberOfMonth(e.target.value);
                setChangeNumberOfMonthClass();
              }}
              id="numberOfMonth"
              type="number"
              required
            />

            <label htmlFor="termRate" className="product_change_input_name">
              <span
                className={
                  changeTermRate === 0
                    ? "opacity-none"
                    : changeTermRate
                    ? "opacity-none"
                    : "red"
                }
              >
                *
              </span>{" "}
              Foiz
            </label>
            <input
              defaultValue={changeTermRate}
              ref={changeRateRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") change();
              }}
              className={changeTermRateClass}
              onChange={(e) => {
                setChangeTermRate(e.target.value);
                setChangeTermRateClass();
              }}
              id="termRate"
              type="number"
              required
            />

            <button onClick={change} className="btn btn-success btn-sm mt-3">
              O'zgartirish
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

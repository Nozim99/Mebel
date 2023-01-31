import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import axios from "axios";
import { URLS } from "../../url";
import {
  setCheckoutData,
  resetCheckoutData,
  payCheckoutData,
} from "../../redux/slices/pagesData";
import Loading from "./extra/Loading";
import Loading2 from "./extra/Loading2";
import { Toast } from "../extraFunctions";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input-field";

export default function Checkout() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { checkoutData } = useSelector((state) => state.data);

  const [payModal, setPayModal] = useState(false);

  const [summa, setSumma] = useState();
  const [summaClass, setSummaClass] = useState();

  const reset = () => {
    axios
      .post(URLS.start + URLS.cashier_clear, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        Toast.success("Tozalandi");
        dispatch(resetCheckoutData());
      })
      .catch((error) => {
        if (
          error.response.data.message &&
          error.response.data.message === "Kassa is empty!"
        ) {
          Toast.error("Kassa bo'sh");
        } else {
          Toast.error("Xatolik sodir bo'ldi");
          console.error(error);
        }
      });
  };

  const send = () => {
    if (summa) {
      axios
        .post(
          URLS.start + URLS.cashier_replenish,
          {
            summa: Number(summa),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setPayModal(false);
          Toast.success("Kassaga pul kiritildi");
          dispatch(payCheckoutData(Number(summa)));
        })
        .catch((error) => {
          Toast.error("Kassaga pul kiritilmadi");
          console.error(error);
        });
    } else {
      setSummaClass("border-red");
    }
  };

  useEffect(() => {
    dispatch(setPage("/checkout"));

    if (!checkoutData) {
      axios
        .get(URLS.start + URLS.cashier_list, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setCheckoutData(result.data));
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
        {!checkoutData ? (
          <Loading2 />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> / <Link className="active">Kassa</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Kassa</h3>
              <div>
                <button
                  onClick={reset}
                  type="button"
                  className="btn btn-primary me-3"
                >
                  Kassani tozalash
                </button>
                <button
                  onClick={() => setPayModal(true)}
                  type="button"
                  className="btn btn-success"
                >
                  Kassaga pul kiritish
                </button>
              </div>
            </div>

            <div className="mahsulotlar_items contracts_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Filial nomi</th>
                    <th scope="col">Filial manzili</th>
                    <th scope="col">Naqd</th>
                    <th scope="col">Terminal</th>
                    <th scope="col">Karta</th>
                    <th scope="col">Onlayn</th>
                    <th scope="col">Telefon raqam</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{checkoutData.branch.name}</th>
                    <td>{checkoutData.branch.location}</td>
                    <td>{checkoutData.cash.toLocaleString("uz-UZ")} so'm</td>
                    <td>
                      {checkoutData.terminal.toLocaleString("uz-UZ")} so'm{" "}
                    </td>
                    <td>{checkoutData.card.toLocaleString("uz-UZ")} so'm</td>
                    <td>{checkoutData.online.toLocaleString("uz-UZ")} so'm</td>
                    <td>{checkoutData.branch.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Kassaga pul kiritish */}
      {payModal ? (
        <>
          <div
            onClick={() => setPayModal(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setPayModal(false)}
                icon={faXmark}
              />{" "}
              <span>Kassaga pul kiritish</span>
            </div>

            <label htmlFor="summa" className="product_change_input_name">
              <span className="red">*</span> Summa
            </label>

            <div className="input-group mb-3 ">
              <CurrencyInput
                style={{ width: "15.9em" }}
                className={"form-control " + summaClass}
                onChange={(e) => {
                  setSumma(e.target.value.replace(/,/g, ""));
                  setSummaClass("");
                }}
                id="summa"
                decimalsLimit={2}
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>

            <button onClick={send} className="btn btn-primary mt-3">
              Kiritish
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

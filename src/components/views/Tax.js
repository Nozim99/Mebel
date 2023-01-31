import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Loading from "./extra/Loading";
import CurrencyInput from "react-currency-input-field";
import { PatternFormat } from "react-number-format";

export default function Tax() {
  const dispatch = useDispatch();

  const [createTermModal, setCreateTermModal] = useState(false);

  // Ref
  const taxInputRef = useRef();
  const taxNumberRef = useRef();
  const taxCostRef = useRef();

  // Shart yaratish. Serverga yuboriladigan ma'lumotlar
  const [name, setName] = useState();
  const [taxName, setTaxName] = useState();
  const [amount, setAmount] = useState();
  const [cost, setCost] = useState();

  useEffect(() => {
    dispatch(setPage("/tax"));
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        <div className="breadcrumb mahsulotlar_breadcrumb">
          <Link to="/">Asosiy</Link> /{" "}
          <Link className="active">Soliq ro'yxati</Link>
        </div>

        <div className="mahsulotlar_header">
          <h3>Soliq ro'yxati</h3>
          <button
            onClick={() => setCreateTermModal(true)}
            type="button"
            className="btn btn-primary"
          >
            Soliqqa jo'natish
          </button>
        </div>

        <div className="mahsulotlar_items contracts_items">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">Nomi</th>
                <th scope="col">Soliq raqami</th>
                <th scope="col">Summasi</th>
                <th scope="col">Filial</th>
              </tr>
            </thead>
            <tbody>
              <tr className="no_data_img_box"></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Soliqqa jo'natish modal */}
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
              <span>Soliqqa jo'natish</span>
            </div>

            <label
              htmlFor="tax-name-input"
              className="product_change_input_name"
            >
              <span className={name ? "opacity-none" : "red"}>*</span> Nomi
            </label>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  taxInputRef.current.focus();
                }
              }}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              id="tax-name-input"
              type="text"
              required
            />

            <label
              htmlFor="tax-number-input"
              className="product_change_input_name"
            >
              <span className={taxName ? "opacity-none" : "red"}>*</span> Soliq
              raqami
            </label>
            <PatternFormat
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  taxNumberRef.current.focus();
                }
              }}
              className="form-control"
              getInputRef={taxInputRef}
              onChange={(e) => setTaxName(e.target.value)}
              id="pnfl"
              format="##############"
              mask="_"
            />

            <label
              htmlFor="tax-amount-input"
              className="product_change_input_name"
            >
              <span className={amount ? "opacity-none" : "red"}>*</span> Miqdori
            </label>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  taxCostRef.current.focus();
                }
              }}
              className="form-control"
              ref={taxNumberRef}
              onChange={(e) => setAmount(e.target.value)}
              id="tax-amount-input"
              type="number"
              required
            />

            <label
              htmlFor="tax-cost-input"
              className="product_change_input_name"
            >
              <span className={cost ? "opacity-none" : "red"}>*</span> Narxi
            </label>
            <div className="input-group mb-3 ">
              <CurrencyInput
                ref={taxCostRef}
                onChange={(e) => setCost(e.target.value)}
                style={{ width: "15.9em" }}
                className={"form-control "}
                id="tax-cost-input"
                decimalsLimit={2}
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>

            <button className="btn btn-success btn-sm mt-3">Jo'natish</button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

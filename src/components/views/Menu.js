import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSwatchbook as mahsulotlar,
  faNetworkWired as kategoriya,
  faUsers as mijozlar,
  faFileSignature as shartnomalar,
  faFileCircleExclamation,
  faTruck,
  faWarehouse as omborxona,
  faCashRegister as checkout,
  faRightLeft as transaction,
  faFileInvoiceDollar as soliq,
  faUserTie as admin,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import Mahsulotlar from "./Mahsulotlar";
import { setPage, setShort } from "../../redux/slices/config";
import { useDispatch, useSelector } from "react-redux";

export default function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { page, short } = useSelector((state) => state.config);
  // const [short, setShort] = useState(true);

  return (
    <div className="menu">
      <div className={short ? "menu_box menu_box_short" : "menu_box"}>
        <div
          onClick={() => dispatch(setShort(!short))}
          className={short ? "menu_short menu_short_short" : "menu_short"}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </div>
        <div
          onClick={() => navigate("/")}
          className={page === "/" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={mahsulotlar} /> {short ? "" : "Mahsulotlar"}{" "}
          {page === "/" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/category")}
          className={page === "/category" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={kategoriya} /> {short ? "" : "Kategoriyalar"}
          {page === "/category" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/clients")}
          className={page === "/clients" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={mijozlar} /> {short ? "" : "Mijozlar"}
          {page === "/clients" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/contracts")}
          className={page === "/contracts" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={shartnomalar} /> {short ? "" : "Shartnomalar"}
          {page === "/contracts" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/contract-terms")}
          className={
            page === "/contract-terms" ? "menu_item active" : "menu_item"
          }
        >
          <FontAwesomeIcon icon={faFileCircleExclamation} />{" "}
          {short ? "" : "Shartnoma shartlari"}
          {page === "/contract-terms" ? (
            <div className="menu_item_right"></div>
          ) : (
            ""
          )}
        </div>
        <div
          onClick={() => navigate("/cargo")}
          className={page === "/cargo" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={faTruck} /> {short ? "" : "Yetkazib beruvchi"}
          {page === "/cargo" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/warehouse")}
          className={page === "/warehouse" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={omborxona} /> {short ? "" : "Omborxona"}
          {page === "/warehouse" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/checkout")}
          className={page === "/checkout" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={checkout} /> {short ? "" : "Kassa"}
          {page === "/checkout" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/transaktion")}
          className={page === "/transaktion" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={transaction} /> {short ? "" : "Tranzaksiyalar"}
          {page === "/transaktion" ? (
            <div className="menu_item_right"></div>
          ) : (
            ""
          )}
        </div>
        <div
          onClick={() => navigate("/tax")}
          className={page === "/tax" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={soliq} /> {short ? "" : "Soliq"}
          {page === "/tax" ? <div className="menu_item_right"></div> : ""}
        </div>
        <div
          onClick={() => navigate("/admin")}
          className={page === "/admin" ? "menu_item active" : "menu_item"}
        >
          <FontAwesomeIcon icon={admin} /> {short ? "" : "Admin"}
          {page === "/admin" ? <div className="menu_item_right"></div> : ""}
        </div>
      </div>
    </div>
  );
}

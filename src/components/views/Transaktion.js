import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import Loading2 from "./extra/Loading2";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import { URLS } from "../../url";
import { setTransaction } from "../../redux/slices/pagesData";
import LoaderTable from "./extra/LoaderTable";

export default function Transaktion() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { transaction } = useSelector((state) => state.data);

  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  useEffect(() => {
    dispatch(setPage("/transaktion"));

    if (from && to) {
      axios
        .get(
          URLS.start +
            URLS.transactions +
            `?from=${from.toLocaleDateString(
              "uz-UZ"
            )}&to=${to.toLocaleDateString("uz-UZ")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          if (result.data && result.data.transactions) {
            dispatch(setTransaction(result.data.transactions));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .get(URLS.start + URLS.transactions, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          if (result.data && result.data.transactions) {
            dispatch(setTransaction(result.data.transactions));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [from, to]);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        <>
          <div className="breadcrumb mahsulotlar_breadcrumb">
            <Link to="/">Asosiy</Link> /{" "}
            <Link className="active">Tranzaksiyalar ro'yxati</Link>
          </div>

          <div className="mahsulotlar_header">
            <h3>Tranzaksiyalar ro'yxati</h3>
          </div>

          <div className="date_picker_input_container">
            <div className="date_inputs_with_info">
              <span className="date_input_info">dan</span>
              <div className="date_picker_input_box">
                <DatePicker
                  className="date_picker_input"
                  selected={from}
                  onChange={(e) => {
                    setFrom(e);
                  }}
                  isClearable
                  placeholderText="Sana kiriting"
                  locale="uz"
                />
              </div>
            </div>

            <div className="date_inputs_with_info ms-4">
              <span className="date_input_info">gacha</span>
              <div className="date_picker_input_box">
                <DatePicker
                  className="date_picker_input"
                  selected={to}
                  onChange={(e) => setTo(e)}
                  isClearable
                  placeholderText="Sana kiriting"
                  locale="uz"
                />
              </div>
            </div>
          </div>

          <div className="mahsulotlar_items contracts_items">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">id</th>
                  <th scope="col">Komment</th>
                  <th scope="col">Summa</th>
                  <th scope="col">To'lov turi</th>
                  <th scope="col">Tranzaksiya turi</th>
                  <th scope="col">Tomonidan bajarildi</th>
                  <th scope="col">Bajarilgan vaqti</th>
                </tr>
              </thead>
              <tbody className="warehouse_tbody">
                {transaction ? (
                  !transaction.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    transaction.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.description ? item.description : "no comment"}</td>
                          <td>{item.summa.toLocaleString()} so'm</td>
                          <td>{item.paymentType}</td>
                          <td>{item.transactionType}</td>
                          <td>{item.createdBy}</td>
                          <td>{item.createdAt}</td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <LoaderTable />
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
    </div>
  );
}

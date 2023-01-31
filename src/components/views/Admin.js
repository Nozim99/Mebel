import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import { setAdminData } from "../../redux/slices/pagesData";
import axios from "axios";
import { URLS } from "../../url";
import Loading from "./extra/Loading";

export default function Admin() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { adminData } = useSelector((state) => state.data);

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
              <button type="button" className="btn btn-success">
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
                        <tr className="mahsulotlar_lists" key={item.id}>
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
    </div>
  );
}

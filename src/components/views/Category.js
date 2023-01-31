import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import "../styles/style.css";
import {
  setCategoryData,
  addCategoryToData,
  changeCategory,
} from "../../redux/slices/pagesData";
import { URLS } from "../../url";
import axios from "axios";
import Loading from "./extra/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Toast } from "../toast";

export default function Category() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { categoryData } = useSelector((state) => state.data);

  const [createModal, setCreateModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);

  const [nameClass, setNameClass] = useState("");
  const [changeNameClass, setChangeNameClass] = useState("");

  const [categoryName, setCategoryName] = useState();
  const [changeCategoryName, setChangeCategoryName] = useState();

  const [categoryId, setCategoryId] = useState();

  function create() {
    if (!categoryName) {
      setNameClass("border-red");
    } else {
      axios
        .post(
          URLS.start + URLS.category_create,
          {
            name: categoryName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          dispatch(addCategoryToData(categoryName));
          Toast.success("Kategoriya yaratildi");
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Kategoriya yaratilmadi");
        });
    }
  }

  function change() {
    if (!changeCategoryName) {
      setChangeNameClass("border-red");
    } else {
      axios
        .put(
          URLS.start + URLS.category_update + categoryId,
          {
            name: String(changeCategoryName),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        )
        .then((result) => {
          dispatch(changeCategory([categoryId, String(changeCategoryName)]));
          if (result.data.success) {
            Toast.success("Kategoriya o'zgartirildi");
          }
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Kategoriya o'zgartirilmadi");
        });
    }
  }

  useEffect(() => {
    dispatch(setPage("/category"));
    // categories
    if (!categoryData) {
      axios
        .get(URLS.start + URLS.categories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setCategoryData(result.data));
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
        {!categoryData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Kategoriyalar</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Kategoriyalar ro'yhati</h3>
              <button
                className="btn btn-primary"
                onClick={() => setCreateModal(true)}
              >
                Kategoriya yaratish
              </button>
            </div>

            <div className="mahsulotlar_items">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <span className="category_num">№</span> Nomi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData ? (
                    categoryData.length ? (
                      categoryData.length === 0 ? (
                        <tr className="no_data_img_box"></tr>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  {categoryData
                    ? categoryData.map((item, index) => {
                        return (
                          <tr
                            className="mahsulotlar_lists"
                            onClick={() => {
                              setChangeModal(true);
                              setCategoryId(item.id);
                              setChangeCategoryName(item.name);
                            }}
                            key={item.id}
                          >
                            <td>
                              <span className="category_num">{index + 1}</span>{" "}
                              {item.name}
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Kategoriya yaratish modali */}
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
              <span>Kategoriya yaratish</span>
            </div>

            <label htmlFor="nomi" className="product_change_input_name">
              <span className="red">*</span> Kategoriya nomi
            </label>
            <input
              className={nameClass}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setNameClass("");
              }}
              id="nomi"
              type="text"
            />

            <button onClick={create} className="btn btn-primary mt-3">
              Yaratish
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {/* Kategoriyani o'zgartirish modali */}
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
              <span>Kategoriyani o'zgartirish</span>
            </div>

            <label htmlFor="nomi" className="product_change_input_name">
              <span className="red">*</span> Kategoriya nomi
            </label>
            <input
              className={changeNameClass}
              onChange={(e) => {
                setChangeCategoryName(e.target.value);
                setChangeNameClass("");
              }}
              defaultValue={changeCategoryName}
              id="nomi"
              type="text"
            />

            <button onClick={change} className="btn btn-primary mt-3">
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

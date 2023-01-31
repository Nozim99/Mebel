import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faLink, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../styles/mahsulotlar.css";
import Menu from "./Menu";
import { URLS } from "../../url";
import Loading from "./extra/Loading";
import { setPage } from "../../redux/slices/config";
import { setProductsData } from "../../redux/slices/pagesData";
import { priceFormatter } from "../extraFunctions";

export default function Mahsulotlar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { url, token } = useSelector((state) => state.config);
  const { productsData } = useSelector((state) => state.data);

  const [createModal, setCreateModal] = useState(false);

  const [categories, setCategories] = useState([]);

  // serverga yuborilinadigan ma'lumotlar
  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productDec, setProductDec] = useState();
  const [category, setCategory] = useState();
  const [image, setImage] = useState([]);

  // xatolikni bildirish uchun, inputlar uchun
  const [nameClass, setNameClass] = useState("");
  const [priceClass, setPriceClass] = useState("");
  const [decClass, setDecClass] = useState("");

  useEffect(() => {
    // menyudagi stilini o'zgartiradi
    dispatch(setPage("/"));

    // mahsulotlarni data'ga saqlaydi
    if (!productsData) {
      axios
        .get(url + URLS.products, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          if (result.data) {
            dispatch(setProductsData(result.data));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // kategoriyalarni category'ga saqlaydi
    axios
      .get(url + URLS.categories, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function create() {
    // console.log("1", String(productName));
    // console.log("2", Number(productPrice.replace(/,/g, "")));
    // console.log("3", String(productDec));
    // console.log("4", +category);
    // console.log("5", image);

    const formData = new FormData();
    for (const item of image) {
      formData.append("images", item);
    }
    console.log(formData);

    axios
      .post(
        URLS.start + URLS.product_create,
        {
          categoryId: +category,
          name: String(productName),
          price: Number(productPrice.replace(/,/g, "")),
          description: String(productDec),
          files: formData,
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!productsData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Mahsulotlar</Link>
            </div>
            <div className="mahsulotlar_header">
              <h3>Mahsulotlar ro'yhati</h3>
              <button
                className="btn btn-primary"
                onClick={() => setCreateModal(true)}
              >
                Mahsulot yaratish
              </button>
            </div>
            <div className="mahsulotlar_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">id</th>
                    <th scope="col">Ma'lumot</th>
                    <th scope="col">Narxi</th>
                    <th scope="col">Kategoriya</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.length ? (
                    productsData.length === 0 ? (
                      <tr className="no_data_img_box"></tr>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  {productsData.map((item, index) => {
                    return (
                      <tr
                        className="mahsulotlar_lists"
                        onClick={() => navigate("/mahsulot/" + item.id)}
                        key={item.id}
                      >
                        <th scope="row">{index + 1}</th>
                        <td>{item.id}</td>
                        <td>
                          <div className="mahsulotlar_item_click">
                            <img
                              src={item.productDetails[0]}
                              alt="4090"
                              className="mahsulotlar_item_img"
                            />{" "}
                            {item.name}
                          </div>
                        </td>
                        <td>{item.price.toLocaleString("uz-UZ")} so'm</td>
                        <td>{item.category.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

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
              <span>Mahsulot yaratish</span>
            </div>

            <label htmlFor="category" className="product_change_input_name">
              <span className="red">*</span> Kategoriya nomi
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="mahsulotlar_category_section"
              name="category"
              id="category"
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.length
                ? categories.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })
                : ""}
            </select>

            <label htmlFor="nomi" className="product_change_input_name">
              <span className="red">*</span> Mahsulot nomi
            </label>
            <input
              className={nameClass}
              onChange={(e) => {
                setProductName(e.target.value);
                setNameClass("");
              }}
              id="nomi"
              defaultValue={productsData.name}
              type="text"
            />
            <label htmlFor="narx" className="product_change_input_name">
              <span className="red">*</span> Mahsulot narxi
            </label>
            <CurrencyInput
              className={priceClass}
              onChange={(e) => {
                setProductPrice(e.target.value);
                setPriceClass("");
              }}
              id="narx"
              defaultValue={productsData.price}
              decimalsLimit={2}
            />
            <label htmlFor="komment" className="product_change_input_name">
              <span className="red">*</span> Komment
            </label>
            <textarea
              className={decClass}
              onChange={(e) => {
                setProductDec(e.target.value);
                setDecClass("");
              }}
              defaultValue={productsData.description}
              name=""
              id="komment"
              rows="7"
            ></textarea>

            <label htmlFor="input_image" className="product_change_input_name">
              <span className="red">*</span> Mahsulot rasmi
            </label>
            <label
              htmlFor="input_image"
              className="product_change_input_name_box"
            >
              <FontAwesomeIcon icon={faDownload} /> Mahsulot rasmini joylash
            </label>
            <input
              onChange={(e) => setImage([...image, e.target.files[0]])}
              id="input_image"
              type="file"
              accept="image/*"
              multiple
            />
            {image.length
              ? image.map((item, index) => {
                  return (
                    <div
                      className="mahsulotlar_uploaded_img"
                      key={"uploaded key: " + index}
                    >
                      <FontAwesomeIcon icon={faLink} /> {item.name}
                    </div>
                  );
                })
              : ""}

            <button onClick={create} className="btn btn-primary mt-4">
              Yaratish
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

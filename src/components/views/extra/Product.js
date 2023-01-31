import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Menu from "../Menu";
import "../../styles/product.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input-field";
import Loading from "./Loading";
import { setData, changeData, setPage } from "../../../redux/slices/config";
import { URLS } from "../../../url";
import { Toast } from "../../toast";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useParams();
  const { url, token, data } = useSelector((state) => state.config);

  const [changeModule, setChangeModule] = useState(false);

  // serverga yuborilinadigan ma'lumotlar
  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productDec, setProductDec] = useState();

  // xatolikni bildirish uchun, inputlar uchun
  const [nameClass, setNameClass] = useState("");
  const [priceClass, setPriceClass] = useState("");
  const [decClass, setDecClass] = useState("");

  // mahsulot ma'lumotlarini o'zgartirish
  function edit() {
    if (productName && productPrice && productDec) {
      axios
        .put(
          URLS.start + URLS.product_update + product,
          {
            name: String(productName),
            price: parseInt(productPrice),
            description: String(productDec),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          if (result.data.success) {
            dispatch(changeData([productName, productPrice, productDec]));
          }
          Toast.success("Mahsulot ma'lumoti o'zgartirildi");
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Ma'lumot o'zgartirilmadi!");
        });
    } else {
      if (!productName) {
        setNameClass("border-red");
      }
      if (!productPrice) {
        setPriceClass("border-red");
      }
      if (!productDec) {
        setDecClass("border-red");
      }
    }
  }

  // mahsulot ma'lumotlarini yuklab oladi
  useEffect(() => {
    dispatch(setPage("/"));
    dispatch(setData(null));

    axios
      .get(`${url}/products/findBy/${product}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setData(result.data));
        setProductName(result.data.name);
        setProductPrice(result.data.price);
        setProductDec(result.data.description);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!data ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link to="/">Mahsulotlar ro'yhati</Link> /{" "}
              <Link className="active">
                {data.name.length > 25
                  ? data.name.slice(0, 25) + " ..."
                  : data.name}
              </Link>
            </div>
            <div className="product_header">
              <span>{data.name}</span>
              <button
                onClick={() => setChangeModule(true)}
                className="btn btn-primary"
              >
                Mahsulotni o'zgartirish
              </button>
            </div>
            <div
              style={{ backgroundImage: `url(${data.productDetails[0]})` }}
              className="product_img_box"
            ></div>
            <div className="product_info">
              <div className="product_price">
                Mahsulot narxi:{" "}
                <span className="product_price_num">
                  {data.price.toLocaleString("uz-UZ")}
                </span>
              </div>
              <div className="product_description_box">Mahsulot haqida</div>
              <div className="product_description">{data.description}</div>
            </div>
          </>
        )}
      </div>

      {changeModule ? (
        <>
          <div
            onClick={() => setChangeModule(false)}
            className="product_change_box"
          ></div>

          <div className="product_change">
            <div className="product_change_header">
              <FontAwesomeIcon
                onClick={() => setChangeModule(false)}
                icon={faXmark}
              />{" "}
              <span>Mahsulotni o'zgartirish</span>
            </div>
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
              defaultValue={data.name}
              type="text"
            />
            <label htmlFor="narx" className="product_change_input_name">
              <span className="red">*</span> Mahsulot narxi
            </label>
            <CurrencyInput
              className={priceClass}
              onChange={(e) => {
                setProductPrice(e.target.value.replace(/,/g, ""));
                setPriceClass("");
              }}
              id="narx"
              defaultValue={data.price}
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
              defaultValue={data.description}
              name=""
              id="komment"
              rows="7"
            ></textarea>
            <button onClick={edit} className="btn btn-primary btn-sm mt-3">
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

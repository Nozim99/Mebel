import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import {
  setWarehouseData,
  setWarehouseOtherProducts,
} from "../../redux/slices/pagesData";
import axios from "axios";
import { URLS } from "../../url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { priceFormatter, Toast } from "../extraFunctions";
import Loading2 from "./extra/Loading2";
import { useState } from "react";
import LoaderTable from "./extra/LoaderTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import uz from "date-fns/locale/uz";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input-field";
// console.log(new Date().toLocaleDateString("uz-UZ"));
registerLocale("uz", uz);

export default function Warehouse() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { warehouseData, warehouseOtherProducts } = useSelector(
    (state) => state.data
  );

  const [active, setActive] = useState(true);

  function remainingProducts() {
    setActive(false);

    if (!warehouseOtherProducts) {
      axios
        .get(URLS.start + URLS.warehouse_remain, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setWarehouseOtherProducts(result.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // Kiruvchi mahsulotlar
  const [inM, setInM] = useState();
  // Kiruvchi mahsulotlar /

  // KIRUVCHI MAHSULOTLAR
  const [incomeModal, setIncomeModal] = useState(false);

  const [axiosNum, setAxiosNum] = useState(0);
  const [productList, setProductList] = useState();
  const [merchantList, setMerchantlist] = useState();

  const [totalPrice, setTotalPrice] = useState(0);
  const [debt, setDebt] = useState(0);

  const [merchantId, setMerchantId] = useState();
  const [cash, setCash] = useState();
  const [card, setCard] = useState();
  const [comment, setComment] = useState();

  // class
  const [merchantIdClass, setMerchantIdClass] = useState();

  const [addItems, setAddItems] = useState([]);

  const changeMerchant = (value) => {
    setMerchantIdClass();

    const newMerchant = merchantList.find((e) => e.name === String(value));
    setMerchantId(newMerchant ? newMerchant.id : null);
  };

  const createItem = () => {
    setAddItems([
      ...addItems,
      {
        productId: null,
        productName: null,
        amount: null,
        price: null,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItem = [...addItems];
    newItem.splice(index, 1);
    setAddItems(newItem);
  };

  const updateProduct = (value, index) => {
    const newItemId = productList.find((e) => e.name === String(value));

    const newItem = [...addItems];
    newItem[index].productName = value;
    newItem[index].productId = newItemId ? newItemId.id : null;
    setAddItems(newItem);
  };

  const updateAmount = (value, index) => {
    const newItem = [...addItems];

    newItem[index].amount = value;
    setAddItems(newItem);
  };

  const updatePrice = (value, index) => {
    const newItem = [...addItems];

    newItem[index].price = value;
    setAddItems(newItem);
  };

  const sendIncome = () => {
    if (merchantId || merchantId === 0) {
      axios
        .post(
          URLS.start + URLS.warehouse_income,
          {
            merchantId: Number(merchantId),
            incomeDtoList: addItems,
            byCash: Number(cash),
            byCard: Number(card),
            description: String(comment),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("Mahsulot kiritildi");
          setIncomeModal(false);
        })
        .catch((err) => {
          Toast.error("Mahsulot kiritilmadi");
          console.error(err);
        });
    } else {
      setMerchantIdClass("border-red");
    }
  };

  const openModal = () => {
    setIncomeModal(true);
    setAxiosNum(0);

    axios
      .get(URLS.start + URLS.products, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setProductList(result.data);
        setAxiosNum((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(URLS.start + URLS.merchants, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setMerchantlist(result.data);
        setAxiosNum((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setTotalPrice(0);
    setDebt(0);

    addItems.forEach((e) => {
      const price = e.amount * e.price;
      setTotalPrice((prev) => prev + price);
      setDebt(price - (cash || 0) - (card || 0));
    });
  }, [addItems, cash, card]);

  // KIRUVCHI MAHSULOTLAR /

  // CHIQUVCHI MAHSULOTLAR
  const [outcomeModal, setOutcomeModal] = useState(false);

  const [axiosOut, setAxiosOut] = useState(0);

  const [clientClass, setClientClass] = useState();
  const [totalPriceOut, setTotalPriceOut] = useState(0);

  // Clients and products list
  const [clientList, setClientList] = useState();
  const [productListOut, setProductListOut] = useState();

  const [client, setClient] = useState();
  const [out, setOut] = useState([]);
  const [cashOut, setCashOut] = useState();
  const [plasticCard, setPlasticCard] = useState();
  const [terminal, setTerminal] = useState();
  const [desc, setDesc] = useState();

  const clientFindid = (value) => {
    setClientClass();
    const clientId = clientList.find((item) => item.fullName === String(value));
    setClient(clientId ? clientId.id : null);
  };

  const createProduct = () => {
    setOut([
      ...out,
      {
        productId: null,
        productName: null,
        productPrice: null,
        amount: null,
      },
    ]);
  };

  const remove = (index) => {
    const newItem = [...out];
    newItem.splice(index, 1);
    setOut(newItem);
  };

  const addProduct = (value, index) => {
    const itemId = productListOut.find((item) => item.name === value);
    const newItem = [...out];
    newItem[index].productName = value;
    newItem[index].productPrice = itemId ? itemId.price : null;
    newItem[index].productId = itemId ? itemId.id : null;
    setOut(newItem);
  };

  const amount = (value, index) => {
    const newItem = [...out];
    newItem[index].amount = value;
    setOut(newItem);
  };

  const openModalOut = () => {
    setOutcomeModal(true);
    setAxiosOut(0);

    axios
      .get(URLS.start + URLS.clients, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setClientList(result.data);
        setAxiosOut((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(URLS.start + URLS.products, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setProductListOut(result.data);
        setAxiosOut((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const sendOut = () => {
    if (client || client === 0) {
      axios
        .post(
          URLS.start + URLS.warehouse_outcome,
          {
            clientId: client,
            outcomeDtoList: out,
            byCash: Number(cashOut),
            byCard: Number(plasticCard),
            byTerminal: Number(terminal),
            description: String(desc),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("Muvaffaqiyatli bajarildi");
        })
        .catch((error) => {
          Toast.error("Xatolik sodir bo'ldi");
          console.error(error);
        });
    } else {
      setClientClass("border-red");
    }
  };

  useEffect(() => {
    setTotalPriceOut(0);

    out.forEach((e) => {
      setTotalPriceOut(
        (prev) => prev + (e.productPrice || 0) * (e.amount || 0)
      );
    });
  }, [out]);
  // CHIQUVCHI MAHSULOTLAR /

  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  useEffect(() => {
    if (from && to) {
      axios
        .get(
          URLS.start +
            URLS.warehouse_history +
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
          dispatch(setWarehouseData(result.data));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .get(URLS.start + URLS.warehouse_history, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(setWarehouseData(result.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [from, to]);

  useEffect(() => {
    dispatch(setPage("/warehouse"));
  });

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        <>
          <div className="breadcrumb mahsulotlar_breadcrumb">
            <Link to="/">Asosiy</Link> /{" "}
            <Link className="active">Omborxona</Link>
          </div>

          <div className="mahsulotlar_header">
            <h3>Omborxona</h3>
            <div>
              <button
                onClick={openModal}
                type="button"
                className="btn btn-success me-3"
              >
                Kiruvchi mahsulotlar
              </button>
              <button
                onClick={openModalOut}
                type="button"
                className="btn btn-primary"
              >
                Chiquvchi mahsulotlar
              </button>
            </div>
          </div>

          <div className="warehouse_two_btns">
            <button
              onClick={() => setActive(true)}
              className={
                active ? "warehouse_two_btn active" : "warehouse_two_btn"
              }
            >
              Kirim-chiqimlar
            </button>
            <button
              onClick={remainingProducts}
              className={
                active ? "warehouse_two_btn" : "warehouse_two_btn active"
              }
            >
              Qolgan mahsulotlar
            </button>
          </div>

          {active ? (
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
          ) : (
            ""
          )}

          <div className="mahsulotlar_items contracts_items">
            {active ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">id</th>
                    <th scope="col">Mahsulot nomi</th>
                    <th scope="col">Narxi</th>
                    <th scope="col">Miqdori</th>
                    <th scope="col">Operatsiya turi</th>
                    <th scope="col">Summa</th>
                    <th scope="col">Tomonidan bajarildi</th>
                    <th scope="col">Bajarilgan vaqti</th>
                  </tr>
                </thead>
                <tbody
                  style={{ position: "relative" }}
                  className="warehouse_tbody"
                >
                  {warehouseData ? (
                    <>
                      {warehouseData.lenght ? (
                        <tr className="no_data_img_box"></tr>
                      ) : (
                        warehouseData.map((item, index) => {
                          return (
                            <tr key={item.id}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.id}</td>
                              <td>{item.productName} </td>
                              <td>{item.price.toLocaleString("uz-UZ")} </td>
                              <td>{item.amount}</td>
                              <td>{item.operationType}</td>
                              <td>{item.summa.toLocaleString("uz-UZ")}</td>
                              <td>{item.createdBy}</td>
                              <td>
                                {new Date(item.createdAt).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </>
                  ) : (
                    <LoaderTable />
                  )}
                </tbody>
              </table>
            ) : !warehouseOtherProducts ? (
              <Loading2 />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">id</th>
                    <th scope="col">Mahsulot nomi</th>
                    <th scope="col">Narxi</th>
                    <th scope="col">Miqdori</th>
                    <th scope="col">Summa</th>
                  </tr>
                </thead>
                <tbody className="warehouse_tbody">
                  {!warehouseOtherProducts.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    warehouseOtherProducts.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.name} </td>
                          <td>{item.price.toLocaleString("uz-UZ")} so'm </td>
                          <td>{item.amount} ta</td>
                          <td>{item.summa.toLocaleString("uz-UZ")} so'm</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>

      {/* Kiruvchi mahsulotlar */}
      {incomeModal ? (
        <div className="cont_otq">
          <div
            onClick={() => setIncomeModal(false)}
            className="cont_otq_bg"
          ></div>

          {axiosNum === 2 ? (
            <div style={{ width: "70em" }} className="cont_otq_item">
              <div className="cont_ibh">
                <h5>Mahsulot kirim qilish</h5>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => setIncomeModal(false)}
                  icon={faXmark}
                />
              </div>

              {/* Yetkazib beruvchi */}
              <label
                className="cursor-pointer"
                htmlFor="yetkazib-beruvchi-income"
              >
                <span className={"red me-1"}>*</span> Yetkazib beruvchi
              </label>
              <div className="input-group mt-1 mb-5">
                <input
                  onChange={(e) => {
                    changeMerchant(e.target.value);
                  }}
                  list="yetkazib-beruvchi-income-list"
                  type="text"
                  id="yetkazib-beruvchi-income"
                  className={"form-control " + merchantIdClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <datalist id="yetkazib-beruvchi-income-list">
                  {merchantList.map((item) => {
                    return <option key={item.id} value={item.name}></option>;
                  })}
                </datalist>
              </div>

              {/* Qo'shilgan mahsulot */}
              {addItems.length
                ? addItems.map((item, index) => (
                    <div key={index} className="add_again_items mt-3">
                      <div style={{ width: "15em" }}>
                        <label
                          htmlFor={"product-income" + index}
                          className="mb-1"
                        >
                          <span className="red">*</span> Mahsulot
                        </label>
                        <input
                          id={"product-income" + index}
                          list="create_contract-product"
                          value={item.productName ? item.productName : ""}
                          onChange={(e) => {
                            updateProduct(e.target.value, index);
                          }}
                          type="text"
                          className="form-control"
                        />
                        <datalist id="create_contract-product">
                          {productList.map((n) => (
                            <option key={n.id} value={n.name}></option>
                          ))}
                        </datalist>
                      </div>

                      <div style={{ width: "15em" }}>
                        <label
                          htmlFor={"product-count-income" + index}
                          className="mb-1"
                        >
                          <span className="red">*</span> Miqdori
                        </label>
                        <div
                          style={{ width: "16em" }}
                          className="input-group mb-3 "
                        >
                          <input
                            onChange={(e) =>
                              updateAmount(e.target.value, index)
                            }
                            id={"product-count-income" + index}
                            value={item.amount ? item.amount : ""}
                            type="number"
                            className="form-control"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            min={0}
                          />
                          <span className="input-group-text" id="basic-addon1">
                            ta
                          </span>
                        </div>
                      </div>
                      <div style={{ width: "15em" }}>
                        <label
                          htmlFor={"olish-narxi-income" + index}
                          className="mb-1"
                        >
                          <span className="red">*</span> Olish narxi
                        </label>
                        <div
                          style={{ width: "16em" }}
                          className="input-group mb-3 "
                        >
                          <CurrencyInput
                            onChange={(e) =>
                              updatePrice(
                                e.target.value.replace(/,/g, ""),
                                index
                              )
                            }
                            value={item.price ? item.price : ""}
                            id="umumiy-summa"
                            className={"form-control "}
                            decimalsLimit={2}
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            min={0}
                          />
                          <span className="input-group-text" id="basic-addon1">
                            so'm
                          </span>
                        </div>
                      </div>
                      <FontAwesomeIcon
                        onClick={() => removeItem(index)}
                        className="add_again_items_x cursor-pointer"
                        icon={faXmark}
                      />
                    </div>
                  ))
                : ""}

              {addItems.length ? (
                <div className="my-3">
                  <button
                    onClick={() => setAddItems([])}
                    style={{ width: "100%" }}
                    className="btn btn-outline-secondary"
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: ".9em" }}
                      className="me-1"
                      icon={faTrash}
                    />{" "}
                    Tozalash
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="my-3">
                <button
                  onClick={createItem}
                  style={{ width: "100%" }}
                  className="btn btn-outline-success"
                >
                  <FontAwesomeIcon icon={faPlus} /> Mahsulot qo'shish
                </button>
              </div>

              {/* Naqd pul */}
              <label className="cursor-pointer mt-2" htmlFor="naqd-pul-income">
                <span className={"red me-1"}>*</span> Naqd pul
              </label>
              <div className="input-group mt-1 ">
                <div className="input-group mb-3 ">
                  <CurrencyInput
                    onChange={(e) => setCash(e.target.value.replace(/,/g, ""))}
                    min={0}
                    id="naqd-pul-income"
                    className="form-control"
                    decimalsLimit={2}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    so'm
                  </span>
                </div>
              </div>

              {/* Karta orqali */}
              <label
                className="cursor-pointer mt-3"
                htmlFor="karta-orqali-income"
              >
                <span className="red me-1">*</span> Karta orqali
              </label>
              <div className="input-group mt-1 ">
                <div className="input-group mb-3 ">
                  <CurrencyInput
                    onChange={(e) => setCard(e.target.value.replace(/,/g, ""))}
                    min={0}
                    id="karta-orqali-income"
                    className="form-control"
                    decimalsLimit={2}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    so'm
                  </span>
                </div>
              </div>

              {/* Karta orqali */}
              <label className="cursor-pointer mt-3" htmlFor="izoh-income">
                <span className="red me-1">*</span> Izoh
              </label>
              <div className="input-group mt-1 ">
                <textarea
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  rows={5}
                  list="create_contract-client_name"
                  type="text"
                  id="izoh-income"
                  className={"form-control "}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="mt-4">
                <span className="contract_create_contract_cost">
                  Umumiy summa:
                </span>{" "}
                {totalPrice.toLocaleString()} so'm
              </div>

              <div className="mt-1">
                <span className="contract_create_contract_cost">
                  Qarz miqdori:
                </span>{" "}
                {debt.toLocaleString()} so'm
              </div>

              <div>
                <button onClick={sendIncome} className="btn btn-success my-4">
                  Yaratish
                </button>
              </div>
            </div>
          ) : (
            <Loading2 />
          )}
        </div>
      ) : (
        ""
      )}

      {/* Chiquvchi mahsulotlar */}
      {outcomeModal ? (
        <div className="cont_otq">
          <div
            onClick={() => setOutcomeModal(false)}
            className="cont_otq_bg"
          ></div>

          {axiosOut === 2 ? (
            <div style={{ width: "70em" }} className="cont_otq_item">
              <div className="cont_ibh">
                <h5>Mahsulot chiqim qilish</h5>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => setOutcomeModal(false)}
                  icon={faXmark}
                />
              </div>

              {/* Client full name */}
              <label
                className="cursor-pointer"
                htmlFor="yetkazib-beruvchi-income"
              >
                <span className={"red me-1"}>*</span> Mijoz
              </label>
              <div className="input-group mt-1 mb-5">
                <input
                  onChange={(e) => {
                    clientFindid(e.target.value);
                  }}
                  list="chiquvchi-mahsulotlar-out-list"
                  type="text"
                  id="yetkazib-beruvchi-income"
                  className={"form-control " + clientClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <datalist id="chiquvchi-mahsulotlar-out-list">
                  {clientList.map((item) => {
                    return (
                      <option key={item.id} value={item.fullName}></option>
                    );
                  })}
                </datalist>
              </div>

              {/* Qo'shilgan mahsulot */}
              {out.length
                ? out.map((item, index) => (
                    <div key={index} className="add_again_items mt-3">
                      <div style={{ width: "15em" }}>
                        <label
                          htmlFor={"product-outcome" + index}
                          className="mb-1"
                        >
                          <span className="red">*</span> Mahsulot
                        </label>
                        <input
                          id={"product-outcome" + index}
                          list="create_contract-product-out"
                          value={item.productName ? item.productName : ""}
                          onChange={(e) => {
                            addProduct(e.target.value, index);
                          }}
                          type="text"
                          className="form-control"
                        />
                        <datalist id="create_contract-product-out">
                          {productListOut.map((n) => (
                            <option key={n.id} value={n.name}></option>
                          ))}
                        </datalist>
                      </div>

                      <div style={{ width: "15em" }}>
                        <label
                          htmlFor={"product-count-income" + index}
                          className="mb-1"
                        >
                          <span className="red">*</span> Miqdori
                        </label>
                        <div
                          style={{ width: "16em" }}
                          className="input-group mb-3 "
                        >
                          <input
                            onChange={(e) => amount(e.target.value, index)}
                            id={"product-count-income" + index}
                            value={item.amount ? item.amount : ""}
                            type="number"
                            className="form-control"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            min={0}
                          />
                          <span className="input-group-text" id="basic-addon1">
                            ta
                          </span>
                        </div>
                      </div>
                      <div style={{ width: "15em" }}>
                        {(
                          (item.productPrice || 0) * (item.amount || 0)
                        ).toLocaleString()}{" "}
                        so'm
                      </div>
                      <FontAwesomeIcon
                        onClick={() => remove(index)}
                        className="add_again_items_x cursor-pointer"
                        icon={faXmark}
                      />
                    </div>
                  ))
                : ""}

              {out.length ? (
                <div className="my-3">
                  <button
                    onClick={() => setOut([])}
                    style={{ width: "100%" }}
                    className="btn btn-outline-secondary"
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: ".9em" }}
                      className="me-1"
                      icon={faTrash}
                    />{" "}
                    Tozalash
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="my-3">
                <button
                  onClick={createProduct}
                  style={{ width: "100%" }}
                  className="btn btn-outline-success"
                >
                  <FontAwesomeIcon icon={faPlus} /> Mahsulot qo'shish
                </button>
              </div>

              {/* Naqd pul */}
              <label className="cursor-pointer mt-2" htmlFor="naqd-pul-outcome">
                <span className={"red me-1 opacity-none"}>*</span> Naqd pul
              </label>
              <div className="input-group mt-1 ">
                <div className="input-group mb-3 ">
                  <CurrencyInput
                    onChange={(e) =>
                      setCashOut(e.target.value.replace(/,/g, ""))
                    }
                    min={0}
                    id="naqd-pul-outcome"
                    className="form-control"
                    decimalsLimit={2}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    so'm
                  </span>
                </div>
              </div>

              {/* Karta orqali */}
              <label
                className="cursor-pointer mt-3"
                htmlFor="karta-orqali-outcome"
              >
                <span className="red me-1 opacity-none">*</span> Karta orqali
              </label>
              <div className="input-group mt-1 ">
                <div className="input-group mb-3 ">
                  <CurrencyInput
                    onChange={(e) =>
                      setPlasticCard(e.target.value.replace(/,/g, ""))
                    }
                    id="karta-orqali-outcome"
                    className="form-control"
                    decimalsLimit={2}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    so'm
                  </span>
                </div>
              </div>

              {/* Terminal orqali */}
              <label
                className="cursor-pointer mt-3"
                htmlFor="terminal-orqali-outcome"
              >
                <span className="red me-1 opacity-none">*</span> Terminal orqali
              </label>
              <div className="input-group mt-1 ">
                <div className="input-group mb-3 ">
                  <CurrencyInput
                    onChange={(e) =>
                      setTerminal(e.target.value.replace(/,/g, ""))
                    }
                    id="terminal-orqali-outcome"
                    className="form-control"
                    decimalsLimit={2}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text" id="basic-addon1">
                    so'm
                  </span>
                </div>
              </div>

              {/* Izoh */}
              <label className="cursor-pointer mt-3" htmlFor="izoh-outcome">
                <span className="red me-1 opacity-none">*</span> Izoh
              </label>
              <div className="input-group mt-1 ">
                <textarea
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  rows={5}
                  list="create_contract-client_name"
                  type="text"
                  id="izoh-outcome"
                  className={"form-control "}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="mt-4">
                <span className="contract_create_contract_cost">
                  Umumiy summa:
                </span>{" "}
                {totalPriceOut.toLocaleString()} so'm
              </div>

              <div>
                <button onClick={sendOut} className="btn btn-success my-4">
                  Mahsulot chiqarish
                </button>
              </div>
            </div>
          ) : (
            <Loading2 />
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

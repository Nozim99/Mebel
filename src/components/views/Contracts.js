import React, { useEffect, useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";
import { Link } from "react-router-dom";
import { URLS } from "../../url";
import axios from "axios";
import { setContractData, addContractData } from "../../redux/slices/pagesData";
import Loading from "./extra/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faFileArrowUp,
  faFileArrowDown,
  faXmark,
  faAngleRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input-field";
import Loading2 from "./extra/Loading2";
import LoaderTable from "./extra/LoaderTable";
import { Toast } from "../extraFunctions";

export default function Contracts() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.config);
  const { contractData } = useSelector((state) => state.data);

  // Shartnomalar ro'yhatini validatsiya bo'yicha ko'rsatish
  const [kechikkanKun, setKechikkanKun] = useState();
  const [kechikkanSum, setKechikkanSum] = useState();

  // item ma'lumotini ko'rsatadigan modal
  const [itemInfoM, setItemInfoM] = useState(false);
  const [itemICStatus, setItemICStatus] = useState(1);
  const [itemICStatus2, setItemICStatus2] = useState(1);
  const [itemInfo, setItemInfo] = useState();

  // Onlayn to'lov qilish modali
  const [otqM, setOtqM] = useState(false);

  // To'lov qilish naqd pulda modal
  const [tqnpM, setTqnpM] = useState(false);

  const showInfo = (id) => {
    setItemInfo();
    setItemICStatus(1);
    setItemICStatus2(1);
    setItemInfoM(true);

    axios
      .get(URLS.start + URLS.contract_detail + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setItemInfo(result.data);
      });
  };

  // Ma'lumotni yuklab olish
  const download = (id) => {
    try {
      axios
        .get(URLS.start + URLS.contract_download + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => new Blob([result.data]))
        .then((blob) => {
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = `${id}.zip`;
          link.click();
        });
    } catch (error) {
      console.error(error);
    }
  };

  // file'ni serverga yuklash
  const [docFile, setDocFile] = useState([]);
  const [uploadId, setUploadId] = useState();
  const [uploadM, setUploadM] = useState(false);

  const handleFileChange = (e) => {
    setDocFile([...docFile, e.target.files[0]]);
  };

  // Ma'lumotni serverga yuklash
  const uploadFile = () => {
    if (docFile && docFile.length) {
      const formData = new FormData();
      for (let i = 0; i < docFile.length; i++) {
        formData.append("files", docFile[i]);
      }

      axios
        .post(
          URLS.start + URLS.contract_upload + uploadId,
          {
            file: formData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          Toast.success("File yuklandi");
          setUploadM(false);
        })
        .catch((error) => {
          console.error(error);
          Toast.error("File yuklanmadi");
        });
    } else {
      Toast.error("Hujjatni yuklang");
    }
  };

  const [client, setClient] = useState();

  // CREATE EXTRA CONTRACT
  const [addContract, setAddContract] = useState(false);

  const [clientNameExtra, setClientNameExtra] = useState();
  const [clientId, setClientId] = useState();
  const [contractNumber, setContractNumber] = useState();
  const [mothNum, setMonthNum] = useState();
  const [paymentDate, setPaymentDate] = useState();
  const [totalSum, setTotalSum] = useState();
  const [autoPayment, setAutoPayment] = useState(false);

  const [clientNameExtraC, setClientNameExtraC] = useState();
  const [contractNumberC, setContractNumberC] = useState();
  const [mothNumC, setMonthNumC] = useState();
  const [paymentDateC, setPaymentDateC] = useState();
  const [totalSumC, setTotalSumC] = useState();

  const changeNameE = (value) => {
    setClientNameExtra(value);
    setClientNameExtraC();
    const userId = client.find((e) => e.fullName === value);
    setClientId(userId ? userId.id : null);
  };

  const openModalE = () => {
    setAddContract(true);

    axios
      .get(URLS.start + URLS.clients, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setClient(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createE = () => {
    if (
      (clientId || clientId === 0,
      contractNumber,
      mothNum || mothNum === 0,
      paymentDate,
      totalSum)
    ) {
      axios
        .post(
          URLS.start + URLS.create_existing_contract,
          {
            contractNumber: String(contractNumber),
            clientId,
            numberOfMonth: mothNum,
            paymentDate: paymentDate,
            summa: totalSum,
            autoPayment: autoPayment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          dispatch(
            addContractData({
              clientName: String(clientNameExtra),
              monthlySum: Math.ceil(totalSum / mothNum),
              debt: Math.ceil(totalSum / mothNum),
              totalSum: Number(totalSum),
              numberOfMonth: mothNum,
            })
          );
          Toast.success("Shartnoma qo'shildi");
        })
        .catch((error) => {
          Toast.error("Sharnoma yaratilmadi");
          console.error(error);
        });
    } else {
      if (!clientId) setClientNameExtraC("border-red");
      if (!contractNumber) setContractNumberC("border-red");
      if (!mothNum) setMonthNumC("border-red");
      if (!paymentDate) setPaymentDateC("border-red");
      if (!totalSum) setTotalSumC("border-red");
    }
  };
  // CREATE EXTRA CONTRACT /

  // CREATE CONTRACT
  const [createContM, setCreateContM] = useState(false);

  const [sendClient, setSendClient] = useState();
  const [clientName, setClientName] = useState();
  const [contractNum, setContractNum] = useState();
  const [contractType, setContractType] = useState();
  const [sendTerm, setSendTerm] = useState();
  const [payDate, setPayDate] = useState();
  const [autoPay, setAutoPay] = useState(false);
  const [monthlySum, setMonthlySum] = useState();
  const [numberOfMonth, setNumberOfMonth] = useState();

  const [clientNameClass, setClientNameClass] = useState();
  const [contractNumClass, setContractNumClass] = useState();
  const [contractTypeClass, setContractTypeClass] = useState();
  const [payDateClass, setPayDateClass] = useState();

  const [allAxios, setAllAxios] = useState(0);
  const [contract, setContract] = useState();
  const [product, setProduct] = useState();

  const openModal = () => {
    setCreateContM(true);
    if (allAxios < 3) {
      setAllAxios(0);
      axios
        .get(URLS.start + URLS.clients, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setClient(result.data);
          setAllAxios((prev) => prev + 1);
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(URLS.start + URLS.terms, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setContract(result.data);
          setAllAxios((prev) => prev + 1);
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(URLS.start + URLS.products, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setProduct(result.data);
          setAllAxios((prev) => prev + 1);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const [otherItems, setOtherItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [monthly, setMonthly] = useState(0);

  const clientNameChange = (value) => {
    setClientNameClass();
    setClientName(value);

    const sendClientId = client.find((e) => e.fullName === String(value));

    setSendClient(sendClientId ? sendClientId.id : null);
  };

  const create = () => {
    if (
      (sendClient || sendClient === 0) &&
      (sendTerm || sendTerm === 0) &&
      contractNum &&
      payDate &&
      (otherItems || otherItems.length)
    ) {
      axios
        .post(
          URLS.start + URLS.create_contract,
          {
            contractNumber: String(contractNum),
            clientId: sendClient,
            termId: sendTerm,
            paymentDate: Number(payDate),
            autoPayment: autoPay,
            products: otherItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          dispatch(
            addContractData({
              clientName: String(clientName),
              monthlySum: monthly,
              debt: monthly,
              totalSum: totalPrice,
              numberOfMonth,
            })
          );
          Toast.success("Shartnoma yaratildi");
          setCreateContM(false);
        })
        .catch((error) => {
          console.error(error);
          Toast.error("Shartnoma yaratilmadi");
        });
    } else {
      if (!sendClient) setClientNameClass("border-red");
      if (!contractNum) setContractNumClass("border-red");
      if (!sendTerm) setContractTypeClass("border-red");
      if (!payDate) setPayDateClass("border-red");
      if (!otherItems || !otherItems.length)
        Toast.error("Shartnoma yaratilmadi");
    }
  };

  const createItem = () => {
    setOtherItems([
      ...otherItems,
      { productName: null, productId: null, amount: 0, cost: 0 },
    ]);
  };

  const removeItem = (id) => {
    const newItems = [...otherItems];
    newItems.splice(id, 1);
    setOtherItems(newItems);
  };

  const changeRate = (value) => {
    setContractType(value);
    setContractTypeClass();

    const newItem = [...otherItems];

    const rate = contract.find((item) => item.name === value)
      ? contract.find((item) => item.name === value).rate
      : null;

    newItem.map((item) => {
      const cost = product.find((n) => n.id === item.productId)
        ? rate
          ? product.find((n) => n.id === item.productId).price * item.amount +
            (product.find((n) => n.id === item.productId).price *
              item.amount *
              rate) /
              100
          : 0
        : 0;

      item.cost = cost;
    });

    setOtherItems(newItem);
  };

  const clientTermIdChange = (value) => {
    changeRate(value);
    setContractTypeClass();

    const sendTermId = contract.find((e) => e.name === String(value));

    setNumberOfMonth(sendTermId ? sendTermId.numberOfMonth : null);
    setSendTerm(sendTermId ? sendTermId.id : null);
  };

  const updateItem = (value, idx) => {
    const newItem = [...otherItems];

    const rate = contract.find((item) => item.name === contractType)
      ? contract.find((item) => item.name === contractType).rate
      : null;

    const e = product.find((item) => item.name === value);

    const cost = Math.ceil(
      newItem[idx].amount
        ? rate
          ? (e ? e.price : 0) * newItem[idx].amount +
            ((e ? e.price : 0) * newItem[idx].amount * rate) / 100
          : 0
        : 0
    );

    newItem[idx] = {
      ...newItem[idx],
      productName: value,
      productId: e ? e.id : null,
      cost: cost || 0,
    };
    setOtherItems(newItem);
  };

  const updateCount = (value, idx) => {
    const newItem = [...otherItems];

    const rate = contract.find((item) => item.name === contractType)
      ? contract.find((item) => item.name === contractType).rate
      : null;

    const e = newItem[idx].productName
      ? product.find((item) => item.name === newItem[idx].productName)
        ? product.find((item) => item.name === newItem[idx].productName).price
        : 0
      : 0;

    const cost = Math.ceil(rate ? value * e + (value * e * rate) / 100 : 0);

    newItem[idx] = { ...newItem[idx], amount: value, cost: cost || 0 };
    setOtherItems(newItem);
  };

  useEffect(() => {
    setTotalPrice(0);
    if (otherItems.length) {
      otherItems.forEach((e) => {
        setTotalPrice((prev) => prev + e.cost);
      });
    }
  }, [otherItems]);

  useEffect(() => {
    const month = contract
      ? contract.length
        ? contract.find((e) => e.name === contractType)
          ? contract.find((e) => e.name === contractType).numberOfMonth
          : 0
        : 0
      : 0;

    setMonthly(totalPrice ? Math.ceil(totalPrice / month) : 0);
  }, [totalPrice]);

  // Shartnoma yaratish
  const [createContract, setCreateContract] = useState([]);

  useEffect(() => {
    dispatch(setPage("/contracts"));

    axios
      .get(
        URLS.start +
          URLS.contracts +
          `?day=${kechikkanKun || ""}&debt=${kechikkanSum || ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(setContractData(result.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [kechikkanKun, kechikkanSum]);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box">
        {!contractData ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb mahsulotlar_breadcrumb">
              <Link to="/">Asosiy</Link> /{" "}
              <Link className="active">Shartnomalar</Link>
            </div>

            <div className="mahsulotlar_header">
              <h3>Shartnomalar ro'yhati</h3>
              <div>
                <button
                  onClick={openModalE}
                  type="button"
                  className="btn btn-primary me-3"
                >
                  Mavjud shartnoma qo'shish
                </button>
                <button
                  onClick={openModal}
                  type="button"
                  className="btn btn-success"
                >
                  Shartnoma yaratish
                </button>
              </div>
            </div>

            <div className="contract_input_box mt-4">
              <div style={{ width: "16em" }} className="input-group mb-3 ">
                <input
                  onChange={(e) => setKechikkanKun(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Kechikkan kun"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  kun
                </span>
              </div>
              <div
                style={{ width: "16em" }}
                className="input-group mb-3 contracts_input ms-3"
              >
                <CurrencyInput
                  className="form-control"
                  onChange={(e) =>
                    setKechikkanSum(e.target.value.replace(/,/g, ""))
                  }
                  decimalsLimit={2}
                  placeholder="Kechikkan summa"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  so'm
                </span>
              </div>
            </div>

            <div className="mahsulotlar_items contracts_items">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">id</th>
                    <th scope="col">Mijoz nomi</th>
                    <th scope="col">Umumiy summa</th>
                    <th scope="col">Oylar soni</th>
                    <th scope="col">Oylik to'lov</th>
                    <th scope="col">Prosrochka</th>
                    <th scope="col">Kechikkan kun</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ma'lumot</th>
                    <th scope="col">Hujjat yuklash</th>
                    <th scope="col">Yuklab olish</th>
                  </tr>
                </thead>
                <tbody>
                  {!contractData.length ? (
                    <tr className="no_data_img_box"></tr>
                  ) : (
                    contractData.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.clientName} </td>
                          <td>{item.totalSum.toLocaleString()} so'm</td>
                          <td>{item.numberOfMonth} oy</td>
                          <td>{item.monthlySum.toLocaleString()} so'm</td>
                          <td>{item.debt.toLocaleString()} so'm</td>
                          <td>{item.day}</td>
                          <td>{item.status}</td>
                          <td>
                            <button
                              onClick={() => showInfo(item.id)}
                              type="button"
                              className="btn btn-primary btn-sm"
                            >
                              <FontAwesomeIcon icon={faFileLines} /> Ma'lumotlar
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setUploadId(item.id);
                                setUploadM(true);
                              }}
                              type="button"
                              className="contract_download_btn"
                            >
                              <FontAwesomeIcon icon={faFileArrowUp} /> Yuklash
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => download(item.id)}
                              type="button"
                              className="btn btn-success btn-sm"
                            >
                              <FontAwesomeIcon icon={faFileArrowDown} /> Yuklab
                              olish
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

      {itemInfoM ? (
        <div className="contracts_info">
          <div
            onClick={() => setItemInfoM(false)}
            className="contracts_info_bg"
          ></div>

          <div className="contracts_info_body_box">
            <div className="contracts_info_body">
              <div className="cont_ibh">
                <h5>Kontrakt haqida ma'lumotlar</h5>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => setItemInfoM(false)}
                  icon={faXmark}
                />
              </div>

              <div className="cont_btns_line">
                <button
                  onClick={() => setOtqM(true)}
                  className="btn btn-success me-4"
                >
                  Onlayn to'lov qilish
                </button>
                <button
                  onClick={() => setTqnpM(true)}
                  className="btn btn-success"
                >
                  To'lov qilish naqd pulda
                </button>
              </div>

              <div
                style={{ margin: "1em 0 0 0", height: "25em" }}
                className="mahsulotlar_items contracts_items"
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Oylar</th>
                      <th scope="col">Oylik to'lov</th>
                      <th scope="col">To'lov sanasi</th>
                      <th scope="col">Qolgan to'lov</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!itemInfo ? (
                      <LoaderTable />
                    ) : !itemInfo.cs.length ? (
                      <tr className="no_data_img_box"></tr>
                    ) : (
                      itemInfo.cs.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1} oy</td>
                            <td>{item.monthlySum} so'm</td>
                            <td>{item.paymentDate}</td>
                            <td>{item.remainingSum} so'm</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="cont_ei_btn_box">
                <div
                  onClick={() =>
                    setItemICStatus(
                      itemICStatus === 1 ? 2 : itemICStatus === 2 ? 3 : 2
                    )
                  }
                  className="contracts_tolovlar_tarixi cont_eim"
                >
                  <FontAwesomeIcon
                    className={
                      itemICStatus === 2
                        ? "cont_ar_icon cont_ar_icon_open"
                        : "cont_ar_icon"
                    }
                    icon={faAngleRight}
                  />{" "}
                  To'lovlar tarixi
                </div>
                <div
                  className={
                    itemICStatus === 1
                      ? "cont_eimi"
                      : itemICStatus === 2
                      ? "cont_eimi cont_eimi_open"
                      : "cont_eimi cont_eimi_close"
                  }
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Oylar</th>
                        <th scope="col">Orqali to'landi</th>
                        <th scope="col">To'langan summa</th>
                        <th scope="col">To'lov sanasi</th>
                      </tr>
                    </thead>
                    <tbody style={{ position: "relative" }}>
                      {!itemInfo ? (
                        <LoaderTable />
                      ) : !itemInfo.cph.length ? (
                        <tr className="no_data_img_box_table">
                          <td
                            style={{ borderBottom: "none" }}
                            className="no_data_img_box no_data_img_box_td"
                          ></td>
                        </tr>
                      ) : (
                        itemInfo.cph.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1} oy</td>
                              <td>{item.execType}</td>
                              <td>{item.paidSum} so'm</td>
                              <td>
                                {new Date(item.createdAt).toLocaleString(
                                  "uz-UZ"
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div
                  onClick={() =>
                    setItemICStatus2(
                      itemICStatus2 === 1 ? 2 : itemICStatus2 === 2 ? 3 : 2
                    )
                  }
                  className="mt-2 contracts_online_tolovlar_tarixi cont_eim"
                >
                  <FontAwesomeIcon
                    className={
                      itemICStatus2 === 2
                        ? "cont_ar_icon cont_ar_icon_open"
                        : "cont_ar_icon"
                    }
                    icon={faAngleRight}
                  />{" "}
                  Onlayn to'lovlar tarixi
                </div>

                <div
                  className={
                    itemICStatus2 === 1
                      ? "cont_eimi"
                      : itemICStatus2 === 2
                      ? "cont_eimi cont_eimi_open"
                      : "cont_eimi cont_eimi_close"
                  }
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">№</th>
                        <th scope="col">Karta raqami</th>
                        <th scope="col">To'langan summa</th>
                        <th scope="col">Komment</th>
                        <th scope="col">To'lov sanasi</th>
                        <th scope="col">To'lov raqami</th>
                      </tr>
                    </thead>
                    <tbody style={{ position: "relative" }}>
                      {!itemInfo ? (
                        <LoaderTable />
                      ) : !itemInfo.cuph.length ? (
                        <tr className="no_data_img_box_table">
                          <td
                            style={{ borderBottom: "none" }}
                            className="no_data_img_box no_data_img_box_td"
                          ></td>
                        </tr>
                      ) : (
                        itemInfo.cuph.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.cardNumber}</td>
                              <td>{item.totalAmount} so'm</td>
                              <td>{item.comment}</td>
                              <td>
                                {new Date(item.createdDate).toLocaleString(
                                  "uz-UZ"
                                )}
                              </td>
                              <td style={{ fontSize: "0.85em" }}>
                                {item.extraId}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {otqM ? (
        <div className="cont_otq">
          <div onClick={() => setOtqM(false)} className="cont_otq_bg"></div>
          <div className="cont_otq_item">
            <div className="cont_ibh">
              <h5>Onlayn to'lov qilish</h5>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => setOtqM(false)}
                icon={faXmark}
              />
            </div>
            <label className="cursor-pointer" htmlFor="otq">
              <span className="red me-1">*</span> Naqd
            </label>
            <div className="input-group mt-1 ">
              <CurrencyInput
                id="otq"
                className="form-control"
                decimalsLimit={2}
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>
            <div className="text-end my-3 mt-4">
              <button className="btn btn-success btn-sm">To'lov qilish</button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {tqnpM ? (
        <div className="cont_otq">
          <div onClick={() => setTqnpM(false)} className="cont_otq_bg"></div>
          <div className="cont_otq_item">
            <div className="cont_ibh">
              <h5>To'lov qilish naqd pulda</h5>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => setTqnpM(false)}
                icon={faXmark}
              />
            </div>
            <label className="cursor-pointer" htmlFor="tqnp_np">
              <span className="red me-1">*</span> Naqd pul
            </label>
            <div className="input-group mt-1 ">
              <CurrencyInput
                id="tqnp_np"
                className="form-control"
                decimalsLimit={2}
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>

            <label className="cursor-pointer mt-3" htmlFor="tqnp_ko">
              <span className="red me-1">*</span> Karta orqali
            </label>
            <div className="input-group mt-1 ">
              <CurrencyInput
                id="tqnp_ko"
                className="form-control"
                decimalsLimit={2}
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>

            <label className="cursor-pointer mt-3" htmlFor="tqnp_to">
              <span className="red me-1">*</span> Terminal orqali
            </label>
            <div className="input-group mt-1 ">
              <CurrencyInput
                id="tqnp_to"
                className="form-control"
                decimalsLimit={2}
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <span className="input-group-text" id="basic-addon1">
                so'm
              </span>
            </div>

            <label className="cursor-pointer mt-3" htmlFor="floatingTextarea2">
              Komment
            </label>
            <div className="form-floating">
              <textarea
                style={{ width: "100%", padding: "0.5em 1em" }}
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
              ></textarea>
            </div>
            <div className="text-end my-3">
              <button className="btn btn-success btn-sm">To'lov qilish</button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {uploadM ? (
        <div className="cont_otq">
          <div onClick={() => setUploadM(false)} className="cont_otq_bg"></div>
          <div className="cont_otq_item">
            <div className="cont_ibh">
              <h5>Hujjat yuklash</h5>
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={() => setUploadM(false)}
                icon={faXmark}
              />
            </div>
            <div>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  <span className="red">*</span> Yuklash
                </label>
                <input
                  onChange={handleFileChange}
                  className="form-control"
                  type="file"
                  id="formFile"
                  multiple
                />
                <div className="cont_download_items">
                  {!docFile.length
                    ? ""
                    : docFile.map((item, index) => {
                        return <div key={index}>{item.name}</div>;
                      })}
                </div>
              </div>
            </div>
            <div className="text-end mb-3">
              <button className="btn btn-success" onClick={uploadFile}>
                Yuklash
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Mavjud shartnomani qo'yish */}
      {addContract ? (
        <div className="cont_otq">
          <div
            onClick={() => setAddContract(false)}
            className="cont_otq_bg"
          ></div>
          {client ? (
            <div
              style={{ height: "calc(100vh - 11em)" }}
              className="cont_otq_item"
            >
              <div className="cont_ibh">
                <h5>Mavjud shartnomani qo'shish</h5>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => setAddContract(false)}
                  icon={faXmark}
                />
              </div>

              {/* Mijoz */}
              <label className="cursor-pointer" htmlFor="mijoz">
                <span
                  className={clientNameExtra ? "opacity-none me-1" : "red me-1"}
                >
                  *
                </span>{" "}
                Mijoz
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => changeNameE(e.target.value)}
                  list="create_contract-client_name"
                  type="text"
                  id="mijoz"
                  className={"form-control " + clientNameExtraC}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <datalist id="create_contract-client_name">
                  {client.map((item) => {
                    return (
                      <option key={item.id} value={item.fullName}></option>
                    );
                  })}
                </datalist>
              </div>

              {/* Shartnoma raqami */}
              <label className="cursor-pointer mt-3" htmlFor="shartnoma-raqami">
                <span
                  className={contractNumber ? "opacity-none me-1" : "red me-1"}
                >
                  *
                </span>{" "}
                Shartnoma raqami
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => setContractNumber(e.target.value)}
                  type="text"
                  id="shartnoma-raqami"
                  className={"form-control " + contractNumberC}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              {/* Oylar soni */}
              <label className="cursor-pointer mt-3" htmlFor="oylar-soni">
                <span className={mothNum ? "opacity-none me-1" : "red me-1"}>
                  *
                </span>{" "}
                Oylar soni
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => setMonthNum(e.target.value)}
                  type="number"
                  id="oylar-soni"
                  className={"form-control " + mothNumC}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  min={0}
                />
              </div>

              {/* To'lov sanasi */}
              <label className="cursor-pointer mt-3" htmlFor="tulov-sanasi">
                <span
                  className={paymentDate ? "opacity-none me-1" : "red me-1"}
                >
                  *
                </span>{" "}
                To'lov sanasi
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => setPaymentDate(e.target.value)}
                  type="number"
                  id="tulov-sanasi"
                  className={"form-control " + paymentDateC}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              {/* Umumiy summa */}
              <label className="cursor-pointer mt-3" htmlFor="umumiy-summa">
                <span className={totalSum ? "opacity-none me-1" : "red me-1"}>
                  *
                </span>{" "}
                Umumiy summa
              </label>
              <div className="input-group mt-1 ">
                <CurrencyInput
                  onChange={(e) =>
                    setTotalSum(e.target.value.replace(/,/g, ""))
                  }
                  id="umumiy-summa"
                  className={"form-control " + totalSumC}
                  decimalsLimit={2}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  so'm
                </span>
              </div>

              {/* Avto to'lov */}
              <label className="cursor-pointer mt-3" htmlFor="avto-tulov">
                <input
                  onChange={(e) => setAutoPayment(e.target.checked)}
                  className="me-2 cursor-pointer"
                  id="avto-tulov"
                  type="checkbox"
                />
                Avto to'lov
              </label>

              <div className="text-end mb-3">
                <button className="btn btn-success" onClick={createE}>
                  Qo'shish
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

      {/* Shartnoma yaratish */}
      {createContM ? (
        <div className="cont_otq">
          <div
            onClick={() => setCreateContM(false)}
            className="cont_otq_bg"
          ></div>
          {allAxios === 3 ? (
            <div style={{ width: "60em" }} className="cont_otq_item">
              <div className="cont_ibh">
                <h5>Shartnoma yaratish</h5>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => setCreateContM(false)}
                  icon={faXmark}
                />
              </div>

              {/* Mijoz */}
              <label
                className="cursor-pointer"
                htmlFor="create_contract-client_name1"
              >
                <span className={clientName ? "opacity-none me-1" : "red me-1"}>
                  *
                </span>{" "}
                Mijoz
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => {
                    clientNameChange(e.target.value);
                  }}
                  list="create_contract-client_name"
                  type="text"
                  id="create_contract-client_name1"
                  className={"form-control " + clientNameClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <datalist id="create_contract-client_name">
                  {client.map((item) => {
                    return (
                      <option key={item.id} value={item.fullName}></option>
                    );
                  })}
                </datalist>
              </div>

              {/* Shartnoma raqami */}
              <label
                className="cursor-pointer mt-3"
                htmlFor="shartnoma-raqami2"
              >
                <span
                  className={contractNum ? "opacity-none me-1" : "red me-1"}
                >
                  *
                </span>{" "}
                Shartnoma raqami
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => {
                    setContractNum(e.target.value);
                    setContractNumClass();
                  }}
                  type="text"
                  id="shartnoma-raqami2"
                  className={"form-control " + contractNumClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              {/* Shartnoma turi */}
              <label className="cursor-pointer mt-3" htmlFor="shartnoma-turi2">
                <span
                  className={contractType ? "opacity-none me-1" : "red me-1"}
                >
                  *
                </span>{" "}
                Shartnoma turi
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => {
                    clientTermIdChange(e.target.value);
                  }}
                  list="create_contract-contract_type"
                  type="text"
                  id="shartnoma-turi2"
                  className={"form-control " + contractTypeClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <datalist id="create_contract-contract_type">
                  {contract.map((item) => (
                    <option key={item.id} value={item.name}></option>
                  ))}
                </datalist>
              </div>

              {/* To'lov sanasi */}
              <label className="cursor-pointer mt-3" htmlFor="to'lov-sanasi2">
                <span className={payDate ? "opacity-none me-1" : "red me-1"}>
                  *
                </span>{" "}
                To'lov sanasi
              </label>
              <div className="input-group mt-1 ">
                <input
                  onChange={(e) => {
                    setPayDate(e.target.value);
                    setPayDateClass();
                  }}
                  type="text"
                  id="to'lov-sanasi2"
                  className={"form-control " + payDateClass}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              {/* Yana boshqa mahsulot */}

              {otherItems.length
                ? otherItems.map((item, index) => {
                    return (
                      <div key={index} className="add_again_items mt-3">
                        <div style={{ width: "15em" }}>
                          <label htmlFor={"product" + index} className="mb-1">
                            <span className="red">*</span> Mahsulot
                          </label>
                          <input
                            id={"product" + index}
                            list="create_contract-product"
                            value={item.productName ? item.productName : ""}
                            onChange={(e) => {
                              updateItem(e.target.value, index);
                            }}
                            type="text"
                            className="form-control"
                          />
                          <datalist id="create_contract-product">
                            {product.map((n) => (
                              <option key={n.id} value={n.name}></option>
                            ))}
                          </datalist>
                        </div>

                        <div style={{ width: "15em" }}>
                          <label
                            htmlFor={"product-count" + index}
                            className="mb-1"
                          >
                            <span className="red">*</span> Miqdori
                          </label>
                          <input
                            value={item.amount ? item.amount : ""}
                            onChange={(e) => {
                              updateCount(e.target.value, index);
                            }}
                            id={"product-count" + index}
                            type="number"
                            className="form-control"
                            min={0}
                          />
                        </div>
                        <div
                          style={{ width: "13em" }}
                          className="add_again_items_x"
                        >
                          {otherItems[index].cost
                            ? otherItems[index].cost.toLocaleString()
                            : 0}{" "}
                          so'm
                        </div>
                        <FontAwesomeIcon
                          onClick={() => removeItem(index)}
                          className="add_again_items_x cursor-pointer"
                          icon={faXmark}
                        />
                      </div>
                    );
                  })
                : ""}

              <div className="my-3">
                <button
                  onClick={createItem}
                  style={{ width: "100%" }}
                  className="btn btn-outline-success"
                >
                  <FontAwesomeIcon icon={faPlus} /> Mahsulot qo'shish
                </button>
              </div>

              <div>
                <span className="contract_create_contract_cost">
                  Umumiy summa:
                </span>{" "}
                {totalPrice.toLocaleString()} so'm
              </div>
              <div className="mt-1">
                <span className="contract_create_contract_cost">
                  Oylik to'lov:
                </span>{" "}
                {monthly.toLocaleString()} so'm
              </div>
              <div className="flex-center mt-3 cursor-pointer">
                <input
                  onChange={(e) => setAutoPay(e.target.checked)}
                  className="me-2"
                  type="checkbox"
                  id="avto-tulov"
                />{" "}
                <label htmlFor="avto-tulov">Avto to'lov</label>
              </div>
              <div>
                <button onClick={create} className="btn btn-success my-4">
                  Shartnoma yaratish
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

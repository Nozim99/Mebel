import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    productsData: null,
    categoryData: null,
    clientsData: null,
    contractData: null,
    contractTermsData: null,
    cargoData: null,
    warehouseData: null,
    warehouseOtherProducts: null,
    checkoutData: null,
    adminData: null,
    transaction: null,
  },
  reducers: {
    setProductsData: (state, { payload }) => {
      state.productsData = payload;
    },
    setCategoryData: (state, { payload }) => {
      state.categoryData = payload;
    },
    addCategoryToData: (state, { payload }) => {
      if (state.categoryData && state.categoryData.length) {
        const arr = [];
        state.categoryData.forEach((e) => {
          arr.push(+e.id);
        });

        const maxId = Math.max(...arr);

        state.categoryData.push({
          id: maxId + 1,
          name: payload,
        });
      } else {
        state.categoryData = [
          {
            id: 1,
            name: payload,
          },
        ];
      }
    },
    changeCategory: (state, { payload }) => {
      const index = state.categoryData.findIndex((e) => e.id === +payload[0]);
      state.categoryData[index].name = payload[1];
    },
    setClientsData: (state, { payload }) => {
      state.clientsData = payload;
    },
    addClient: (state, { payload }) => {
      if (state.clientsData) {
        if (state.clientsData.length) {
          const arr = [];
          state.clientsData.forEach((e) => {
            arr.push(+e.id);
          });

          const maxId = Math.max(...arr);

          payload.id = maxId;

          state.clientsData.push(payload);
        } else {
          payload.id = 1;
          state.clientsData.push(payload);
        }
      } else {
        payload.id = 1;
        state.clientsData = [payload];
      }
    },
    updateClient: (state, { payload }) => {
      const idx = state.clientsData.findIndex((e) => +e.id === +payload[0]);
      state.clientsData[idx] = payload[1];
    },
    setContractData: (state, { payload }) => {
      state.contractData = payload;
    },
    addContractData: (state, { payload }) => {
      payload.day = 0;
      payload.status = "OPEN";
      if (state.contractData) {
        if (state.contractData.length) {
          const arr = [];
          state.contractData.forEach((e) => {
            arr.push(e.id);
          });

          const MaxId = Math.max(...arr);
          payload.id = MaxId + 1;
          state.contractData.push(payload);
        } else {
          payload.id = 1;
          state.contractData.push(payload);
        }
      } else {
        payload.id = 1;
        state.contractData = [payload];
      }
    },
    setContractTermsData: (state, { payload }) => {
      state.contractTermsData = payload;
    },
    addContractTermsData: (state, { payload }) => {
      if (state.contractTermsData) {
        const arr = [];
        state.contractTermsData.forEach((e) => {
          arr.push(+e.id);
        });

        const maxId = Math.max(...arr);

        state.contractTermsData.push({
          id: maxId + 1,
          name: String(payload.termName),
          rate: payload.numberOfMonth,
          numberOfMonth: payload.termRate,
          createdAt: new Date().toLocaleString("uz-UZ"),
        });
      } else {
        state.contractTermsData = [
          {
            id: 1,
            name: String(payload.termName),
            rate: payload.numberOfMonth,
            numberOfMonth: payload.rate,
            createdAt: new Date().toLocaleString("uz-UZ"),
          },
        ];
      }
    },
    changeContractTermsData: (state, { payload }) => {
      const idx = state.contractTermsData.findIndex((e) => e.id === payload[0]);
      state.contractTermsData[idx].name = payload[1];
      state.contractTermsData[idx].rate = payload[2];
      state.contractTermsData[idx].numberOfMonth = payload[3];
    },
    setCargoData: (state, { payload }) => {
      state.cargoData = payload;
    },
    addCargoData: (state, { payload }) => {
      if (state.cargoData && state.cargoData.lenght) {
        const arr = [];
        state.cargoData.forEach((e) => {
          arr.push(e.id);
        });

        const maxId = Math.max(...arr);

        state.cargoData.push({
          id: maxId + 1,
          createdAt: new Date().toLocaleString("uz-UZ"),
          name: payload.name,
          createdBy: "admin",
          phone: payload.phone,
        });
      } else {
        state.cargoData = [
          {
            id: 1,
            createdAt: new Date().toLocaleString("uz-UZ"),
            name: payload.name,
            createdBy: "admin",
            phone: payload.phone,
          },
        ];
      }
    },
    changeCargoData: (state, { payload }) => {
      if (state.cargoData) {
        const idx = state.cargoData.findIndex((e) => e.id === payload[0]);

        state.cargoData[idx].name = payload[1];
        state.cargoData[idx].phone = payload[2];
      }
    },
    setWarehouseData: (state, { payload }) => {
      state.warehouseData = payload;
    },
    setWarehouseOtherProducts: (state, { payload }) => {
      state.warehouseOtherProducts = payload;
    },
    setCheckoutData: (state, { payload }) => {
      state.checkoutData = payload;
    },
    resetCheckoutData: (state) => {
      let updatedCheckoutData = {};
      if (state.checkoutData) {
        updatedCheckoutData = {
          ...state.checkoutData,
          cash: 0,
          card: 0,
          terminal: 0,
          online: 0,
        };
      }
      return { ...state, checkoutData: updatedCheckoutData };
    },
    payCheckoutData: (state, { payload }) => {
      if (state.checkoutData && state.checkoutData.cash) {
        state.checkoutData.cash = state.checkoutData.cash + payload;
      }
    },
    setAdminData: (state, { payload }) => {
      state.adminData = payload;
    },
    setTransaction: (state, { payload }) => {
      state.transaction = payload;
    },
  },
});

export const {
  setProductsData,
  setCategoryData,
  addCategoryToData,
  changeCategory,
  setClientsData,
  addClient,
  updateClient,
  setContractData,
  addContractData,
  setContractTermsData,
  setCargoData,
  setWarehouseData,
  setWarehouseOtherProducts,
  setCheckoutData,
  resetCheckoutData,
  payCheckoutData,
  setAdminData,
  addContractTermsData,
  changeContractTermsData,
  addCargoData,
  changeCargoData,
  setTransaction,
} = dataSlice.actions;
export default dataSlice.reducer;

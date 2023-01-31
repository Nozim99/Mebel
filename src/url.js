export const URLS = {
  start: "https://testapi.mebel-rassrochka.uz/api/v1",

  //AUTH
  auth: "/jwt/access",
  //AUTH

  //PRODUCT
  products: "/products/findAll",
  product: "/products/findBy",
  product_create: "/products/save",
  product_update: "/products/edit/",
  //PRODUCT

  //CATEGORY
  categories: "/categories/all",
  category: "/categories/findById",
  category_create: "/categories/save",
  category_update: "/categories/edit/",
  //CATEGORY

  //CLIENT
  clients: "/clients/findAll",
  client: "/clients/findById",
  client_create: "/clients/save",
  client_update: "/clients/edit/",
  client_cardAdd: "/clients/addCard/",
  client_cardAddOtp: "/clients/confirmOtp",
  cartDetail: "/clients/cards",
  cart_delete: "/clients/deleteCardById/",
  clientContract: "/clients/findAllContracts",
  //CLIENT

  //CONTRACT
  contracts: "/contracts/findAll",
  contract: "/contracts/findBy",
  create_contract: "/contracts/createContract",
  create_existing_contract: "/contracts/createExistingContract",
  close_contract: "/contracts/closeContract/",
  contract_detail: "/contracts/details/",
  contract_payment: "/payments/doPaymentForContract/",
  contract_online_payment: "/payments/doOnlinePaymentForContract/",
  contract_upload: "/contracts/uploadFile/",
  contract_download: "/contracts/download/",
  //CONTRACT

  //CASHIER
  cashier_list: "/kassa/get",
  cashier_clear: "/kassa/reset",
  cashier_replenish: "/kassa/replenish",
  //CASHIER

  //TERM
  terms: "/terms/findAll",
  term: "/terms/findById",
  term_create: "/terms/save",
  term_update: "/terms/edit/",
  //TERM

  //TAX
  tax: "/soliq/findAll",
  tax_send: "/soliq/send",
  //TAX

  //WAREHOUSE
  warehouse_history: "/warehouse/history",
  warehouse_remain: "/warehouse/remainingProducts",
  warehouse_income: "/warehouse/income",
  warehouse_outcome: "/warehouse/outcome",
  //WAREHOUSE

  //MERCHANT
  merchants: "/merchants/findAll",
  merchant: "/merchants/findById",
  merchant_create: "/merchants/save",
  merchant_update: "/merchants/edit/",
  merchant_calc: "/merchants/calculateDebt/",
  merchant_payment: "/payments/doPaymentForMerchant/",
  //MERCHANT

  //TRANSACTION
  transactions: "/transactions/findAll",
  //TRANSACTION

  //ADMIN
  admins: "/users/findAll",
  admin: "/users/findById/",
  create_admin: "/users/save",
  admin_update: "/users/edit/",
  //ADMIN
};

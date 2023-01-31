import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Admin from "./components/views/Admin";
import Cargo from "./components/views/Cargo";
import Category from "./components/views/Category";
import Checkout from "./components/views/Checkout";
import Clients from "./components/views/Clients";
import Contracts from "./components/views/Contracts";
import ContractTerms from "./components/views/ContractTerms";
import Product from "./components/views/extra/Product";
import Home from "./components/views/Home";
import Login from "./components/views/Login";
import Mahsulotlar from "./components/views/Mahsulotlar";
import Menu from "./components/views/Menu";
import Navbar from "./components/views/Navbar";
import Tax from "./components/views/Tax";
import Transaktion from "./components/views/Transaktion";
import Warehouse from "./components/views/Warehouse";

function App() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.config);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Mahsulotlar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mahsulot/:product" element={<Product />} />
        <Route path="/category" element={<Category />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/contract-terms" element={<ContractTerms />} />
        <Route path="/cargo" element={<Cargo />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/transaktion" element={<Transaktion />} />
        <Route path="/tax" element={<Tax />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;

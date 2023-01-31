import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Menu from "./Menu";
import { setPage } from "../../redux/slices/config";

export default function Tax() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPage("/tax"));
  }, []);

  return (
    <div className="mahsulotlar">
      <Menu />
      <div className="mahsulotlar_box"></div>
    </div>
  );
}

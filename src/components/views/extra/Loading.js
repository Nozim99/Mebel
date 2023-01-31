import React from "react";
import { useSelector } from "react-redux";
import "../../styles/loading.css";

export default function Loading() {
  return (
    <div className="Loader2">
      <div className="lds-roller lds-roller_light">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

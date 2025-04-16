import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccessDisplay = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("paymentId");

  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Payment ID: {paymentId}</p>
    </div>
  );
};

export default PaymentSuccessDisplay;

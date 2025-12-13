import React, { useState } from "react";
import axios from "axios";
import classes from "./PaymentDisplay.module.css"; // Import the CSS Module
import { v4 as uuidv4 } from "uuid";

const PaymentDisplay = () => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const createPayment = async () => {
    setLoading(true);

    // ----------------------------------
    // ДЛЯ КОРРЕКТНОЙ РАБОТЫ ТЕСТОВОЙ ВЕРСИИ НУЖНО ПЕРЕЙТИ https://cors-anywhere.herokuapp.com/corsdemo
    // И ЗАПРОСИТЬ ВРЕМЕННЫЙ ДОСТУП
    // ----------------------------------

    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // CORS proxy
      const targetUrl = "https://api.yookassa.ru/v3/payments";

      const idempotenceKey = uuidv4();

      const response = await axios.post(
        proxyUrl + targetUrl, // Use the proxy URL
        {
          amount: {
            value: 100,
            currency: "RUB",
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: "/payment-success", // Redirect after payment
          },
          description: "Оплата товара",
        },
        {
          auth: {
            username: "1037755", // Replace with your shop ID
            password: "test_7guGLSM14CocCWNqdP6i3818T6ndD8a2lj-c8KdqAqU", // Replace with your secret key
          },
          headers: {
            "Content-Type": "application/json",
            "Idempotence-Key": idempotenceKey,
          },
        }
      );

      if (response.data && response.data.confirmation.confirmation_url) {
        setPaymentUrl(response.data.confirmation.confirmation_url);
        window.location.href = response.data.confirmation.confirmation_url; // Redirect to YooKassa
      }
    } catch (error) {
      console.error(
        "Error creating payment:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Оплата через ЮKassa</h2>
      <button
        onClick={createPayment}
        disabled={loading}
        className={classes.button}
      >
        {loading ? "Создание платежа..." : "Оплатить"}
      </button>
      {paymentUrl && (
        <p>
          Если не произошло автоматическое перенаправление, нажмите{" "}
          <a href={paymentUrl} className={classes.link}>
            здесь
          </a>
        </p>
      )}
    </div>
  );
};

export default PaymentDisplay;

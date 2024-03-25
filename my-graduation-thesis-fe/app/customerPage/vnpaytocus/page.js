"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useCart } from "../../../context/CartContext";
import { Notification } from "@douyinfe/semi-ui";

const VnpToCus = () => {
  const { clearCart } = useCart();
  //Call API lay Order code
  const getOrderCode = async () => {
    try {
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Orders/GetLastestOrder`,
        {
          headers: {
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const orderData = await response.json();
        console.log("ordercode: ", orderData.id);
        createInvoice(orderData.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Send order code to email
  const createInvoice = async (order_id) => {
    try {
      const storedData = JSON.parse(
        window.localStorage.getItem("orderFormData")
      );
      const requestBody = {
        orderId: order_id,
        email: storedData.email,
      };
      console.log("Invoice request body:", requestBody);
      const response = await fetch(
        "https://erscus.azurewebsites.net/api/Orders/InvoiceOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        window.localStorage.removeItem("orderFormData");
        const data = await response.json();
        Notification.success({
          title: "Success",
          content:
            "Create Order Successfully! Order Code was sent to your email.",
          duration: 5,
          theme: "light",
        });
        // Xử lý dữ liệu trả về nếu cần
        console.log("Invoice created successfully:", data);
      } else {
        // Xử lý lỗi nếu có
        console.error("Failed to create invoice:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };
  useEffect(() => {
    const storedData = JSON.parse(window.localStorage.getItem("orderFormData"));

    if (!storedData) {
      console.log(
        "No order data found in localStorage. Skipping order creation."
      );
      return;
    }

    const fetchData = async () => {
      try {
        storedData.userId =
          Cookies.get("userId") || "3f5b49c6-e455-48a2-be45-26423e92afbe";
        storedData.orderMethod = 1;

        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(storedData),
          }
        );

        if (response.ok) {
          getOrderCode();
          console.log("Order created successfully");
          clearCart();
        } else {
          console.error("Failed to create order");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="w-full">
          <img src="/staticImage/thankyou.png" />
        </div>
        <div className="bg-[#74a65d] flex flex-col items-center">
          <div className="text-white text-2xl py-6">Dear Our Customer,</div>
          <div className=" md:w-2/3 text-white text-2xl mx- text-center">
            Thank you for your recent order. We are pleased to confirm that we
            have received your order and it is currently being processed.
          </div>
          <div className="my-10">
            {Cookies.get("userId") &&
            Cookies.get("userId") !== "3f5b49c6-e455-48a2-be45-26423e92afbe" ? (
              <Link
                className="font-light rounded-md bg-white text-gray-400 hover:text-[#74a65d] w-36 p-2"
                href={"/customerPage/order-history/order-list"}
              >
                View Order
              </Link>
            ) : (
              <Link
                className="font-light rounded-md bg-white text-gray-400 hover:text-[#74a65d] w-36 p-2"
                href={"/customerPage/check-order"}
              >
                View Order
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VnpToCus;

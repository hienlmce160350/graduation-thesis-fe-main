"use client";

// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Pagination } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { Notification, Steps, Progress, Empty } from "@douyinfe/semi-ui";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";

/* The following is available after version 1.13.0 */
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
const OrderDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  const getOrdersList = async () => {
    let orderCode = Cookies.get("orderCode");

    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Orders/GetByOrderCode/${orderCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.items);
        setOrderDate(data.orderDate);
        setOrderStatus(data.status);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrdersList();
  }, []);
  // formatDate
  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);

    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; // Tháng trong JavaScript là từ 0 đến 11
    const year = inputDate.getFullYear();

    const formattedDate = `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;
    return formattedDate;
  };
  // end formatDate
  const [orderDate, setOrderDate] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  // Sum total bill
  const calculateTotalPrice = () => {
    return orders.reduce((total, order) => total + order.price, 0);
  };

  const totalSteps = 5;
  const currentStep = orderStatus || 0; // Use 0 if data.status is undefined or null

  // Tính toán giá trị phần trăm
  const percent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <>
      <div className="ml-32">
        <Breadcrumb compact={false}>
          <Breadcrumb.Item
            icon={<IconHome />}
            href="/customerPage/home"
          ></Breadcrumb.Item>
          <Breadcrumb.Item icon={<IconBox />} href="/customerPage/check-order">Check Order</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="max-w-7xl mx-auto my-4 px-4 rounded-lg">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Order Detail</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>
        <div className="">
          <Steps
            type="basic"
            current={orderStatus}
            className="w-full !text-red"
          >
            <Steps.Step title="In Progress" />
            <Steps.Step title="Confirmed" />
            <Steps.Step title="Shipping" />
            <Steps.Step title="Success" />
            <Steps.Step title="Canceled" />
          </Steps>
        </div>
        <div className="contain grid grid-cols-1 lg:grid-cols-3 gap-20 mt-5 mb-5">
          <div>
            <h5 className="text-base font-semibold">Complete</h5>
            <h2 className="text-2xl font-semibold">{percent}%</h2>
            <Progress percent={percent} aria-label="disk usage" />
          </div>
        </div>

        {loading ? (
          <p className="items-center">Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : orders.length === 0 ? (
          <div className="overflow-x-auto">
            <div className="flex flex-col ">
              <Empty
                image={
                  <IllustrationNoResult style={{ width: 150, height: 150 }} />
                }
                darkModeImage={
                  <IllustrationNoResultDark
                    style={{ width: 150, height: 150 }}
                  />
                }
                description={<p className="font-semibold text-2xl">No Order</p>}
                className="p-6 pb-1"
              />
              <p className="font-extralight">Go find the product you like.</p>
              <Link href={"/customerPage/product/product-list"}>
                <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-white mt-5">
                  Go Shopping
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg p-2 shadow-lg">
            <p> Details </p>
            <div className="flex flex-col w-full">
              {orders.map((order, index) => (
                <div key={index} className="w-full py-2 px-2 mt-1 border-b-2">
                  <div className="flex mt-2">
                    <div>
                      <img
                        src={order.imagePath}
                        alt={order.productName}
                        className="h-24 w-auto"
                      />
                    </div>
                    <div className="ml-5">
                      <p>
                        <span className="font-semibold">
                          {order.productName}
                        </span>
                      </p>
                      <p>
                        Total Price:{" "}
                        <span className="font-semibold">${order.price}</span>
                      </p>
                      <p>
                        Quantity:{" "}
                        <span className="font-semibold">{order.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-2/3 py-4 px-2 my-1 flex">
                <div className="mt-2 ml-2">
                  {orders.length > 0 && (
                    <p>Order Date: {formatDate(orderDate)}</p>
                  )}
                </div>
                <div className="ml-auto">
                  <p>
                    Total Bill:
                    <span className="font-semibold text-red-600 text-2xl ml-2">
                      ${calculateTotalPrice()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetails;

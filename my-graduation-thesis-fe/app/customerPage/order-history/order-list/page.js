"use client";

// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Pagination } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { Empty } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";

/* The following is available after version 1.13.0 */
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { Input, Typography } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const ordersPerPage = 10;
  const bearerToken = Cookies.get("token");
  const getOrdersList = async (status) => {
    try {
      const userId = Cookies.get("userId");
      switch (status) {
        case 0:
          status = "";
          break;
        case 1:
          status = 0;
          break;
        case 2:
          status = 1;
          break;
        case 3:
          status = 2;
          break;
        case 4:
          status = 3;
          break;
        case 5:
          status = 4;
          break;
      }
      console.log(
        "thanh ne: " +
          `https://eatright2.azurewebsites.net/api/Orders/GetUserOrderHistoryByOrderStatus?UserId=${userId}&Status=${status}`
      );
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Orders/GetUserOrderHistoryByOrderStatus?UserId=${userId}&Keyword=${keyword}&Status=${encodeURIComponent(
          status
        )}`, // Include userId in the API endpoint
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  //Enum
  const OrderStatus = {
    InProgress: 0,
    Confirmed: 1,
    Shipping: 2,
    Success: 3,
    Canceled: 4,
  };
  const getOrderStatusLabel = (status) => {
    switch (status) {
      case OrderStatus.InProgress:
        return { label: "In Progress", colorClass: "" };
      case OrderStatus.Confirmed:
        return { label: "Confirmed", colorClass: "text-blue-500" };
      case OrderStatus.Shipping:
        return { label: "Shipping", colorClass: "text-gray-500" };
      case OrderStatus.Success:
        return { label: "Success", colorClass: "text-green-500" };
      case OrderStatus.Canceled:
        return { label: "Canceled", colorClass: "text-red-500" };
      default:
        return { label: "Unknown Status", colorClass: "text-gray-700" };
    }
  };

  useEffect(() => {
    const userId = Cookies.get("userId");

    if (userId) {
      getOrdersList("");
      setActiveItem(0);
    } else {
      // Handle the case when userId is not available (e.g., user not authenticated)
      console.error("UserId not found in cookies");
    }
  }, [keyword]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  const currentOrdersData = orders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (index) => {
    setActiveItem(index);
    getOrdersList(index);
  };

  const onHandleChange = (keyword) => {
    setKeyword(keyword);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 rounded-lg">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item noLink={true}>My Order</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Order History</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>

        <div className="flex flex-row text-center font-semibold border-b-2 border-b-solid">
          <a
            className={`p-4 w-full cursor-pointer ${
              activeItem === 0
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(0)}
          >
            All
          </a>
          <a
            className={`p-4 w-full cursor-pointer ${
              activeItem === 1
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(1)}
          >
            In Progress
          </a>
          <a
            className={`p-4 w-full cursor-pointer ${
              activeItem === 2
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(2)}
          >
            Confirmed
          </a>
          <a
            className={`p-4 w-full cursor-pointer ${
              activeItem === 3
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(3)}
          >
            Shipping
          </a>
          <a
            className={`p-4 w-full cursor-pointer ${
              activeItem === 4
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(4)}
          >
            Successed
          </a>
          <a
            className={`p-4 w-full cursor-pointer  ${
              activeItem === 5
                ? "!cursor-default border-b-green-600 border-b-2 text-green-500"
                : ""
            }`}
            onClick={() => handleClick(5)}
          >
            Canceled
          </a>
        </div>
        <div className="my-3">
          <Input
            prefix={<IconSearch className="!text-xl" />}
            showClear
            placeholder="You can search for products via product code"
            className="!rounded-[10px] !w-full !h-11 !border-2 border-solid !border-[#DDF7E3] !bg-white"
            onChange={onHandleChange}
          ></Input>
        </div>
        {orders == "" ? (
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
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
        ) : loading ? (
          <p className="items-center">Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="grid-cols-1 md:grid-cols-2 grid md:gap-1">
                {currentOrdersData.map((order) => (
                  <div
                    key={order.orderId}
                    className="w-full py-4 px-2 rounded-lg border shadow-lg my-2"
                  >
                    <div className="flex justify-between ">
                      <p className="font-semibold">
                        Order Code: {order.orderCode}
                      </p>
                      <p
                        className={`font-semibold ${
                          getOrderStatusLabel(order.status).colorClass
                        }`}
                      >
                        {getOrderStatusLabel(order.status).label}
                      </p>
                    </div>
                    <div className="w-ful border-t mt-2"></div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p>
                          Ship Name: <span>{order.shipName}</span>
                        </p>
                        <p>Ship Phone: {order.shipPhoneNumber}</p>
                      </div>
                      <div>
                        <p>Ship Address: {order.shipAddress}</p>
                        <p>Ship Email: {order.shipEmail}</p>
                      </div>
                    </div>

                    <Link
                      href={`/customerPage/order-history/order-details/${order.id}`}
                    >
                      <div className="flex justify-end mt-3">
                        <button className="w-40 h-auto buttonGradient rounded-lg">
                          View Detail
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center my-4">
              <Pagination
                total={totalPages * 10}
                currentPage={page}
                onPageChange={onPageChange}
              ></Pagination>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default OrderHistory;

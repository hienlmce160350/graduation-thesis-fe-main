"use client";

// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Pagination } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { Empty } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBox, IconFilter } from "@douyinfe/semi-icons";

/* The following is available after version 1.13.0 */
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { Input, Typography, Modal, Button } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../context/withAuth";
import { formatCurrency } from "@/libs/commonFunction";
const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const ordersPerPage = 10;
  const bearerToken = Cookies.get("token");
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
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
        case 6:
          status = 5;
          break;
      }
      console.log(
        "thanh ne: " +
          `https://erscus.azurewebsites.net/api/Orders/GetUserOrderHistoryByOrderStatus?UserId=${userId}&Status=${status}`
      );
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Orders/GetUserOrderHistoryByOrderStatus?UserId=${userId}&Keyword=${keyword}&Status=${encodeURIComponent(
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
    Refunded: 5,
  };
  const getOrderStatusLabel = (status) => {
    switch (status) {
      case OrderStatus.InProgress:
        return { label: "In Progress", colorClass: "" };
      case OrderStatus.Confirmed:
        return { label: "Confirmed", colorClass: "text-blue-500" };
      case OrderStatus.Shipping:
        return { label: "Shipping", colorClass: "text-yellow-500" };
      case OrderStatus.Success:
        return { label: "Success", colorClass: "text-green-500" };
      case OrderStatus.Canceled:
        return { label: "Canceled", colorClass: "text-red-500" };
      case OrderStatus.Refunded:
        return { label: "Refunded", colorClass: "text-red-800" };
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
            <Breadcrumb.Item icon={<IconHome />}>
              <Link href="/customerPage/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item noLink={true}>My Order</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-[#74A65D]">Order History</h1>
          <div className="h-1 w-32 mt-3 bg-[#74A65D]"></div>
        </div>

        <div className="hidden md:flex text-center font-semibold justify-between mb-6 items-center">
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer ${
                activeItem === 0
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(0)}
            >
              All
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer ${
                activeItem === 1
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(1)}
            >
              In Progress
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer ${
                activeItem === 2
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(2)}
            >
              Confirmed
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer ${
                activeItem === 3
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(3)}
            >
              Shipping
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer ${
                activeItem === 4
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(4)}
            >
              Successed
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer  ${
                activeItem === 5
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(5)}
            >
              Canceled
            </a>
          </div>
          <div className="m-2">
            <a
              className={`p-4 w-fit md:w-full cursor-pointer  ${
                activeItem === 6
                  ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                  : ""
              }`}
              onClick={() => handleClick(6)}
            >
              Refunded
            </a>
          </div>
        </div>
        <div className="md:hidden rounded-md border border-[#69AD28] flex flex-row items-center text-center justify-center w-fit mb-5">
          <button
            onClick={showDialog}
            type="button"
            className="h-10 !text-[#69AD28] flex items-center justify-center px-2"
          >
            <IconFilter />
            <p className="text-[#69AD28]">Filter</p>
          </button>
        </div>
        <Modal
          width={400}
          title={
            <div className="text-center w-full pl-10 text-gray-400">
              Filter Order
            </div>
          }
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={
            <div className="flex justify-center">
              <Button
                className="!text-[#74A65D] !ml-0 !border !border-[#74A65D] hover:border-[#44703D] hover:text-[#44703D] !rounded-lg !p-2 w-[100%] !h-10 !bg-white"
                onClick={handleOk}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="my-3">
            <Input
              prefix={<IconSearch className="!text-xl" />}
              showClear
              placeholder="You can search for products via product code"
              className="!rounded-[10px] !w-[100%]  !h-12 !border-2 border-solid !border-[#ACCC8B] !bg-white"
              onChange={onHandleChange}
            ></Input>
          </div>
          <div className="grid grid-cols-3 items-center text-center">
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer ${
                  activeItem === 0
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(0)}
              >
                All
              </a>
            </div>
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer ${
                  activeItem === 1
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(1)}
              >
                In Progress
              </a>
            </div>
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer ${
                  activeItem === 2
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(2)}
              >
                Confirmed
              </a>
            </div>
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer ${
                  activeItem === 3
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(3)}
              >
                Shipping
              </a>
            </div>
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer ${
                  activeItem === 4
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(4)}
              >
                Successed
              </a>
            </div>
            <div className="m-2">
              <a
                className={`p-4 w-fit md:w-full cursor-pointer  ${
                  activeItem === 5
                    ? "!cursor-default md:border-b-[#69AD28] md:border-b-2 text-[#69AD28]"
                    : ""
                }`}
                onClick={() => handleClick(5)}
              >
                Canceled
              </a>
            </div>
          </div>
        </Modal>
        <div className="my-3 hidden md:flex">
          <Input
            prefix={<IconSearch className="!text-xl" />}
            showClear
            placeholder="You can search for products via product code"
            className="!rounded-[10px] !w-full  !h-12 !border-2 border-solid !border-[#ACCC8B] !bg-white"
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
                <button className="rounded-md bg-[#74A65D] hover:bg-[#44703D] w-48 lg:w-48 font-bold text-white mt-5 py-2">
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
              <div className="grid-cols-1 gap-2 md:grid-cols-2 grid">
                {currentOrdersData.map((order) => (
                  <div
                    key={order.orderId}
                    className="w-full py-6 px-4 rounded-lg border shadow-md"
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
                    <div className="mt-2 h-28">
                      <p>
                        Ship Name: <span>{order.shipName}</span>
                      </p>
                      <p>Ship Phone: {order.shipPhoneNumber}</p>

                      <p>Ship Address: {order.shipAddress}</p>
                      <p>Ship Email: {order.shipEmail}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="font-semibold">
                          Total Price: {formatCurrency(order.totalPriceOfOrder)}
                        </p>
                      </div>
                      <Link
                        href={`/customerPage/order-history/order-details/${order.id}`}
                      >
                        <button className="w-fit p-2 font-semibold bg-[#74A65D] text-white hover:bg-[#44703D] rounded-lg">
                          View Detail
                        </button>
                      </Link>
                    </div>
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
export default withAuth(OrderHistory, "");

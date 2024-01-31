"use client";

// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Pagination } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { Empty } from "@douyinfe/semi-ui";
import {
  IllustrationConstruction,
  IllustrationSuccess,
  IllustrationFailure,
  IllustrationNoAccess,
  IllustrationNoContent,
  IllustrationNotFound,
  IllustrationNoResult,
} from "@douyinfe/semi-illustrations";

/* The following is available after version 1.13.0 */
import {
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationConstructionDark,
  IllustrationSuccessDark,
  IllustrationFailureDark,
  IllustrationNoAccessDark,
  IllustrationNoContentDark,
  IllustrationNotFoundDark,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const ordersPerPage = 3;
  const bearerToken = Cookies.get("token");
  const getOrdersList = async (userId) => {
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Orders/GetBillHistory/${userId}`, // Include userId in the API endpoint
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
  const emptyStyle = {
    padding: 30,
  };
  const getOrderStatusLabel = (status) => {
    switch (status) {
      case OrderStatus.InProgress:
        return { label: "InProgress", colorClass: "text-yellow-500" };
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
      getOrdersList(userId);
    } else {
      // Handle the case when userId is not available (e.g., user not authenticated)
      console.error("UserId not found in cookies");
    }
  }, []);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  const currentOrdersData = orders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 rounded-lg border">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Order History</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>
        {loading ? (
          <p className="items-center">Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              {data === false ? (
                <Empty
                  image={
                    <IllustrationNoResult style={{ width: 150, height: 150 }} />
                  }
                  darkModeImage={
                    <IllustrationNoResultDark
                      style={{ width: 150, height: 150 }}
                    />
                  }
                  description={"No search results"}
                  style={emptyStyle}
                />
              ) : null}

              {currentOrdersData.map((order) => (
                <div
                  key={order.orderId}
                  className="w-2/3 py-4 px-2 rounded-lg border shadow-lg my-2"
                >
                  <div className="flex justify-between ">
                    <p className="font-semibold">Đơn hàng: {order.orderCode}</p>
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
                      <p>Ship Address: {order.address}</p>
                      <p>Ship Email: {order.shippedEmail}</p>
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
        )}
        <div className="flex justify-center my-4">
          <Pagination
            total={totalPages * 10}
            currentPage={page}
            onPageChange={onPageChange}
          ></Pagination>
        </div>
      </div>
    </>
  );
};
export default OrderHistory;

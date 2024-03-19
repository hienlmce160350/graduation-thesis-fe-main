"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@douyinfe/semi-ui";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../../context/withAuth";

const OrderDetail = () => {
  const [dataSource, setData] = useState([]);
  const [page, setPage] = useState(1);
  const ProductsPerPage = 10;
  const orderId = useParams().id;
  const bearerToken = Cookies.get("token");
  const getData = async () => {
    try {
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Orders/GetBillDetails/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
        setData(data); // Cập nhật dataSource với dữ liệu từ API
      } else {
        console.error("Failed to fetch data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData(); // Gọi hàm getData khi component được render
  }, []); // Chỉ gọi một lần sau khi component được render
  const totalPages = Math.ceil(dataSource.length / ProductsPerPage);

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = dataSource.slice(
    (page - 1) * ProductsPerPage,
    page * ProductsPerPage
  );
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/customerPage/order-history/order-list">
              My Order
            </Breadcrumb.Item>
            <Breadcrumb.Item noLink={true}>{orderId}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Order Detail</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>
        <div className="flex mt-4 m-2">
          <Link href="/customerPage/order-history/order-list">
            <button className="w-40 h-auto font-medium bg-[#74A65D] text-white hover:bg-[#44703D] rounded-lg">
              Back to Orders
            </button>
          </Link>
        </div>
        <div className="grid-cols-1 md:grid-cols-2 grid md:gap-1">
          {currentPageData.map((item, index) => (
            <div
              key={index}
              className="flex items-center mb-6 p-4 border rounded-md"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.imagePath}
                  alt={item.productName}
                  className="w-16 h-16 object-cover"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold mb-2">
                  {item.productName}
                </h2>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}{" "}
        </div>
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
export default withAuth(OrderDetail, "");

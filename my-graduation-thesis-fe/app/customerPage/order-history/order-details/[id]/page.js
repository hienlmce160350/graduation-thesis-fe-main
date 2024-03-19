"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@douyinfe/semi-ui";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Breadcrumb, Modal, Button } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../../context/withAuth";

const OrderDetail = () => {
  const [dataSource, setData] = useState([]);
  const [page, setPage] = useState(1);
  const ProductsPerPage = 10;
  const orderId = useParams().id;
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
  const getData = async () => {
    try {
      const response = await fetch(
        `https://erscustomer.azurewebsites.net/api/Orders/GetBillDetails/${orderId}`,
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
        <div className="flex mt-4 m-2 justify-between">
          <Link href="/customerPage/order-history/order-list">
            <button className="w-40 py-2 font-medium bg-[#74A65D] text-white hover:bg-[#44703D] rounded-md">
              Back to Orders
            </button>
          </Link>
          <button
            className="w-fit px-2 py-2 rounded-md border border-red-500 text-red-500 font-light"
            onClick={showDialog}
          >
            Cancel Order
          </button>
          <Modal
            title={
              <div className="text-center w-full text-red-500">
                Cancel Order
              </div>
            }
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            closeOnEsc={true}
            okText={"Cancel Order"}
            cancelText={"Back"}
            okButtonProps={{
              style: {
                padding: "8px",
                background: "red",
              },
            }}
            footerFill={true}
          >
            <div className="w-full mb-[6px]">
              <p className="font-semibold">Reason: </p>
              <textarea
                name="reason"
                id="reason"
                placeholder="Give your reason here..."
                rows={6}
                cols={40}
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
              />
            </div>
          </Modal>
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

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination, Notification } from "@douyinfe/semi-ui";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Breadcrumb, Modal, Button } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../../context/withAuth";
import { Select } from "@douyinfe/semi-ui";

const OrderDetail = () => {
  const [dataSource, setData] = useState([]);
  const [page, setPage] = useState(1);
  const ProductsPerPage = 10;
  const orderId = useParams().id;
  const bearerToken = Cookies.get("token");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showRefundButton, setShowRefundButton] = useState(false);
  const [reason, setReason] = useState("Ordered wrong product"); // Trạng thái lưu trữ lựa chọn của người dùng
  const [refundReason, setRefundReason] = useState("Seller sent wrong item");
  const [otherReason, setOtherReason] = useState(""); // Trạng thái lưu trữ nội dung nhập vào ô văn bản
  const [otherRefundReason, setOtherRefundReason] = useState("");
  const [status, setStatus] = useState("");
  const showDialog = () => {
    setVisible(true);
  };
  const showRefundDialog = () => {
    setVisible2(true);
  };
  const handleCancelOrder = () => {
    cancelOrder();
  };
  const handleRefundOrder = () => {
    refundOrder();
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleRefundCancel = () => {
    setVisible2(false);
  };
  const statusMap = {
    0: "InProgress",
    1: "Confirmed",
    2: "Shipping",
    3: "Success",
    4: "Canceled",
    5: "Refunded",
  };
  const cancelReasonList = [
    { value: "Ordered wrong product", label: "Ordered wrong product" },
    { value: "Duplicate orders", label: "Duplicate orders" },
    { value: "Bought at the store", label: "Bought at the store" },
    { value: "Don't want to buy anymore", label: "Don't want to buy anymore" },
    { value: "Other Reason", label: "Other Reason" },
  ];
  const cancelRefundReasonList = [
    { value: "Seller sent wrong item", label: "Seller sent wrong item" },
    {
      value: "Product is different from description",
      label: "Product is different from description",
    },
    { value: "Missing quantity sent", label: "Missing quantity sent" },
    { value: "Expired product", label: "Expired product" },
    { value: "Other Reason", label: "Other Reason" },
  ];
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
        setStatus(statusMap[data.status]);
        if (data.status === 0) {
          setShowCancelButton(true);
        }
        if (data.status === 3) {
          setShowRefundButton(true);
        }

        console.log("data: ", data);
        setData(data.items); // Cập nhật dataSource với dữ liệu từ API
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
  // Xử lý khi người dùng thay đổi lý do
  const handleReasonChange = (value) => {
    setReason(value);
    if (value === "Other Reason") {
      setOtherReason(""); // Đặt nội dung ô nhập văn bản về rỗng khi chọn "Other Reason"
    }
  };
  const handleRefundReasonChange = (value) => {
    setRefundReason(value);
    if (value === "Other Reason") {
      setOtherRefundReason(""); // Đặt nội dung ô nhập văn bản về rỗng khi chọn "Other Reason"
    }
  };
  const cancelOrder = async () => {
    try {
      let cancelDescription = reason;
      if (reason === "Other Reason") {
        cancelDescription = otherReason;
      }
      const requestBody = {
        orderId: Number(orderId),
        cancelDescription: cancelDescription,
      };

      console.log("Cancel order request body:", requestBody);
      const response = await fetch(
        "https://erscus.azurewebsites.net/api/Orders/CancelOrderRequest",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        // const data = await response.json();
        Notification.success({
          title: "Success",
          content: "Cancel Order Successfully!",
          duration: 5,
          theme: "light",
        });
        setVisible(false);
        setShowCancelButton(false);
        // Xử lý dữ liệu trả về nếu cần
        console.log("Cancel Order successfully:");
      } else {
        // Xử lý lỗi nếu có
        console.error("Failed cancel order");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const refundOrder = async () => {
    try {
      let refundDescription = refundReason;
      if (refundReason === "Other Reason") {
        refundDescription = otherRefundReason;
      }
      const requestBody = {
        orderId: Number(orderId),
        cancelDescription: refundDescription,
      };

      console.log("Cancel order request body:", requestBody);
      const response = await fetch(
        "https://erscus.azurewebsites.net/api/Orders/RefundOrder",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        // const data = await response.json();
        Notification.success({
          title: "Success",
          content: "Refund Order Successfully!",
          duration: 5,
          theme: "light",
        });
        setVisible2(false);
        setShowRefundButton(false);
        // Xử lý dữ liệu trả về nếu cần
        console.log("Refund Order successfully:");
      } else {
        // Xử lý lỗi nếu có
        console.error("Failed refund order");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />}>
              <Link href="/customerPage/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link href="/customerPage/order-history/order-list">
                My Order
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item noLink={true}>{orderId}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-[#74A65D]">Order Detail</h1>
          <div className="h-1 w-32 mt-3 bg-[#74A65D]"></div>
        </div>
        <div className="justify-end">{status}</div>
        <div className="flex my-4 justify-between">
          <Link href="/customerPage/order-history/order-list">
            <button className="w-40 h-auto font-semibold bg-[#74A65D] text-white hover:bg-[#44703D] rounded-lg py-2">
              Back to Orders
            </button>
          </Link>
          {showCancelButton && (
            <button
              className="w-fit px-2 py-2 rounded-md border border-red-500 text-red-500 font-light"
              onClick={showDialog}
            >
              Cancel Order
            </button>
          )}
          <Modal
            title={
              <div className="text-center w-full text-red-500">
                Cancel Order
              </div>
            }
            visible={visible}
            onOk={handleCancelOrder}
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
            <div className="w-full">
              <div>
                <Select
                  className="p-2 text-xl"
                  style={{ width: "100%", height: 40 }}
                  optionList={cancelReasonList}
                  defaultValue="Ordered wrong product"
                  insetLabel={
                    <span
                      style={{
                        marginRight: 0,
                        marginLeft: 12,
                        color: "#74a65d",
                      }}
                    >
                      Reason
                    </span>
                  }
                  onChange={handleReasonChange} // Xử lý sự kiện khi người dùng thay đổi lý do
                  disabled={!!otherReason} // Vô hiệu hóa Select khi ô nhập văn bản được sử dụng
                ></Select>
              </div>

              {/* Hiển thị ô nhập văn bản nếu người dùng chọn "Other Reason" */}
              {reason === "Other Reason" && (
                <div>
                  <textarea
                    rows="6"
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)} // Cập nhật giá trị nhập vào ô văn bản
                    placeholder="Enter other reason" // Chú thích trong ô nhập văn bản
                    className="w-full mt-3 p-2 border rounded-md focus:!border-[#74a65d] focus-visible:!border-[#74a65d]"
                  ></textarea>
                </div>
              )}
            </div>
          </Modal>
          {showRefundButton && (
            <button
              className="w-fit px-2 py-2 rounded-md border border-red-500 text-red-500 font-light"
              onClick={showRefundDialog}
            >
              Refund Order
            </button>
          )}
          <Modal
            title={
              <div className="text-center w-full text-red-500">
                Refund Order
              </div>
            }
            visible={visible2}
            onOk={handleRefundOrder}
            onCancel={handleRefundCancel}
            closeOnEsc={true}
            okText={"Refund Order"}
            cancelText={"Back"}
            okButtonProps={{
              style: {
                padding: "8px",
                background: "red",
              },
            }}
            footerFill={true}
          >
            <div className="w-full">
              <div>
                <Select
                  className="p-2 text-xl"
                  style={{ width: "100%", height: 40 }}
                  optionList={cancelRefundReasonList}
                  defaultValue="Seller sent wrong item"
                  insetLabel={
                    <span
                      style={{
                        marginRight: 0,
                        marginLeft: 12,
                        color: "#74a65d",
                      }}
                    >
                      Reason
                    </span>
                  }
                  onChange={handleRefundReasonChange} // Xử lý sự kiện khi người dùng thay đổi lý do
                  disabled={!!otherRefundReason} // Vô hiệu hóa Select khi ô nhập văn bản được sử dụng
                ></Select>
              </div>

              {/* Hiển thị ô nhập văn bản nếu người dùng chọn "Other Reason" */}
              {refundReason === "Other Reason" && (
                <div>
                  <textarea
                    rows="6"
                    type="text"
                    value={otherRefundReason}
                    onChange={(e) => setOtherRefundReason(e.target.value)} // Cập nhật giá trị nhập vào ô văn bản
                    placeholder="Enter other reason" // Chú thích trong ô nhập văn bản
                    className="w-full mt-3 p-2 border rounded-md focus:!border-[#74a65d] focus-visible:!border-[#74a65d]"
                  ></textarea>
                </div>
              )}
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

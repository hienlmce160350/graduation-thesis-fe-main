"use client";
import styles from "./OrderStatusScreen.module.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Notification,
  Steps,
  Progress,
  Avatar,
  Table,
  Empty,
  Typography,
} from "@douyinfe/semi-ui";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Cookies from "js-cookie";
import { Select, Dropdown, Modal } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../../context/withAuth";
import Link from "next/link";
import { HiExclamationCircle } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { formatCurrency } from "@/libs/commonFunction";

const OrderEdit = () => {
  const orderId = useParams().id;
  const [data, setOrderData] = useState([]);
  const [orderDetail, setOrderDetailData] = useState([]);
  const [reason, setReason] = useState("Ordered wrong product"); // Trạng thái lưu trữ lựa chọn của người dùng
  const [otherReason, setOtherReason] = useState(""); // Trạng thái lưu trữ nội dung nhập vào ô văn bản

  // Handle show/hide change status
  const [visibleDropdownCancel, setVisibleDropownCancel] = useState(false);
  const [visibleDropdownConfirmed, setVisibleDropownConfirmed] =
    useState(false);
  const [visibleDropdownShipping, setVisibleDropownShipping] = useState(false);
  const [visibleDropdownSuccess, setVisibleDropownSuccess] = useState(false);

  // End Handle show/hide change status

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Order Change Status could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Order Change Status Successfully.",
    duration: 3,
    theme: "light",
  };

  let confirmErrorMess = {
    title: "Error",
    content:
      "The number of products in stock at the store is not enough to meet orders.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Modal for Confirm
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const showDialogConfirm = () => {
    setVisibleConfirm(true);
  };

  const handleOkConfirm = async () => {
    const bearerToken = Cookies.get("token");
    fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/ConfirmOrder/${orderId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          setVisibleConfirm(false);
          fetchOrderData();
          Notification.success(successMess);
        } else {
          // Failure logic
          if (data.message == "Order confirm failed!") {
            Notification.error(confirmErrorMess);
            setVisibleConfirm(false);
          } else {
            console.error("Failed to confirm order");
            Notification.error(errorMess);
            setVisibleConfirm(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setVisibleConfirm(false);
        // Handle errors
      });
  };

  const handleCancelConfirm = () => {
    setVisibleConfirm(false);
    console.log("Cancel button clicked");
  };
  // End Modal for confirm

  // Modal for Shipping
  const [visibleShipping, setVisibleShipping] = useState(false);
  const showDialogShipping = () => {
    setVisibleShipping(true);
  };

  const handleOkShipping = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/OrderShippping/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
        setVisibleShipping(false);
        fetchOrderData();
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to shipping order");
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisibleShipping(false);
    }
  };
  const handleCancelShipping = () => {
    setVisibleShipping(false);
  };
  // End Modal for Shipping

  // Modal for Success
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showDialogSuccess = () => {
    setVisibleSuccess(true);
  };

  const handleOkSuccess = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/OrderSuccess/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
        setVisibleSuccess(false);
        fetchOrderData();
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to success order");
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisibleSuccess(false);
    }
  };
  const handleCancelSuccess = () => {
    setVisibleSuccess(false);
  };
  // End Modal for Shipping

  // Modal for Cancel
  const handleReasonChange = (value) => {
    setReason(value);
    if (value === "Other Reason") {
      setOtherReason(""); // Đặt nội dung ô nhập văn bản về rỗng khi chọn "Other Reason"
    }
  };

  const cancelReasonList = [
    { value: "Ordered wrong product", label: "Ordered wrong product" },
    { value: "Duplicate orders", label: "Duplicate orders" },
    { value: "Bought at the store", label: "Bought at the store" },
    { value: "Don't want to buy anymore", label: "Don't want to buy anymore" },
    { value: "Other Reason", label: "Other Reason" },
  ];

  const [visibleCancel, setVisibleCancel] = useState(false);
  const showDialogCancel = () => {
    setVisibleCancel(true);
  };

  const handleOkCancel = async () => {
    try {
      let cancelDescription = reason;
      if (reason === "Other Reason") {
        cancelDescription = otherReason;
      }
      const requestBody = {
        orderId: Number(orderId),
        cancelDescription: cancelDescription,
      };
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/CancelOrderRequest`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
        setVisibleCancel(false);
        fetchOrderData();
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to success order");
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisibleCancel(false);
    }
  };
  const handleCancelCancel = () => {
    setVisibleCancel(false);
  };
  // End Modal for Cancel

  // Load API Detail User

  const fetchOrderData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOrderData(data);
        if (data.status == 4) {
          setVisibleDropownCancel(true);
          setVisibleDropownConfirmed(true);
          setVisibleDropownShipping(true);
          setVisibleDropownSuccess(true);
        } else if (data.status == 5) {
          setVisibleDropownCancel(true);
          setVisibleDropownConfirmed(true);
          setVisibleDropownShipping(true);
          setVisibleDropownSuccess(true);
        } else if (data.status == 3) {
          setVisibleDropownCancel(true);
          setVisibleDropownConfirmed(true);
          setVisibleDropownShipping(true);
          setVisibleDropownSuccess(true);
        } else if (data.status == 1) {
          setVisibleDropownCancel(true);
          setVisibleDropownConfirmed(true);
          setVisibleDropownSuccess(true);
          setVisibleDropownShipping(false);
        } else if (data.status == 2) {
          setVisibleDropownCancel(true);
          setVisibleDropownConfirmed(true);
          setVisibleDropownShipping(true);
          setVisibleDropownSuccess(false);
        } else if (data.status == 0) {
          setVisibleDropownConfirmed(false);
          setVisibleDropownShipping(true);
          setVisibleDropownSuccess(true);
        }
      } else {
        notification.error({
          message: "Failed to fetch order data",
        });
      }
    } catch (error) {
      console.error("Error fetching order data", error);
    }
  };
  // End load API Detail User

  // Load API Detail Order

  const fetchOrderDetailData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/GetOrderDetail/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      if (response.ok) {
        setOrderDetailData(data.items);
        return data;
      } else {
        console.log("Failed to fetch order data");
      }
    } catch (error) {
      console.error("Error fetching order data", error);
    }
  };
  // End load API Detail Order

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

  let dataStep = data.status | 0;

  dataStep = dataStep + 1;
  if (data.status == 4) {
    dataStep = 0;
  } else if (data.status == 5) {
    dataStep = 4;
  }

  let statusStep = "";
  if (data.status == 4) {
    statusStep = "error";
  } else if (data.status == 5) {
    statusStep = "error";
  } else if (data.status == 3) {
    statusStep = "finish";
  } else {
    statusStep = "process";
  }

  // table
  const { Text } = Typography;
  const columns = [
    {
      title: "Order Title",
      dataIndex: "productName",
      width: 400,
      render: (text, record, index) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={record.imagePath}
              style={{ marginRight: 12 }}
            ></Avatar>
            {/* The width calculation method is the cell setting width minus the non-text content width */}
            <Text
              heading={5}
              ellipsis={{ showTooltip: true }}
              style={{ width: "calc(400px - 76px)" }}
            >
              {text}
            </Text>
          </span>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ];

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );
  // end table

  const totalPrice = orderDetail.reduce((sum, order) => sum + order.price, 0);

  const discount = Math.round(
    ((totalPrice - data.totalPriceOfOrder) / totalPrice) * 100
  ).toFixed(0);
  useEffect(() => {
    fetchOrderData();
    fetchOrderDetailData();
  }, []);
  return (
    <LocaleProvider locale={en_US}>
      <Modal
        title={
          <div className="text-center w-full text-red-500">Cancel Order</div>
        }
        visible={visibleCancel}
        onOk={handleOkCancel}
        onCancel={handleCancelCancel}
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
      <div className="mx-auto w-full mt-3 h-fit mb-3">
        <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
          <div className="contain grid grid-cols-3 md:grid-cols-2 gap-6 m-auto mt-2 mb-10">
            <div>
              <h1 className="text-3xl font-semibold">Order {data.id}</h1>

              {data.status === 4 ? (
                <>
                  <div className="hidden md:block border-l-2 border-[#DE303F] pl-2 my-2">
                    <div className="flex gap-2">
                      <HiExclamationCircle className="text-[#DE303F] text-2xl" />
                      <h5 className="text-base font-semibold text-[#DE303F]">
                        Cancel reason
                      </h5>
                    </div>
                    <p className="font-semibold text-sm text-[#a7a2a2]">
                      {data.cancelDescription}
                    </p>
                  </div>
                </>
              ) : data.status === 5 ? (
                <>
                  <div className="hidden md:block border-l-2 border-[#DE303F] pl-2 my-2">
                    <div className="flex gap-2">
                      <HiExclamationCircle className="text-[#DE303F] text-2xl" />
                      <h5 className="text-base font-semibold text-[#DE303F]">
                        Refund reason
                      </h5>
                    </div>
                    <p className="font-semibold text-sm text-[#a7a2a2]">
                      {data.refundDescription}
                    </p>
                  </div>
                </>
              ) : (
                <div className="hidden md:block">
                  <div className="pb-2 pt-1 w-fit border-t border-solid">
                    <h5 className="text-base font-semibold">Payment Status</h5>
                    <div className="font-semibold text-sm">
                      {data.orderMethod == 1 ? (
                        <div className="bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2">
                          Paid
                        </div>
                      ) : data.orderMethod == 2 ? (
                        <div className="bg-[#f0f6ff] text-[#2463eb] border border-[#2463eb] w-fit rounded-md px-2">
                          Pending
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-fit border-t border-solid">
                    <h5 className="text-base font-semibold">
                      Expected Completion
                    </h5>
                    <p className="font-semibold text-sm">
                      {formatDate(data.orderDate)}
                    </p>
                    <p className="font-extralight text-sm">5 days</p>
                  </div>
                </div>
              )}

              <div className="md:hidden">
                <p className="font-normal text-base">
                  Ship Address: {data.shipAddress}
                </p>
                <p className="font-normal text-base">
                  Ship Phone Number: {data.shipPhoneNumber}
                </p>

                <div className="flex justify-start">
                  <Dropdown
                    trigger={"click"}
                    position={"bottomLeft"}
                    render={
                      <Dropdown.Menu>
                        <>
                          <Dropdown.Item
                            onClick={() => showDialogCancel()}
                            disabled={visibleDropdownCancel}
                          >
                            Cancel Order
                          </Dropdown.Item>
                        </>

                        <>
                          <Dropdown.Item
                            onClick={() => showDialogConfirm()}
                            disabled={visibleDropdownConfirmed}
                          >
                            Confirm Order
                          </Dropdown.Item>
                          <Modal
                            title="Confirm Order"
                            visible={visibleConfirm}
                            onOk={handleOkConfirm}
                            onCancel={handleCancelConfirm}
                            closeOnEsc={true}
                            footerFill={true}
                          >
                            <div className="border-b border-t border-solid border-[#cccccc] p-4">
                              Confirm order {data.orderCode}
                            </div>
                          </Modal>
                        </>

                        <>
                          <Dropdown.Item
                            onClick={() => showDialogShipping()}
                            disabled={visibleDropdownShipping}
                          >
                            Shipping Order
                          </Dropdown.Item>
                          <Modal
                            title="Shipping Order"
                            visible={visibleShipping}
                            onOk={handleOkShipping}
                            onCancel={handleCancelShipping}
                            closeOnEsc={true}
                            footerFill={true}
                          >
                            <div className="border-b border-t border-solid border-[#cccccc] p-4">
                              Shipping order {data.orderCode}
                            </div>
                          </Modal>
                        </>

                        <>
                          <Dropdown.Item
                            onClick={() => showDialogSuccess()}
                            disabled={visibleDropdownSuccess}
                          >
                            Delivered Successfully
                          </Dropdown.Item>
                          <Modal
                            title="Confirm Order successfully"
                            visible={visibleSuccess}
                            onOk={handleOkSuccess}
                            onCancel={handleCancelSuccess}
                            closeOnEsc={true}
                            footerFill={true}
                          >
                            <div className="border-b border-t border-solid border-[#cccccc] p-4">
                              Confirm Order {data.orderCode} successfully
                            </div>
                          </Modal>
                        </>
                      </Dropdown.Menu>
                    }
                  >
                    <div className="mt-2 border flex gap-2 items-center bg-[#283238] bg-opacity-5 w-fit p-2 hover:bg-opacity-10 cursor-pointer">
                      Operation
                      <IoIosArrowDown className="cursor-pointer" />
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* <div>
            <h5 className="text-base font-semibold">Complete</h5>
            <h2 className="text-2xl font-semibold">{percent}%</h2>
            <Progress percent={percent} aria-label="disk usage" />
          </div> */}

            <div className="text-right hidden md:block">
              <div className="flex justify-end">
                <Dropdown
                  trigger={"click"}
                  position={"bottomRight"}
                  render={
                    <Dropdown.Menu>
                      <>
                        <Dropdown.Item
                          onClick={() => showDialogCancel()}
                          disabled={visibleDropdownCancel}
                        >
                          Cancel Order
                        </Dropdown.Item>
                      </>

                      <>
                        <Dropdown.Item
                          onClick={() => showDialogConfirm()}
                          disabled={visibleDropdownConfirmed}
                        >
                          Confirm Order
                        </Dropdown.Item>
                        <Modal
                          title="Confirm Order"
                          visible={visibleConfirm}
                          onOk={handleOkConfirm}
                          onCancel={handleCancelConfirm}
                          closeOnEsc={true}
                          footerFill={true}
                        >
                          <div className="border-b border-t border-solid border-[#cccccc] p-4">
                            Confirm order {data.orderCode}
                          </div>
                        </Modal>
                      </>

                      <>
                        <Dropdown.Item
                          onClick={() => showDialogShipping()}
                          disabled={visibleDropdownShipping}
                        >
                          Shipping Order
                        </Dropdown.Item>
                        <Modal
                          title="Shipping Order"
                          visible={visibleShipping}
                          onOk={handleOkShipping}
                          onCancel={handleCancelShipping}
                          closeOnEsc={true}
                          footerFill={true}
                        >
                          <div className="border-b border-t border-solid border-[#cccccc] p-4">
                            Shipping order {data.orderCode}
                          </div>
                        </Modal>
                      </>

                      <>
                        <Dropdown.Item
                          onClick={() => showDialogSuccess()}
                          disabled={visibleDropdownSuccess}
                        >
                          Delivered Successfully
                        </Dropdown.Item>
                        <Modal
                          title="Confirm Order successfully"
                          visible={visibleSuccess}
                          onOk={handleOkSuccess}
                          onCancel={handleCancelSuccess}
                          closeOnEsc={true}
                          footerFill={true}
                        >
                          <div className="border-b border-t border-solid border-[#cccccc] p-4">
                            Confirm Order {data.orderCode} successfully
                          </div>
                        </Modal>
                      </>
                    </Dropdown.Menu>
                  }
                >
                  <div className="mb-2 border flex gap-2 justify-end items-center bg-[#283238] bg-opacity-5 w-fit p-2 hover:bg-opacity-10 cursor-pointer">
                    Operation
                    <IoIosArrowDown className="cursor-pointer" />
                  </div>
                </Dropdown>
              </div>

              <p className="font-normal text-base">
                Ship Address: {data.shipAddress}
              </p>
              <p className="font-normal text-base">
                Ship Phone Number: {data.shipPhoneNumber}
              </p>
            </div>

            <div className="text-justify block md:hidden">
              {data.status == 4 ? (
                <>
                  <div className="border-x-2 border-[#DE303F] px-2 text-center">
                    <div className="flex gap-2">
                      <HiExclamationCircle className="text-[#DE303F] text-2xl" />
                      <h5 className="text-base font-semibold text-[#DE303F]">
                        Cancel reason
                      </h5>
                    </div>
                    <p className="font-semibold text-sm text-[#a7a2a2]">
                      {data.cancelDescription}
                    </p>
                  </div>
                </>
              ) : data.status === 5 ? (
                <>
                  <div className="border-x-2 border-[#DE303F] px-2 text-center">
                    <div className="flex gap-2">
                      <HiExclamationCircle className="text-[#DE303F] text-2xl" />
                      <h5 className="text-base font-semibold text-[#DE303F]">
                        Refund reason
                      </h5>
                    </div>

                    <p className="font-semibold text-sm text-[#a7a2a2]">
                      {data.refundDescription}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-x-2 px-2 text-center">
                    <div className="border-b border-solid pb-2">
                      <h5 className="text-base font-semibold">
                        Payment Status
                      </h5>
                      <div className="font-semibold text-sm flex justify-center">
                        {data.orderMethod == 1 ? (
                          <div className="bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2">
                            Paid
                          </div>
                        ) : (
                          <div className="bg-[#f0f6ff] text-[#2463eb] border border-[#2463eb] w-fit rounded-md px-2">
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    <h5 className="text-base font-semibold">
                      Expected Completion
                    </h5>
                    <p className="font-semibold text-sm">
                      {formatDate(data.orderDate)}
                    </p>
                    <p className="font-extralight text-sm">5 days</p>
                  </div>
                </>
              )}
            </div>

            <div className="w-full md:hidden ml-6">
              <Steps
                direction="vertical"
                type="basic"
                status={statusStep}
                current={dataStep}
                onChange={(i) => console.log(i)}
              >
                {data.status == 4 ? <Steps.Step title="Canceled" /> : null}
                <Steps.Step title="In Progress" />
                <Steps.Step title="Confirmed" />
                <Steps.Step title="Shipping" />
                <Steps.Step title="Success" />
                {data.status == 5 ? <Steps.Step title="Refund" /> : null}
              </Steps>
            </div>
          </div>
          <div className={styles.form}>
            <div className="w-full hidden md:block">
              <Steps
                type="basic"
                status={statusStep}
                current={dataStep}
                onChange={(i) => console.log(i)}
              >
                {data.status == 4 ? <Steps.Step title="Canceled" /> : null}
                <Steps.Step title="In Progress" />
                <Steps.Step title="Confirmed" />
                <Steps.Step title="Shipping" />
                <Steps.Step title="Success" />
                {data.status == 5 ? <Steps.Step title="Refund" /> : null}
              </Steps>
            </div>

            <div className="mt-4 w-full">
              <h3 className="text-lg font-bold">Order Summary</h3>

              <div className="mt-2">
                <Table
                  style={{ minHeight: "fit-content" }}
                  columns={columns}
                  dataSource={orderDetail}
                  pagination={false}
                  empty={empty}
                />

                <div className="w-full flex mt-2 justify-end">
                  <div className="w-1/2 p-4 flex justify-end text-lg">
                    <div className="w-1/2 font-thin">
                      <p>Price: </p>
                      <p>Discount: </p>
                      <p className="font-medium">Total Price: </p>
                    </div>

                    <div className="w-1/2 font-thin text-right md:text-center">
                      <p>{formatCurrency(totalPrice)} đ</p>
                      <p>{discount} %</p>
                      <p className="font-medium">
                        {formatCurrency(data.totalPriceOfOrder)} đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contain grid grid-cols-1 md:grid-cols-2 gap-20 m-auto mt-4">
              <div className={styles.details}></div>
            </div>
            <div className="flex justify-start gap-4 mt-4 mb-2">
              <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
                <Link href={`/managerPage/order/order-list`}>
                  <p className="text-xl font-bold">Back</p>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withAuth(OrderEdit, "manager");

"use client";
import styles from "./OrderStatusScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Descriptions,
  Tag,
} from "@douyinfe/semi-ui";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Cookies from "js-cookie";
import { Select } from "@douyinfe/semi-ui";

const UserAssign = () => {
  const orderId = useParams().id;
  const [data, setUserData] = useState([]);
  const [orderDetail, setOrderDetailData] = useState([]);

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
  // End show notification

  // Load API Detail User

  const fetchOrderData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        if (data.status == 0) {
          formik.setFieldValue("status", "In Progress");
        } else if (data.status == 1) {
          formik.setFieldValue("status", "Confirmed");
        } else if (data.status == 2) {
          formik.setFieldValue("status", "Shipping");
        } else if (data.status == 3) {
          formik.setFieldValue("status", "Success");
        } else if (data.status == 4) {
          formik.setFieldValue("status", "Canceled");
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
        `https://ersmanagerapi.azurewebsites.net/api/Orders/GetOrderDetailPagingRequest?OrderId=${orderId}&PageIndex=1&PageSize=20`,
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
        console.log("Fetch order detail data successfully");
        let orderDetail = data.items;
        return orderDetail;
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

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      orderId: "",
      status: "",
    },
    onSubmit: async (values) => {
      // call API Assign Role
      try {
        const bearerToken = Cookies.get("token");
        const headers = new Headers();
        values.orderId = Number(orderId);
        values.status = Number(values.status);
        console.log("Order Status: " + JSON.stringify(values));
        headers.append("Authorization", `Bearer ${bearerToken}`); // Thêm token nếu cần
        headers.append("Content-Type", "application/json");
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Orders/${Number(
            orderId
          )}`,
          {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          Notification.success(successMess);
          fetchOrderData();
        } else {
          console.log("Failed to change status:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error changing status:", error);
      }
    },
  });

  const totalSteps = 5;
  const currentStep = data.status || 0; // Use 0 if data.status is undefined or null

  // Tính toán giá trị phần trăm
  const percent = ((currentStep + 1) / totalSteps) * 100;

  // Assuming orderDetailData is an array of items fetched from fetchOrderDetailData
  // const orderDetailItems = orderDetail.map((item, index) => (
  //   <div
  //     key={index}
  //     className="flex justify-between bg-[#cccccc1f] items-center p-4"
  //   >
  //     <Avatar shape="square" style={{ margin: 4 }} alt="User">
  //       {item.imagePath}{" "}
  //       {/* Replace with the actual property from your item object */}
  //     </Avatar>
  //     <h4>{item.productName}</h4>{" "}
  //     {/* Replace with the actual property from your item object */}
  //     <p>{item.quantity}</p>{" "}
  //     {/* Replace with the actual property from your item object */}
  //     <p>{item.price}$</p>{" "}
  //     {/* Replace with the actual property from your item object */}
  //   </div>
  // ));

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

  // description
  const dataDes = [
    { key: "Actual Users", value: "1,480,000" },
    { key: "7-day Rentention", value: "98%" },
    { key: "Security Level", value: "III" },
    { key: "Category Tag", value: <Tag style={{ margin: 0 }}>E-commerce</Tag> },
    { key: "Authorized State", value: "Unauthorized" },
  ];
  // end description

  useEffect(() => {
    fetchOrderData();
    fetchOrderDetailData();
  }, []);
  return (
    <div className="m-auto w-full mb-10">
      <div className={styles.table}>
        <div className="contain grid grid-cols-1 lg:grid-cols-3 gap-20 m-auto mt-2 mb-10">
          <div>
            <h1 className="text-3xl font-semibold">Order {data.id}</h1>
            <p className="font-normal text-base">
              Ship Address: {data.shipAddress}
            </p>
            <p className="font-normal text-base">
              Ship Phone Number: {data.shipPhoneNumber}
            </p>
            <div className="flex flex-col gap-3 justify-start items-start">
                  <b className={styles.email}>Status</b>

                  <Select
                    name="status"
                    id="status"
                    className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                    style={{ width: "fit-content", height: 41 }}
                    placeholder="Change Status"
                    onChange={(value) => formik.setFieldValue("status", value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    <Select.Option value="0">In Progress</Select.Option>
                    <Select.Option value="1">Confirmed</Select.Option>
                    <Select.Option value="2">Shipping</Select.Option>
                    <Select.Option value="3">Success</Select.Option>
                    <Select.Option value="4">Canceled</Select.Option>
                  </Select>
                </div>
          </div>

          <div>
            <h5 className="text-base font-semibold">Complete</h5>
            <h2 className="text-2xl font-semibold">{percent}%</h2>
            <Progress percent={percent} aria-label="disk usage" />
          </div>

          <div className="text-right">
            <h5 className="text-base font-semibold">Expected Completion</h5>
            <p className="font-semibold text-sm">
              {formatDate(data.orderDate)}
            </p>
            <p className="font-extralight text-sm">5 days</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <Steps
            type="basic"
            current={data.status}
            onChange={(i) => console.log(i)}
            className="w-full !text-red"
          >
            <Steps.Step title="In Progress" />
            <Steps.Step title="Confirmed" />
            <Steps.Step title="Shipping" />
            <Steps.Step title="Success" />
            <Steps.Step title="Canceled" />
          </Steps>

          <div className="mt-4 w-full">
            <h3 className="text-lg font-bold">Order Summary</h3>

            <div className="mt-2">
              {/* <div className="flex justify-between bg-[#cccccc1f] items-center p-4 mb-3">
                <h2>Product Image</h2>
                <h2>Product Name</h2>
                <h2>Quantity</h2>
                <h2>Price</h2>
              </div>

              {orderDetailItems} */}

              <Table
                style={{ minHeight: "fit-content" }}
                columns={columns}
                dataSource={orderDetail}
                pagination={false}
                empty={empty}
              />

              <div className="w-full flex mt-2 justify-between">
                <div className="flex flex-col gap-3 justify-center items-center w-1/2">
                  
                </div>

                <div className="w-1/2 p-4 flex justify-between text-lg">
                  <div className="w-1/2 font-thin">
                    <p>Price: </p>
                    <p>Discount: </p>
                    <p className="font-medium">Total Price: </p>
                  </div>

                  <div className="w-1/2 font-thin">
                    <p>100$ </p>
                    <p>20$</p>
                    <p className="font-medium">80$</p>
                  </div>
                </div>
                {/* <Descriptions data={dataDes} className="w-fit bg-[#cccccc1f] p-4"/> */}

                {/* <p className="text-lg">Total Price: 1000$</p>
                 <p className="text-lg">Discount: 200$</p>
                 <p className="text-lg">Total Price Final: 1000$</p> */}
              </div>
            </div>
          </div>
          <div className="contain grid grid-cols-1 lg:grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}></div>
          </div>
          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="w-[100px] py-1 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
              type="submit"
            >
              <span className="text-xl font-bold">Save</span>
            </button>
            <button className="border-solid border border-[#ccc] w-[100px] py-1 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
              <a
                className="text-xl font-bold"
                href="/adminPage/order/order-list"
              >
                Cancel
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAssign;

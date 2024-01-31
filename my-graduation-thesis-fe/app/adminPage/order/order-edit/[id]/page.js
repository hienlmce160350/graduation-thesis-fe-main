"use client";
import styles from "./OrderStatusScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification, Steps, Progress } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select } from "@douyinfe/semi-ui";

const UserAssign = () => {
  const orderId = useParams().id;
  const [data, setUserData] = useState([]);

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
          router.push("/adminPage/order/order-list");
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

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
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
          </div>

          <div>
            <h5 className="text-base font-semibold">Complete</h5>
            <h2 className="text-2xl font-semibold">{percent}%</h2>
            <Progress
              percent={percent}
              stroke="var(--semi-color-danger)"
              aria-label="disk usage"
            />
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
            className="w-full"
            style={{ color: "#4BB543" }}
          >
            <Steps.Step title="In Progress" />
            <Steps.Step title="Confirmed" />
            <Steps.Step title="Shipping" />
            <Steps.Step title="Success" />
            <Steps.Step title="Canceled" />
          </Steps>
          <div className="contain grid grid-cols-1 lg:grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}>
              <div className="flex flex-col gap-3">
                <b className={styles.email}>
                  Choose status that you want to change this order:
                </b>

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

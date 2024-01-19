"use client";
import styles from "./OrderStatusScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { Tag, Space } from "@douyinfe/semi-ui";

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

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      OrderId: "",
      Status: "",
    },
    onSubmit: async (values) => {
      // call API Assign Role
      try {
        const form = new FormData();
        form.append("OrderId", parseInt(orderId, 10));
        form.append("Status", parseInt(values.Status, 10));

        console.log("Form data: " + form);

        console.log("Form data 2:");
        for (var pair of form.entries()) {
          console.log(pair[0] + ", " + typeof pair[1]);
        }

        const bearerToken = Cookies.get("token");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${bearerToken}`); // Thêm token nếu cần
        headers.append("Content-Type", "multipart/form-data");
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Orders/${Number(
            orderId
          )}`,
          {
            method: "PUT",
            headers: headers,
            body: form,
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Order change status successfully. Response:", data);
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

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Change Order Status
        </h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-1 lg:grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Status of this order: </b>{" "}
                {data.status === 0
                  ? "In Progress"
                  : data.status === 1
                  ? "Confirmed"
                  : data.status === 2
                  ? "Shipping"
                  : data.status === 3
                  ? "Success"
                  : data.status === 4
                  ? "Canceled"
                  : "Unknown"}
              </div>
            </div>

            <div className={styles.details}>
              <div className="flex flex-col gap-3">
                <b className={styles.email}>
                  Choose status that you want to change this order:
                </b>

                <Select
                  name="Status"
                  id="Status"
                  className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                  style={{ width: 140, height: 41 }}
                  placeholder="Change Status"
                  onChange={(value) => formik.setFieldValue("Status", value)}
                  onBlur={formik.handleBlur}
                  value={formik.values.Status}
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

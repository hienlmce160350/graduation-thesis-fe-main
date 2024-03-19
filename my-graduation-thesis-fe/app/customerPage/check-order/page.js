"use client";

// Import necessary modules and components
import React, { useState } from "react";

/* The following is available after version 1.13.0 */
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBox } from "@douyinfe/semi-icons";

const CheckOrder = () => {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ids, setIds] = useState([]);

  let searchSuccessErrorMess = {
    title: "Success",
    content: "Search sucessfully",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };

  let searchFailedErrorMess = {
    title: "Error",
    content: "Order code not correct. Please try again!",
    duration: 3,
    theme: "light",
  };
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      orderCode: "",
    },
    validationSchema: Yup.object({
      orderCode: Yup.string().required("Order code can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const response = await fetch(
          `https://erscustomer.azurewebsites.net/api/Orders/GetByOrderCode/${values.orderCode}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );

        if (response.ok) {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Cookies.remove("orderCode");
          Cookies.set("orderCode", values.orderCode);

          const data = await response.json();
          // console.log("Data: " + JSON.stringify(data))
          // console.log("Data ID: " + data.id)
          // console.log("item ne: "+ data.items)
          if (data.items.length === 0) {
            Notification.error(searchFailedErrorMess);
          } else {
            // console.log("Search order successful. Response:", data);
            Notification.success(searchSuccessErrorMess);
            router.push("/customerPage/check-order/order-detail");
          }
        } else {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          //console.log("An error occurred:", response.status);
          Notification.error(searchFailedErrorMess);
        }
      } catch (error) {
        Notification.error(searchFailedErrorMess);
        console.error("An error occurred:", error);
      }
    },
  });

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconBox />} noLink={true}>
              Check Order
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-row max-w-7xl mx-auto items-center">
        <div className="w-1/2 h-1/2 mt-10">
          <img src="/staticImage/bg_co.png"></img>
        </div>

        <div className="max-w-md mx-4 bg-white rounded shadow-xl my-20 p-10 w-1/2 h-full">
          <form onSubmit={formik.handleSubmit}>
            <p className="px-1 py-5 font-semibold text-2xl text-center">
              Check up order information
            </p>
            <input
              type="text"
              name="orderCode"
              id="orderCode"
              placeholder="Enter Order Code"
              className="w-full border rounded-full px-3 py-2 mb-4"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.orderCode}
            />
            {formik.touched.orderCode && formik.errors.orderCode ? (
              <div className="text-sm text-red-600 dark:text-red-400 mb-2 ml-3">
                {formik.errors.orderCode}
              </div>
            ) : null}
            <button
              type="submit"
              className="w-full bg-[#69AD28] text-white font-bold py-2 px-4 rounded-full"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
  s;
};

export default CheckOrder;

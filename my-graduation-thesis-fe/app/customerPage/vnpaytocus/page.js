"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";

const VnpToCus = () => {
  const formCreateOrder = useFormik({
    initialValues: {
      userId: "",
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
      totalPriceOfOrder: 0,
      orderDetails: [],
      orderMethod: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      address: Yup.string().required("Address is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^0[1-9]\d{8,10}$/, "Phone is invalid")
        .required("Phone is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Submitting form with values:", values);
        values.userId = Cookies.get("userId");
        values.orderMethod = 1;
        const userId = Cookies.get("userId");
        if (!userId) {
          values.userId = "3f5b49c6-e455-48a2-be45-26423e92afbe";
        }
        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          clearCart();
          // Xử lý khi tạo đơn hàng thành công
        } else {
          // Xử lý khi có lỗi
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  });

  useEffect(() => {
    const storedData = JSON.parse(
      window.localStorage.getItem("orderFormData")
    ) || {
      userId: "",
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
      totalPriceOfOrder: 0,
      orderDetails: [],
      orderMethod: 0,
    };
    console.log(JSON.parse(window.localStorage.getItem("orderFormData")));
    formCreateOrder.setValues(storedData);
    formCreateOrder.submitForm();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="w-full">
          <img src="/staticImage/thankyou.png" />
        </div>
        <div className="bg-[#74a65d] flex flex-col items-center">
          <div className="text-white text-2xl py-6">Dear Our Customer,</div>
          <div className=" md:w-2/3 text-white text-2xl mx- text-center">
            Thank you for your recent order. We are pleased to confirm that we
            have received your order and it is currently being processed.
          </div>
          <div className="my-10">
            <Link
              className="font-light rounded-md bg-white text-gray-400 hover:text-[#74a65d] w-36 p-2"
              href={"/customerPage/order-history/orderlist"}
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VnpToCus;

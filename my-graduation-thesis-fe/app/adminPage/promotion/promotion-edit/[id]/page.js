"use client";
import styles from "./PromotionEditScreen.module.css";
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

const PromotionEdit = () => {
  const promotionId = useParams().id;
  const [data, setPromotionData] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Promotion editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Promotion Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail Blog

  const fetchPromotionData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Promotions/${promotionId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPromotionData(data);
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("fromDate", data.fromDate);
        formik.setFieldValue("toDate", data.toDate);
        formik.setFieldValue("discountPercent", data.discountPercent);
        formik.setFieldValue("name", data.name);
        formik.setFieldValue("description", data.description);
        if (data.status == 1) {
          formik.setFieldValue("status", "Active");
        } else {
          formik.setFieldValue("status", "Inactive");
        }
      } else {
        notification.error({
          message: "Failed to fetch promotion data",
        });
      }
    } catch (error) {
      console.error("Error fetching promotion data", error);
    }
  };
  // End load API Detail Blog
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      description: "",
      discountPercent: 0,
      fromDate: "",
      toDate: "",
      status: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Promotion Name is required"),
      description: Yup.string().required("Promotion Description is required"),
      discountPercent: Yup.number()
        .required("Discount Percent is required")
        .min(0, "Discount Percent must be greater than or equal to 0")
        .max(100, "Discount Percent must be less than or equal to 100"),
      fromDate: Yup.date()
        .required("From Date is required")
        .min(currentDate, "From Date must be after or equal to current Date"),
      toDate: Yup.date()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date must be after From Date"),
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        if (values.status != 1 && values.status != 0) {
          if (values.status === "Active") {
            values.status = Number(1);
          } else if (values.status === "Inactive") {
            values.status = Number(0);
          }
        } else if (values.status == 1 || values.status == 0) {
          values.status = Number(values.status);
        }

        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Promotions/${promotionId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          console.log(
            "Promotion information updated successfully. Response:",
            data
          );
          Notification.success(successMess);
          router.push("/adminPage/promotion/promotion-list");
        } else {
          console.log(
            "Failed to update promotion information:",
            response.status
          );
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating promotion information:", error);
      }
    },
  });

  useEffect(() => {
    fetchPromotionData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Edit Promotion
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Promotion Name</label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Promotion Name"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.name}
              </div>
            ) : null}

            <div>
              <label>
                Promotion Description
                <textarea
                  id="description"
                  name="description"
                  defaultValue="I really enjoyed biking yesterday!"
                  rows={6}
                  cols={40}
                  className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
              </label>
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.description}
              </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="">
                <p className="text-lg font-semibold mb-3 text-center">
                  General Info
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label>Discount Percent</label>
                    <input
                      name="discountPercent"
                      id="discountPercent"
                      type="number"
                      placeholder="100"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.discountPercent}
                    />
                  </div>
                  {formik.touched.discountPercent &&
                  formik.errors.discountPercent ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.discountPercent}
                    </div>
                  ) : null}

                  <div>
                    <label>From Date</label>
                    <input
                      name="fromDate"
                      id="fromDate"
                      type="datetime-local"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fromDate}
                    />
                  </div>
                  {formik.touched.fromDate && formik.errors.fromDate ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.fromDate}
                    </div>
                  ) : null}

                  <div>
                    <label>To Date</label>
                    <input
                      name="toDate"
                      id="toDate"
                      type="datetime-local"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.toDate}
                    />
                  </div>
                  {formik.touched.toDate && formik.errors.toDate ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.toDate}
                    </div>
                  ) : null}

                  <div>
                    <label>Status</label>
                    <Select
                      name="status"
                      id="status"
                      className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                      style={{ width: 140, height: 41 }}
                      placeholder="Active or Inactive"
                      onChange={(value) =>
                        formik.setFieldValue("status", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.status}
                    >
                      <Select.Option value="1">Active</Select.Option>
                      <Select.Option value="0">Inactive</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className=""></div>
            </div>

            <div className="flex justify-start gap-4 mt-4 mb-2">
              <button
                className="w-[154px] py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
                type="submit"
              >
                <span className="text-xl font-bold">Save</span>
              </button>
              <button className="border-solid border border-[#ccc] w-[154px] py-4 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
                <a
                  className="text-xl font-bold"
                  href="/adminPage/promotion/promotion-list"
                >
                  Cancel
                </a>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(PromotionEdit, "manager");

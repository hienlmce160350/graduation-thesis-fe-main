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
import { withAuth } from "../../../../../context/withAuth";
import Link from "next/link";

const PromotionEdit = () => {
  const promotionId = useParams().id;
  const [data, setPromotionData] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isCancelMode, setIsCancelMode] = useState(false);

  const [isSaveMode, setIsSaveMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsCancelMode(false);
  };

  const handleCancelClick = () => {
    setIsCancelMode(true);
    setIsEditMode(false);
    fetchPromotionData();
  };

  const handleSaveClick = () => {
    setIsSaveMode(true);
  };

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
        `https://ersmanager.azurewebsites.net/api/Promotions/${promotionId}`,
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
        if ((!isEditMode && !isCancelMode) || isSaveMode) {
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
            `https://ersmanager.azurewebsites.net/api/Promotions/${promotionId}`,
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
            Notification.success(successMess);
            router.push("/managerPage/promotion/promotion-list");
          } else {
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating promotion information:", error);
      }
    },
  });

  useEffect(() => {
    // Hàm để kiểm tra và ẩn các phần tử có style nhất định
    const hideElementsWithStyle = () => {
      // Lặp qua tất cả các phần tử trên trang
      document.querySelectorAll("*").forEach((child) => {
        // Kiểm tra xem phần tử có style nhất định không
        if (
          child.style.position === "fixed" &&
          (child.style.top === "10px" || child.style.top === "0px")
        ) {
          // Ẩn phần tử nếu có style nhất định
          console.log("Test");
          child.style.display = "none";
        }
      });
    };
    hideElementsWithStyle();
    fetchPromotionData();
  }, []);
  return (
    <>
      <div className="mx-auto w-full mt-3 h-fit mb-3">
        <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
          <h2 className="text-[32px] font-medium mb-3 text-center">
            {isEditMode ? "Update Promotion" : "Promotion Information"}
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
                  disabled={!isEditMode}
                />
              </div>
              {formik.touched.name && !isCancelMode && formik.errors.name ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.name}
                </div>
              ) : null}

              <div>
                <label>Promotion Description</label>
                <div className="flex">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    cols={40}
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
              {formik.touched.description &&
              !isCancelMode &&
              formik.errors.description ? (
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
                        disabled={!isEditMode}
                      />
                    </div>
                    {formik.touched.discountPercent &&
                    !isCancelMode &&
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
                        disabled={!isEditMode}
                      />
                    </div>
                    {formik.touched.fromDate &&
                    !isCancelMode &&
                    formik.errors.fromDate ? (
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
                        disabled={!isEditMode}
                      />
                    </div>
                    {formik.touched.toDate &&
                    !isCancelMode &&
                    formik.errors.toDate ? (
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
                        disabled={!isEditMode}
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
                {isEditMode ? (
                  <button
                    className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                    type="submit"
                    onClick={handleSaveClick}
                  >
                    <span className="text-xl font-bold">Save</span>
                  </button>
                ) : (
                  <button
                    className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                    type="button"
                    onClick={handleEditClick}
                  >
                    <span className="text-xl font-bold">Update</span>
                  </button>
                )}
                {isEditMode ? (
                  <button
                    className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                    type="button"
                    onClick={handleCancelClick}
                  >
                    <span className="text-xl font-bold">Cancel</span>
                  </button>
                ) : (
                  <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
                    <Link href={`/managerPage/promotion/promotion-list`}>
                      <p className="text-xl font-bold">Back</p>
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(PromotionEdit, "manager");

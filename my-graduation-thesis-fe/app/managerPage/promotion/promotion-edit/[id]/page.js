"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification, DatePicker } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { withAuth } from "../../../../../context/withAuth";
import Link from "next/link";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";

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

  const customInputStyle = {
    // Specify your desired styles here
    backgroundColor: "transparent",
    marginTop: "5px",
    border: "1px solid #DDD",
    height: "41.6px",
    borderRadius: "6px",
  };

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
        formik.setFieldValue("stock", data.stock);
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
      stock: 0,
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
      stock: Yup.number()
        .required("Remain voucher is required")
        .min(0, "Remain voucher must be greater than or equal to 0"),
    }),
    onSubmit: async (values) => {
      try {
        if ((!isEditMode && !isCancelMode) || isSaveMode) {
          const bearerToken = Cookies.get("token");
          // Chuyển đổi lại thành chuỗi thời gian mới
          var fromDate = new Date(values.fromDate);
          fromDate.setDate(fromDate.getDate() + 1);
          var newFromTime = fromDate.toISOString();
          values.fromDate = newFromTime;

          var toDate = new Date(values.toDate);
          toDate.setDate(toDate.getDate() + 1);
          var newToTime = toDate.toISOString();
          values.toDate = newToTime;

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
    fetchPromotionData();
  }, []);
  return (
    <>
      <LocaleProvider locale={en_US}>
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
                        <DatePicker
                          name="fromDate"
                          id="fromDate"
                          onChange={(value) =>
                            formik.setFieldValue("fromDate", value)
                          }
                          value={formik.values.fromDate}
                          inputStyle={customInputStyle}
                          className="w-full h-[44px]"
                          size="default"
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
                        <DatePicker
                          name="toDate"
                          id="toDate"
                          onChange={(value) =>
                            formik.setFieldValue("toDate", value)
                          }
                          inputStyle={customInputStyle}
                          className="w-full h-[44px]"
                          size="default"
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
                        <label>Remain voucher</label>
                        <input
                          name="stock"
                          id="stock"
                          type="number"
                          placeholder=""
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.stock}
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.stock && formik.errors.stock ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.stock}
                        </div>
                      ) : null}
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
      </LocaleProvider>
    </>
  );
};

export default withAuth(PromotionEdit, "manager");

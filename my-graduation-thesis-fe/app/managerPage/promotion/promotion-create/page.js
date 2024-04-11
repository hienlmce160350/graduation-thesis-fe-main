"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification, DatePicker } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { withAuth } from "../../../../context/withAuth";
import Link from "next/link";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

const PromotionCreate = () => {
  const [ids, setIds] = useState([]);
  const customInputStyle = {
    // Specify your desired styles here
    backgroundColor: "transparent",
    marginTop: "5px",
    border: "1px solid #DDD",
    height: "41.6px",
    borderRadius: "6px",
  };
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of promotion could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Promotion Added Successfully.",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };
  // End show notification

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      discountPercent: "",
      name: "",
      description: "",
      createdBy: "",
      stock: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Promotion Name is required"),
      description: Yup.string().required("Promotion Description is required"),
      discountPercent: Yup.number()
        .required("Discount Percent is required")
        .min(0, "Discount Percent must be greater than or equal to 0")
        .max(100, "Discount Percent must be less than or equal to 100"),
      fromDate: Yup.date().required("From Date is required"),
      toDate: Yup.date()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date must be after From Date"),
      stock: Yup.number()
        .required("Remain voucher is required")
        .min(0, "Remain voucher must be greater than or equal to 0"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const userId = Cookies.get("userId");

        // Chuyển đổi lại thành chuỗi thời gian mới
        var fromDate = new Date(values.fromDate);
        fromDate.setDate(fromDate.getDate() + 1);
        var newFromTime = fromDate.toISOString();
        values.fromDate = newFromTime;

        var toDate = new Date(values.toDate);
        toDate.setDate(toDate.getDate() + 1);
        var newToTime = toDate.toISOString();
        values.toDate = newToTime;

        values.createdBy = userId;
        values.discountPercent = Number(values.discountPercent);
        values.stock = Number(values.stock);
        const bearerToken = Cookies.get("token");
        const response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Promotions`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          const data = await response.json();
          Notification.success(successMess);
          router.push("/managerPage/promotion/promotion-list");
        } else {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });

  useEffect(() => {}, []);
  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <h2 className="text-[32px] font-medium mb-3 text-center">
              Add New Promotion
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
                    />
                  </div>
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
                        <DatePicker
                          name="fromDate"
                          id="fromDate"
                          onChange={(value) =>
                            formik.setFieldValue("fromDate", value)
                          }
                          inputStyle={customInputStyle}
                          className="w-full h-[44px]"
                          size="default"
                        />
                      </div>
                      {formik.touched.fromDate && formik.errors.fromDate ? (
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
                        />
                      </div>
                      {formik.touched.toDate && formik.errors.toDate ? (
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
                  <button
                    className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                    type="submit"
                  >
                    <span className="text-xl font-bold">Create</span>
                  </button>
                  <button
                    className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                    type="button"
                  >
                    <Link href={`/managerPage/promotion/promotion-list`}>
                      <p className="text-xl font-bold">Back</p>
                    </Link>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};

export default withAuth(PromotionCreate, "manager");

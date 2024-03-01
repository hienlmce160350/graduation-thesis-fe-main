"use client";
import styles from "./CategoryCreateScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Notification, Select } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { BiSolidCategory } from "react-icons/bi";
import { withAuth } from "../../../../context/withAuth";

export default function CategoryCreate() {
  const [ids, setIds] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of category could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Category Added Successfully.",
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
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      status: 0,
      name: "",
      seoDescription: "",
      seoTitle: "",
      seoAlias: "",
      languageId: "",
      isFeatured: true,
      isShowOnHome: true,
      sortOrder: 0,
    },
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        values.status = Number(1);
        values.seoDescription = "content";
        if (values.languageId == "USA") {
          values.languageId = "en";
        } else if (values.languageId == "VietNam") {
          values.languageId = "vi";
        }
        values.seoTitle = "content";
        values.seoAlias = "content";
        values.isFeatured = true;
        values.isShowOnHome = true;
        values.sortOrder = Number(0);

        const bearerToken = Cookies.get("token");
        console.log("Values: " + JSON.stringify(values));
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Categories`,
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
          Notification.success(successMess);

          router.push("/adminPage/category/category-list");
        } else {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          console.log("An error occurred:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Add New Category
        </h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain m-auto mt-4 w-full">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Category Name</b>
                <div className="mt-3 !h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="name"
                    id="name"
                    type="text"
                    placeholder="Name"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  <BiSolidCategory className="text-[24px]" />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col mt-2">
                <b className={styles.email}>Country</b>
                <div className="mt-3 !h-11 py-[15px] w-fit inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <Select
                    name="languageId"
                    id="languageId"
                    className="bg-[#FFFFFF] !bg-transparent text-sm w-full px-[13px] py-[10px] !rounded-md"
                    style={{ width: 175, height: 41 }}
                    placeholder="Select country"
                    onChange={(value) =>
                      formik.setFieldValue("languageId", value)
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.languageId}
                  >
                    <Select.Option value="en">USA</Select.Option>

                    <Select.Option value="vi">VietNam</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
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
                href="/adminPage/category/category-list"
              >
                Cancel
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

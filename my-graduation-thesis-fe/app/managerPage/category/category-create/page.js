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
import Link from "next/link";

const CategoryCreate = () => {
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
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const bearerToken = Cookies.get("token");
        const response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Categories`,
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

          router.push("/managerPage/category/category-list");
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
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border w-fit">
        <h2 className="text-[32px] font-medium mb-3 text-center">
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
                    placeholder="Input Category Name"
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
            </div>
          </div>

          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
              type="submit"
            >
              <span className="text-xl font-bold">Create</span>
            </button>
            <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
              <Link href={`/managerPage/category/category-list`}>
                <p className="text-xl font-bold">Back</p>
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(CategoryCreate, "manager");

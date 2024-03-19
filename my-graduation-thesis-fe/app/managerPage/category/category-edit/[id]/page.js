"use client";
import styles from "./CategoryEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { BiSolidCategory } from "react-icons/bi";
import { useRouter, useParams } from "next/navigation";
import { withAuth } from "../../../../../context/withAuth";
import Link from "next/link";

const CategoryEdit = () => {
  const [ids, setIds] = useState([]);

  const categoryId = useParams().id;

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Category editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Category edited Successfully.",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };

  // Load API Detail User

  const fetchCategoryData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        formik.setFieldValue("name", data.name);
      } else {
        notification.error({
          message: "Failed to fetch category data",
        });
      }
    } catch (error) {
      console.error("Error fetching category data", error);
    }
  };
  // End load API Detail User

  // End show notification
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: 0,
      status: 0,
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        values.id = Number(categoryId);
        values.status = Number(1);
        const response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Categories/${categoryId}`,
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
          router.push("/managerPage/category/category-list");
        } else {
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating category information:", error);
      }
    },
  });

  useEffect(() => {
    fetchCategoryData();
  }, []);
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border w-fit">
        <h2 className="text-[32px] font-medium mb-3 text-center">
          Update Category
        </h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain m-auto mt-4">
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
            </div>
          </div>

          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
              type="submit"
            >
              <span className="text-xl font-bold">Update</span>
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

export default withAuth(CategoryEdit, "manager");

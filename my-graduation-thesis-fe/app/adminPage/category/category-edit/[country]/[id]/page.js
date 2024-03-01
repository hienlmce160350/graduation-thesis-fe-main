"use client";
import styles from "./CategoryEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { BiSolidCategory } from "react-icons/bi";
import { useRouter, useParams } from "next/navigation";
import { withAuth } from "../../../../../../context/withAuth";

const CategoryEdit = () => {
  const [ids, setIds] = useState([]);

  const categoryId = useParams().id;

  const country = useParams().country;

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
        `https://ersmanagerapi.azurewebsites.net/api/Categories/${categoryId}/${country}`,
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
      seoDescription: "",
      seoTitle: "",
      seoAlias: "",
      languageId: "",
      isFeatured: true,
      isShowOnHome: true,
      sortOrder: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        values.id = Number(categoryId);
        values.status = Number(1);
        values.seoDescription = "content";
        values.languageId = country;
        values.seoTitle = "content";
        values.seoAlias = "content";
        values.isFeatured = true;
        values.isShowOnHome = true;
        values.sortOrder = Number(0);
        console.log("Values Edit: " + JSON.stringify(values));
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Categories/${categoryId}`,
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
          router.push("/adminPage/category/category-list");
        } else {
          console.log(
            "Failed to update category information:",
            response.status
          );
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
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Edit Category
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
};

export default withAuth(CategoryEdit, "manager");

"use client";
import styles from "./ProductAssignScreen.module.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { Tag, Space } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../context/withAuth";

const ProductAssign = () => {
  const productId = useParams().id;
  const [data, setProductData] = useState([]);

  const [categoriesData, setCategoriesData] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content:
      "Product Assigned Categories could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Product Assign Categories Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail User

  const fetchProductData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Products/${productId}/en`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProductData(data);
      } else {
        notification.error({
          message: "Failed to fetch product data",
        });
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };
  // End load API Detail User

  // Load API Categories
  const fetchCategoriesData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Categories?languageId=en`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCategoriesData(data);
      } else {
        notification.error({
          message: "Failed to fetch categories data",
        });
      }
    } catch (error) {
      console.error("Error fetching categories data", error);
    }
  };
  // End load API Categories

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      categories: [],
    },
    onSubmit: async (values) => {
      // Handle role data
      const categoriesArray = [];

      values.categories.forEach((categoriesId) => {
        const matchingCategory = categoriesData.find(
          (category) => category.id === categoriesId
        );

        if (matchingCategory) {
          matchingCategory.selected = true;
          matchingCategory.id = matchingCategory.id.toString();
          delete matchingCategory.parentId;
          categoriesArray.push(matchingCategory);
        }
      });

      categoriesArray.forEach((item) => {
        if (data.categories.includes(item.name)) {
          item.selected = false;
        }
      });

      // call API Assign Role
      try {
        const bearerToken = Cookies.get("token");
        const requestBody = {
          id: productId,
          categories: categoriesArray,
        };

        console.log("Request Body: " + JSON.stringify(requestBody));
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Products/${productId}/categories`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            "Product assigned categories successfully. Response:",
            data
          );
          Notification.success(successMess);
          router.push("/adminPage/product/product-list");
        } else {
          console.log("Failed to assign categories:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error assigning categories:", error);
      }
    },
  });

  useEffect(() => {
    fetchProductData();
    fetchCategoriesData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Assign Category
        </h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Categories of this Product: </b>{" "}
                {data.categories && data.categories != "" ? (
                  <Space wrap>
                    {data.categories.map((item, index) => (
                      <Tag color="green" key={index}>
                        {item}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <span>No categories</span>
                )}
              </div>
            </div>

            <div className={styles.details}>
              <div className="flex flex-col gap-3">
                <b className={styles.email}>
                  Choose categories that you want to assign this account:
                </b>

                <Select
                  onChange={(value) =>
                    formik.setFieldValue("categories", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.categories}
                  name="categories"
                  id="categories"
                  className="!rounded-md"
                  style={{ width: 320 }}
                  placeholder="Select Categories"
                  multiple // Thêm prop này để chuyển đổi thành Multiple Selection
                >
                  {categoriesData.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="w-[100px] py-1 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
              type="submit"
            >
              <span className="text-xl font-bold">Save</span>
            </button>
            <button className="border-solid border border-[#ccc] w-[100px] py-1 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
              <a
                className="text-xl font-bold"
                href="/adminPage/product/product-list"
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

export default withAuth(ProductAssign, "manager");

"use client";
import styles from "./BlogCreateScreen.module.css";
import React from "react";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import FormData from "form-data";
import Cookies from "js-cookie";
import * as Yup from "yup";

const BlogCreate = () => {
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Sử dụng FileReader để đọc tệp tin và chuyển đổi thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("Image: " + base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // end handle image

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of blog could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Blog Added Successfully.",
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
      title: "",
      description: "",
      url: "",
      image: "",
      sortOrder: "",
      createdBy: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Blog title can't be empty"),
      description: Yup.string().required("Blog description is required"),
      url: Yup.string().required("Blog URL is required"),
      sortOrder: Yup.string().required("Sort Order is required"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const prefix = "data:image/jpeg;base64,";
        let imageBase64 = image.substring(prefix.length);
        values.image = imageBase64;
        const userId = Cookies.get("userId");
        values.createdBy = userId;
        values.sortOrder = Number(values.sortOrder);
        const bearerToken = Cookies.get("token");
        console.log("Values: " + JSON.stringify(values));
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Blogs`,
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
          console.log("Create Blog successful. Response:", data);
          Notification.success(successMess);
          router.push("/adminPage/blog/blog-list");
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

  useEffect(() => {}, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Add New Blog</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Blog Title</label>
              <input
                name="title"
                id="title"
                type="text"
                placeholder="Blog Title"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
            </div>
            {formik.touched.title && formik.errors.title ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.title}
              </div>
            ) : null}

            <div>
              <label>
                Blog Description
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
                    <label>Url</label>
                    <input
                      name="url"
                      id="url"
                      type="text"
                      placeholder="Url"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.url}
                    />
                  </div>
                  {formik.touched.url && formik.errors.url ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.url}
                    </div>
                  ) : null}

                  <div>
                    <label>Sort Order</label>
                    <input
                      name="sortOrder"
                      id="sortOrder"
                      type="text"
                      placeholder="Sort Order"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.sortOrder}
                    />
                  </div>
                  {formik.touched.sortOrder && formik.errors.sortOrder ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.sortOrder}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-lg font-semibold">Blog Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the blog main image
                  </p>
                  <div className="w-[100px] relative m-auto mt-3">
                    {image !== null ? (
                      <img
                        alt="preview image"
                        src={image}
                        width={100}
                        height={100}
                        className="border-4 border-solid border-[#DDD] rounded-xl"
                      />
                    ) : (
                      <img
                        alt="Not Found"
                        src="/staticImage/uploadPhoto.jpg"
                        width={100}
                        height={100}
                        className="border-4 border-solid border-[#DDD] rounded-xl"
                      />
                    )}

                    <div className="absolute bottom-[-8px] right-[-8px] bg-[#4BB543] w-8 h-8 leading-[28px] text-center rounded-[50%] overflow-hidden">
                      <input
                        type="file"
                        className="absolute opacity-0 scale-[200] cursor-pointer"
                        onChange={onImageChange}
                        onBlur={formik.handleBlur}
                      />
                      <FaCamera className="inline-block text-white" />
                    </div>
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
                  href="/adminPage/blog/blog-list"
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

export default BlogCreate;

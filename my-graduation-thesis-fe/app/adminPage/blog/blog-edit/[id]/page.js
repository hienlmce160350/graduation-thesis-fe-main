"use client";
import styles from "./BlogEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { FaCamera } from "react-icons/fa";
import { withAuth } from "../../../../context/withAuth";

const BlogEdit = () => {
  const blogId = useParams().id;
  const [data, setBlogData] = useState([]);
  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Sử dụng FileReader để đọc tệp tin và chuyển đổi thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("Image: " + base64String);
        formik.setFieldValue("image", base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // end handle image

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Blog editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Blog Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail Blog

  const fetchBlogData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBlogData(data);
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("title", data.title);
        formik.setFieldValue("description", data.description);
        formik.setFieldValue("url", data.url);
        formik.setFieldValue("image", data.image);
        formik.setFieldValue("sortOrder", data.sortOrder);
        if (data.status == 1) {
          formik.setFieldValue("status", "Active");
        } else {
          formik.setFieldValue("status", "Inactive");
        }
      } else {
        notification.error({
          message: "Failed to fetch blog data",
        });
      }
    } catch (error) {
      console.error("Error fetching blog data", error);
    }
  };
  // End load API Detail Blog

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      url: "",
      image: "",
      sortOrder: 0,
      status: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Blog title can't be empty"),
      description: Yup.string().required("Blog description is required"),
      url: Yup.string().required("Blog URL is required"),
      sortOrder: Yup.number()
        .required("Sort Order is required")
        .min(0, "Sort Order must be greater than or equal to 0"),
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

        const prefix = "data:image/jpeg;base64,";
        if (image != null) {
          let imageBase64 = image.substring(prefix.length);
          values.image = imageBase64;
        } else {
          values.image = "";
        }

        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Blogs/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(values),
          }
        );

        console.log("Values: " + JSON.stringify(values));

        if (response.ok) {
          Notification.success(successMess);
          router.push("/adminPage/blog/blog-list");
        } else {
          console.log("Failed to update blog information:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating blog information:", error);
      }
    },
  });

  useEffect(() => {
    fetchBlogData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Edit Blog</h2>
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
                      type="number"
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

              <div className="mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-lg font-semibold">Blog Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the blog main image
                  </p>
                  <div className="w-[100px] relative m-auto mt-3">
                    {formik.values.image !== null ? (
                      <img
                        alt="preview image"
                        src={formik.values.image}
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
                        accept=".jpg"
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

export default BlogEdit;

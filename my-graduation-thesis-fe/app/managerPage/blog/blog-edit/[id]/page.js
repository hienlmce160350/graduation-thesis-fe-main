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
import { withAuth } from "../../../../../context/withAuth";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import Link2 from "next/link";
import { hideElementsWithStyle } from "@/libs/commonFunction";
import { hideElementsFreeWithStyle } from "@/libs/commonFunction";

const BlogEdit = () => {
  const blogId = useParams().id;
  const [data, setBlogData] = useState([]);
  const [image, setImage] = useState(null);
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
    fetchBlogData();
  };

  const handleSaveClick = () => {
    setIsSaveMode(true);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Sử dụng FileReader để đọc tệp tin và chuyển đổi thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        formik.setFieldValue("image", base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // end handle image

  // ckEditor
  const [editorValue, setEditorValue] = useState("");
  const handleValueChange = (args) => {
    setEditorValue(args.value);
    formik.setFieldValue("description", args.value);
  };
  // end ckEditor

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
        `https://ersmanager.azurewebsites.net/api/Blogs/${blogId}`,
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
        setEditorValue(data.description);
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

          const prefix = "data:image/jpeg;base64,";
          if (image != null) {
            let imageBase64 = image.substring(prefix.length);
            values.image = imageBase64;
          } else {
            values.image = "";
          }

          const response = await fetch(
            `https://ersmanager.azurewebsites.net/api/Blogs/${blogId}`,
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
            router.push("/managerPage/blog/blog-list");
          } else {
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating blog information:", error);
      }
    },
  });

  useEffect(() => {
    // Hàm để kiểm tra và ẩn các phần tử có style nhất định
    hideElementsFreeWithStyle();
    hideElementsWithStyle();
    fetchBlogData();
  }, []);
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
        <h2 className="text-[32px] font-medium mb-3 text-center">
          {isEditMode ? "Update Blog" : "Blog Information"}
        </h2>
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
                disabled={!isEditMode}
              />
            </div>
            {formik.touched.title && !isCancelMode && formik.errors.title ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.title}
              </div>
            ) : null}

            <div>
              <label>Blog Description</label>
              <div className="flex">
                <RichTextEditorComponent
                  id="description"
                  name="description"
                  value={editorValue}
                  change={handleValueChange}
                  enabled={isEditMode}
                  className="opacity-100"
                >
                  <Inject
                    services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]}
                  />
                </RichTextEditorComponent>
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
                      disabled={!isEditMode}
                    />
                  </div>
                  {formik.touched.url && !isCancelMode && formik.errors.url ? (
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
                      disabled={!isEditMode}
                    />
                  </div>
                  {formik.touched.sortOrder &&
                  !isCancelMode &&
                  formik.errors.sortOrder ? (
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
                      disabled={!isEditMode}
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
                  <div className="w-[200px] relative m-auto mt-3">
                    {formik.values.image !== null ? (
                      <img
                        alt="preview image"
                        src={formik.values.image}
                        width={200}
                        height={200}
                        className="border-4 border-solid border-[#DDD] rounded-xl"
                      />
                    ) : (
                      <img
                        alt="Not Found"
                        src="/staticImage/uploadPhoto.jpg"
                        width={200}
                        height={200}
                        className="border-4 border-solid border-[#DDD] rounded-xl"
                      />
                    )}

                    <div className="absolute bottom-[-27px] right-[-27px] bg-[#74A65D] w-16 h-16 leading-[28px] text-center rounded-[50%] overflow-hidden flex items-center justify-center">
                      <input
                        type="file"
                        accept=".jpg"
                        className="absolute opacity-0 scale-[200] cursor-pointer"
                        onChange={onImageChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditMode}
                      />
                      <FaCamera className="inline-block text-white text-4xl" />
                    </div>
                  </div>
                </div>
              </div>
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
                  <Link2 href={`/managerPage/blog/blog-list`}>
                    <p className="text-xl font-bold">Back</p>
                  </Link2>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(BlogEdit, "manager");

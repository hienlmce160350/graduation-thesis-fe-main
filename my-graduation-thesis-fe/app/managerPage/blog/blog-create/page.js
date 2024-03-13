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
import { withAuth } from "../../../../context/withAuth";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";

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
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageChange = (event) => {
    onImageChange(event); // Gọi hàm onImageChange trước để xử lý hình ảnh
    formik.handleChange(event); // Gọi hàm handleChange của formik để cập nhật trạng thái form
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
      sortOrder: Yup.number()
        .required("Sort Order is required")
        .min(0, "Sort Order must be greater than or equal to 0"),
      image: Yup.string().required("Blog Image is required"),
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
          Notification.success(successMess);
          router.push("/managerPage/blog/blog-list");
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

  useEffect(() => {
    // Hàm để kiểm tra và ẩn các phần tử có style nhất định
    const hideElementsWithStyle = () => {
      // Lặp qua tất cả các phần tử trên trang
      document.querySelectorAll("*").forEach((child) => {
        // Kiểm tra xem phần tử có style nhất định không
        if (child.style.position === "fixed" && child.style.top === "10px") {
          // Ẩn phần tử nếu có style nhất định
          console.log("Test");
          child.style.display = "none";
        }
      });
    };
    hideElementsWithStyle();
  }, []);
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
        <h2 className="text-[32px] font-medium mb-3 text-center">
          Add New Blog
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
              />
            </div>
            {formik.touched.title && formik.errors.title ? (
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
                >
                  <Inject
                    services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]}
                  />
                </RichTextEditorComponent>
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
                </div>
              </div>

              <div className="mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-lg font-semibold">Blog Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the blog main image
                  </p>
                  <div className="w-[200px] relative m-auto mt-3">
                    {image !== null ? (
                      <img
                        alt="preview image"
                        src={image}
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

                    <div className="absolute bottom-[-27px] right-[-27px] bg-[#4BB543] w-16 h-16 leading-[28px] text-center rounded-[50%] overflow-hidden flex items-center justify-center">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept=".jpg"
                        className="absolute opacity-0 scale-[200] cursor-pointer"
                        onBlur={formik.handleBlur}
                        onChange={(event) => handleImageChange(event)}
                        value=""
                      />
                      <FaCamera className="inline-block text-white text-4xl" />
                    </div>
                  </div>
                  {formik.touched.image && formik.errors.image ? (
                    <div className="text-sm text-red-600 dark:text-red-400 mt-8">
                      {formik.errors.image}
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
                <a
                  className="text-xl font-bold"
                  href="/managerPage/blog/blog-list"
                >
                  Back
                </a>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(BlogCreate, "manager");

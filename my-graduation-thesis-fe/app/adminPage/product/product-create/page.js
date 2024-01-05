"use client";
import styles from "./ProductCreateScreen.module.css";
import React from "react";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import FormData from "form-data";
import Cookies from "js-cookie";

const ProductCreate = () => {
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      formik.setFieldValue(
        "ThumbnailImage",
        URL.createObjectURL(event.target.files[0])
      );
    }
  };

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of product could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Product Added Successfully.",
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
      Price: "",
      OriginalPrice: "",
      Stock: "",
      Name: "",
      Description: "",
      Details: "",
      SeoDescription: "",
      SeoTitle: "",
      SeoAlias: "",
      IsFeatured: "",
      ThumbnailImage: "",
    },
    onSubmit: async (values) => {
      console.log("Values: " + JSON.stringify(values));
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        // Lấy ra phần id (1b03f52d-3ee5-45a0-b5e1-fd5f56419dd0)
        let idImage = values.ThumbnailImage.split("/").pop();

        // Tạo đường dẫn mới
        let newImage = `https://erssystem.blob.core.windows.net/ersimages/${idImage}.jpg`;
        const form = new FormData();
        form.append("Price", values.Price);
        form.append("Name", values.Name);
        form.append("ThumbnailImage", newImage);
        form.append("SeoAlias", values.SeoAlias);
        form.append("LanguageId", "en");
        form.append("Stock", values.Stock);
        form.append("OriginalPrice", values.OriginalPrice);
        form.append("IsFeatured", values.IsFeatured);
        form.append("SeoTitle", values.SeoTitle);
        form.append("Details", values.Details);
        form.append("Description", values.Description);
        form.append("SeoDescription", values.SeoDescription);

        console.log("Form data: " + form);

        console.log("Form data 2:");
        for (var pair of form.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        const bearerToken = Cookies.get("token");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${bearerToken}`); // Thêm token nếu cần
        headers.append("Content-Type", "multipart/form-data");
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Products`,
          {
            method: "POST",
            headers: headers,
            body: form,
          }
        );
        // let account = {
        //   userName: values.userName,
        //   password: values.password,
        // };

        if (response.ok) {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          const data = await response.json();
          console.log("Create Product successfully. Response:", data);
          Notification.success(successMess);
          router.push("/adminPage/product/product-list");
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
    <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Add New Product
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Product Name</label>
              <input
                name="Name"
                id="Name"
                type="text"
                placeholder="Product Name"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Name}
              />
            </div>

            <div>
              <label>
                Product Description
                <textarea
                  id="Description"
                  name="Description"
                  defaultValue="I really enjoyed biking yesterday!"
                  rows={6}
                  cols={40}
                  className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Description}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="">
                <p className="text-lg font-semibold mb-3 text-center">
                  General Info
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label>Details</label>
                    <input
                      name="Details"
                      id="Details"
                      type="text"
                      placeholder="Details"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Details}
                    />
                  </div>

                  <div>
                    <label>Seo Description</label>
                    <input
                      name="SeoDescription"
                      id="SeoDescription"
                      type="text"
                      placeholder="SeoDescription"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SeoDescription}
                    />
                  </div>

                  <div>
                    <label>Seo Title</label>
                    <input
                      name="SeoTitle"
                      id="SeoTitle"
                      type="text"
                      placeholder="SeoTitle"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SeoTitle}
                    />
                  </div>

                  <div>
                    <label>Seo Alias</label>
                    <input
                      name="SeoAlias"
                      id="SeoAlias"
                      type="text"
                      placeholder="SeoAlias"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SeoAlias}
                    />
                  </div>

                  <div>
                    <label>Is Featured</label>
                    {/* <select >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select> */}

                    <Select
                      name="IsFeatured"
                      id="IsFeatured"
                      className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                      style={{ width: 120, height: 41 }}
                      placeholder="Feature or Not Feature"
                      onChange={(value) =>
                        formik.setFieldValue("IsFeatured", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.IsFeatured}
                    >
                      <Select.Option value="True">True</Select.Option>

                      <Select.Option value="False">False</Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label>Price</label>
                    <input
                      name="Price"
                      id="Price"
                      type="text"
                      placeholder="Price"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Price}
                    />
                  </div>

                  <div>
                    <label>Original Price</label>
                    <input
                      name="OriginalPrice"
                      id="OriginalPrice"
                      type="text"
                      placeholder="Original Price"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.OriginalPrice}
                    />
                  </div>

                  <div>
                    <label>Stock</label>
                    <input
                      name="Stock"
                      id="Stock"
                      type="text"
                      placeholder="Stock"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Stock}
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <div className="text-center">
                  {/* <input
                    type="file"
                    onChange={onImageChange}
                    className="filetype"
                  />
                  <img alt="preview image" src={image} />
                  {
                    console.log("Image URL: " + image)
                  } */}
                  <p className="text-lg font-semibold">Product Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the product main image
                  </p>
                  <div className="w-[100px] relative m-auto mt-3">
                    {image !== null ? (
                      // <img src={URL.createObjectURL(image)} alt="Selected" />
                      <img
                        alt="preview image"
                        src={image}
                        width={100}
                        height={100}
                        className="rounded-[50%] border-4 border-solid border-[#DDD]"
                      />
                    ) : (
                      <img
                        alt="Not Found"
                        src="/staticImage/uploadPhoto.jpg"
                        width={100}
                        height={100}
                        className="rounded-[50%] border-4 border-solid border-[#DDD] "
                      />
                    )}

                    <div className="absolute bottom-0 right-0 bg-[#4BB543] w-8 h-8 leading-[28px] text-center rounded-[50%] overflow-hidden">
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
                  href="/adminPage/user/user-list"
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

export default ProductCreate;

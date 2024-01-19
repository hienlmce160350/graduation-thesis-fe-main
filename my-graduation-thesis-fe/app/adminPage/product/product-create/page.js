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
      price: 0,
      originalPrice: 0,
      stock: 0,
      name: "",
      description: "",
      details: "",
      seoDescription: "",
      seoTitle: "",
      seoAlias: "",
      languageId: "en",
      isFeatured: "",
      thumbnailImage: "",
    },
    onSubmit: async (values) => {
      console.log("Values: " + JSON.stringify(values));
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const prefix = "data:image/jpeg;base64,";
        let imageBase64 = image.substring(prefix.length);
        values.ThumbnailImage = imageBase64;
        values.price = Number(values.price);
        values.originalPrice = Number(values.originalPrice);
        values.stock = Number(values.stock);

        if (values.isFeatured == "True") {
          values.isFeatured = true;
        } else if (values.isFeatured == "False") {
          values.isFeatured = false;
        }
        const bearerToken = Cookies.get("token");
        console.log("Values: " + JSON.stringify(values));
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Products`,
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
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">
          Add New Product
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Product Name</label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Product Name"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>

            <div>
              <label>
                Product Description
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

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="">
                <p className="text-lg font-semibold mb-3 text-center">
                  General Info
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label>Details</label>
                    <input
                      name="details"
                      id="details"
                      type="text"
                      placeholder="Details"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.details}
                    />
                  </div>

                  <div>
                    <label>Seo Description</label>
                    <input
                      name="seoDescription"
                      id="seoDescription"
                      type="text"
                      placeholder="SeoDescription"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.seoDescription}
                    />
                  </div>

                  <div>
                    <label>Seo Title</label>
                    <input
                      name="seoTitle"
                      id="seoTitle"
                      type="text"
                      placeholder="SeoTitle"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.seoTitle}
                    />
                  </div>

                  <div>
                    <label>Seo Alias</label>
                    <input
                      name="seoAlias"
                      id="seoAlias"
                      type="text"
                      placeholder="SeoAlias"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.seoAlias}
                    />
                  </div>

                  <div>
                    <label>Is Featured</label>
                    {/* <select >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select> */}

                    <Select
                      name="isFeatured"
                      id="isFeatured"
                      className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                      style={{ width: 120, height: 41 }}
                      placeholder="Feature or Not Feature"
                      onChange={(value) =>
                        formik.setFieldValue("isFeatured", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.isFeatured}
                    >
                      <Select.Option value="True">True</Select.Option>

                      <Select.Option value="False">False</Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label>Price</label>
                    <input
                      name="price"
                      id="price"
                      type="text"
                      placeholder="Price"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.price}
                    />
                  </div>

                  <div>
                    <label>Original Price</label>
                    <input
                      name="originalPrice"
                      id="originalPrice"
                      type="text"
                      placeholder="Original Price"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.originalPrice}
                    />
                  </div>

                  <div>
                    <label>Stock</label>
                    <input
                      name="stock"
                      id="stock"
                      type="text"
                      placeholder="Stock"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.stock}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-lg font-semibold">Product Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the product main image
                  </p>
                  <div className="w-[100px] relative m-auto mt-3">
                    {image !== null ? (
                      <img
                        alt="preview image"
                        src={image}
                        width={100}
                        height={100}
                        className="border-4 border-solid border-[#DDD]"
                      />
                    ) : (
                      <img
                        alt="Not Found"
                        src="/staticImage/uploadPhoto.jpg"
                        width={100}
                        height={100}
                        className="border-4 border-solid border-[#DDD] "
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
                  href="/adminPage/product/product-list"
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

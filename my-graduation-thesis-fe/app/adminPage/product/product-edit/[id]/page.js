"use client";
import styles from "./ProductEditScreen.module.css";
import React from "react";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";

const ProductEdit = () => {
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState(null);
  const productId = useParams().id;
  const [data, setProductData] = useState([]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Sử dụng FileReader để đọc tệp tin và chuyển đổi thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("Image: " + base64String);
        formik.setFieldValue("thumbnailImage", base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // end handle image

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Product editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Product Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail Blog

  const fetchProductData = async () => {
    try {
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
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("name", data.name);
        formik.setFieldValue("description", data.description);
        formik.setFieldValue("details", data.details);
        formik.setFieldValue("seoDescription", data.seoDescription);
        formik.setFieldValue("seoTitle", data.seoTitle);
        formik.setFieldValue("seoAlias", data.seoAlias);
        formik.setFieldValue("languageId", data.languageId);
        formik.setFieldValue("isFeatured", data.isFeatured);
        if (data.isFeatured == true) {
          formik.setFieldValue("isFeatured", "True");
        } else {
          formik.setFieldValue("isFeatured", "False");
        }
        if (data.status == 1) {
          formik.setFieldValue("status", "Active");
        } else {
          formik.setFieldValue("status", "Inactive");
        }
        formik.setFieldValue("thumbnailImage", data.thumbnailImage);
      } else {
        notification.error({
          message: "Failed to fetch product data",
        });
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };
  // End load API Detail Blog

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      description: "",
      details: "",
      seoDescription: "",
      seoTitle: "",
      seoAlias: "",
      languageId: "",
      status: "",
      isFeatured: "",
      thumbnailImage: "",
    },
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");

        if (values.isFeatured == "True") {
          values.isFeatured = true;
        } else if (values.isFeatured == "False") {
          values.isFeatured = false;
        }

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
        console.log("Image: " + image);

        if (image != null) {
          let imageBase64 = image.substring(prefix.length);
          values.thumbnailImage = imageBase64;
        } else {
          values.thumbnailImage = "";
        }

        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Products/${productId}`,
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
          router.push("/adminPage/product/product-list");
        } else {
          console.log("Failed to update product information:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Edit Product</h2>
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
                  <p className="text-lg font-semibold">Product Image</p>
                  <p className="font-normal text-[#1C1F2399]">
                    Add the product main image
                  </p>
                  <div className="w-[100px] relative m-auto mt-3">
                    {formik.values.thumbnailImage !== null ? (
                      <img
                        alt="preview image"
                        src={formik.values.thumbnailImage}
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

export default ProductEdit;

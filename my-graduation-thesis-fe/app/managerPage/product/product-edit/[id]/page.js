"use client";
import React from "react";
import { Select, Typography } from "@douyinfe/semi-ui";
import { useEffect, useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import * as Yup from "yup";

import { Empty } from "@douyinfe/semi-ui";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
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

/* The following is available after version 1.13.0 */

const ProductEdit = () => {
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState(null);
  const productId = useParams().id;

  const [isEditMode, setIsEditMode] = useState(false);

  const [isCancelMode, setIsCancelMode] = useState(false);

  const [isSaveMode, setIsSaveMode] = useState(false);

  const [dataProduct, setProductData] = useState([]);

  const { Text, Paragraph } = Typography;

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsCancelMode(false);
  };

  const handleCancelClick = () => {
    setIsCancelMode(true);
    setIsEditMode(false);
    fetchProductData();
  };

  const handleSaveClick = () => {
    setIsSaveMode(true);
  };

  // ckEditor
  const [editorValue, setEditorValue] = useState("");
  const handleValueChange = (args) => {
    setEditorValue(args.value);
    formik.setFieldValue("description", args.value);
  };
  // end ckEditor

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Sử dụng FileReader để đọc tệp tin và chuyển đổi thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
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

  // Load API Detail Product

  const fetchProductData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Products/${productId}`,
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
        setEditorValue(data.description);
        formik.setFieldValue("details", data.details);
        formik.setFieldValue("seoDescription", data.seoDescription);
        formik.setFieldValue("seoTitle", data.seoTitle);
        formik.setFieldValue("seoAlias", data.seoAlias);
        formik.setFieldValue("languageId", data.languageId);
        formik.setFieldValue("isFeatured", data.isFeatured);
        formik.setFieldValue("price", data.price);
        formik.setFieldValue("originalPrice", data.originalPrice);
        formik.setFieldValue("cost", data.cost);
        formik.setFieldValue("stock", data.stock);
        formik.setFieldValue("dateModified", data.dateModified);

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
  // End load API Detail Product

  const validateStock = (value) => {
    // Lấy giá trị hiện tại của stock từ formik initialValues hoặc từ state nếu có
    const currentStock = dataProduct.stock;

    // Kiểm tra nếu giá trị nhập vào nhỏ hơn hoặc bằng giá trị hiện tại
    if (value < currentStock) {
      return new Yup.ValidationError(
        "The new stock must be greater than or equal to the current stock",
        null,
        "stock"
      );
    }

    return true; // Giá trị hợp lệ
  };

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
      price: 0,
      originalPrice: 0,
      cost: 0,
      stock: 0,
      dateModified: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product Name is required"),
      description: Yup.string().required("Description is required"),
      details: Yup.string().required("Details is required"),
      seoDescription: Yup.string().required("Seo Desription is required"),
      seoTitle: Yup.string().required("Seo Title is required"),
      seoAlias: Yup.string().required("Seo Alias is required"),
      cost: Yup.number()
        .required("Import Price is required")
        .min(0, "Import Price must be greater than or equal to 0"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be greater than or equal to 0"),
      originalPrice: Yup.number()
        .required("Original Price is required")
        .min(0, "Original Price must be greater than or equal to 0"),
      stock: Yup.number()
        .required("Stock is required")
        .min(0, "Stock must be greater than or equal to 0")
        .test(
          "greater-than-current-stock",
          "New stock must be greater than current stock",
          validateStock
        ),
    }),
    onSubmit: async (values) => {
      try {
        if ((!isEditMode && !isCancelMode) || isSaveMode) {
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

          if (image != null) {
            let imageBase64 = image.substring(prefix.length);
            values.thumbnailImage = imageBase64;
          } else {
            values.thumbnailImage = "";
          }

          values.dateModified = new Date().toISOString();

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
            router.push("/managerPage/product/product-list");
          } else {
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });

  let style = {
    backgroundColor: "#cccccc30",
    borderRadius: "12px",
    padding: "20px",
    margin: "8px 2px",
  };

  const empty = (
    <Empty
      image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
      }
      description={"No have comments"}
    />
  );
  useEffect(() => {
    const hideElementsWithStyle = () => {
      // Lặp qua tất cả các phần tử trên trang
      document.querySelectorAll("*").forEach((child) => {
        // Kiểm tra xem phần tử có style nhất định không
        if (
          child.style.position === "fixed" &&
          (child.style.top === "10px" || child.style.top === "0")
        ) {
          // Ẩn phần tử nếu có style nhất định
          console.log("Test");
          child.style.display = "none";
        }
      });
    };
    hideElementsWithStyle();
    fetchProductData();
  }, []);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <h2 className="text-[32px] font-bold mb-3 text-center">
              {isEditMode ? "Edit Product" : "Product Information"}
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
                    disabled={!isEditMode}
                  />
                </div>
                {console.log("IcancelMode: " + isCancelMode)}
                {formik.touched.name && !isCancelMode && formik.errors.name ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.name}
                  </div>
                ) : null}

                <div>
                  <label>Product Description</label>
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
                        services={[
                          Toolbar,
                          Image,
                          Link,
                          HtmlEditor,
                          QuickToolbar,
                        ]}
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
                <p className="text-xl font-semibold mb-3 text-center">
                  General Info
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[52px]">
                  <div className="">
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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.details &&
                      !isCancelMode &&
                      formik.errors.details ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.details}
                        </div>
                      ) : null}

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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.seoDescription &&
                      !isCancelMode &&
                      formik.errors.seoDescription ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.seoDescription}
                        </div>
                      ) : null}

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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.seoTitle &&
                      !isCancelMode &&
                      formik.errors.seoTitle ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.seoTitle}
                        </div>
                      ) : null}

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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.seoAlias &&
                      !isCancelMode &&
                      formik.errors.seoAlias ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.seoAlias}
                        </div>
                      ) : null}

                      <div>
                        <label>Import Price</label>
                        <input
                          name="cost"
                          id="cost"
                          type="number"
                          placeholder="Price"
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cost}
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.cost &&
                      !isCancelMode &&
                      formik.errors.cost ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.cost}
                        </div>
                      ) : null}

                      <div>
                        <label>Price</label>
                        <input
                          name="price"
                          id="price"
                          type="number"
                          placeholder="Price"
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.price}
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.price &&
                      !isCancelMode &&
                      formik.errors.price ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.price}
                        </div>
                      ) : null}

                      <div>
                        <label>Original Price</label>
                        <input
                          name="originalPrice"
                          id="originalPrice"
                          type="number"
                          placeholder="Original Price"
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.originalPrice}
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.originalPrice &&
                      !isCancelMode &&
                      formik.errors.originalPrice ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.originalPrice}
                        </div>
                      ) : null}

                      <div>
                        <label>Stock</label>
                        <input
                          name="stock"
                          id="stock"
                          type="number"
                          placeholder="Stock"
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.stock}
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.stock &&
                      !isCancelMode &&
                      formik.errors.stock ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.stock}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0">
                    <div className="flex flex-col gap-4">
                      <div className="text-center">
                        <label>Is Featured</label>
                        <br />
                        <Select
                          name="isFeatured"
                          id="isFeatured"
                          className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md"
                          style={{ width: 140, height: 41 }}
                          placeholder="Feature or Not Feature"
                          onChange={(value) =>
                            formik.setFieldValue("isFeatured", value)
                          }
                          onBlur={formik.handleBlur}
                          value={formik.values.isFeatured}
                          disabled={!isEditMode}
                        >
                          <Select.Option value="True">True</Select.Option>

                          <Select.Option value="False">False</Select.Option>
                        </Select>
                      </div>

                      <div className="text-center">
                        <label>Status</label>
                        <br />
                        <Select
                          name="status"
                          id="status"
                          className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md"
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
                      <div className="text-center">
                        <p className="text-lg font-semibold">Product Image</p>
                        <p className="font-normal text-[#1C1F2399]">
                          Add the product main image
                        </p>
                        <div className="w-[200px] relative m-auto mt-3">
                          {formik.values.thumbnailImage !== null ? (
                            <img
                              alt="preview image"
                              src={formik.values.thumbnailImage}
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
                </div>

                <div className="flex justify-start gap-4 mt-4 mb-2">
                  {isEditMode ? (
                    <button
                      className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                      type="submit"
                      onClick={handleSaveClick}
                    >
                      <span className="text-lg">Save</span>
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                      type="button"
                      onClick={handleEditClick}
                    >
                      <span className="text-lg">Update</span>
                    </button>
                  )}
                  {isEditMode ? (
                    <button
                      className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                      type="button"
                      onClick={handleCancelClick}
                    >
                      <span className="text-lg">Cancel</span>
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                      type="button"
                    >
                      <Link2 href={`/managerPage/product/product-list`}>
                        <p className="text-lg">Back</p>
                      </Link2>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};

export default withAuth(ProductEdit, "manager");

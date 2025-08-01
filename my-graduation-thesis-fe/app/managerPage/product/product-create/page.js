"use client";
import styles from "./ProductCreateScreen.module.css";
import React from "react";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { withAuth } from "../../../../context/withAuth";
import {
  HtmlEditor,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
  PasteCleanup,
  Table,
} from "@syncfusion/ej2-react-richtexteditor";
import Link2 from "next/link";
import { hideElementsWithStyle } from "@/libs/commonFunction";
import { hideElementsFreeWithStyle } from "@/libs/commonFunction";

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
  let formatPainterRTE;
  const toolbarSettings = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "SuperScript",
      "SubScript",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "Outdent",
      "Indent",
      "|",
      "CreateLink",
      "CreateTable",
      "|",
      "SourceCode",
      "Undo",
      "Redo",
    ],
  };
  const [editorValue, setEditorValue] = useState("");
  const handleValueChange = (args) => {
    setEditorValue(args.value);
    formik.setFieldValue("description", args.value);
  };
  // end ckEditor

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
      cost: 0,
      originalPrice: 0,
      inputStock: 0,
      name: "",
      description: "",
      details: "",
      seoDescription: "",
      seoTitle: "",
      seoAlias: "",
      languageId: "",
      isFeatured: false,
      thumbnailImage: "",
      dateCreated: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be greater than or equal to 0")
        .test({
          name: "priceGreaterThanCost",
          message: "Price must be greater than import price",
          test: function (value) {
            const cost = this.resolve(Yup.ref("cost"));
            return value > cost;
          },
        })
        .test({
          name: "priceLessThanOriginalPrice",
          message: "Price must be less than original price",
          test: function (value) {
            const originalPrice = this.resolve(Yup.ref("originalPrice"));
            return value < originalPrice;
          },
        }),
      cost: Yup.number()
        .required("Import Price is required")
        .min(0, "Import Price must be greater than or equal to 0"),
      originalPrice: Yup.number()
        .required("Original Price is required")
        .min(0, "Original Price must be greater than or equal to 0")
        .test({
          name: "originalPriceGreaterThanCost",
          message: "Original Price must be greater than import price",
          test: function (value) {
            const cost = this.resolve(Yup.ref("cost"));
            return value > cost;
          },
        })
        .test({
          name: "originalPriceGreaterThanPrice",
          message: "Original Price must be greater than price",
          test: function (value) {
            const price = this.resolve(Yup.ref("price"));
            return value > price;
          },
        }),
      inputStock: Yup.number()
        .required("Input Stock is required")
        .min(1, "Input Stock must be greater than or equal to 1"),
      name: Yup.string()
        .max(200, "Product Name must not exceed 200 characters")
        .required("Product Name is required"),
      description: Yup.string().required("Description is required"),
      details: Yup.string()
        .required("Details is required")
        .max(500, "Details must not exceed 500 characters"),
      seoDescription: Yup.string().required("Seo Desription is required"),
      seoTitle: Yup.string().required("Seo Title is required"),
      seoAlias: Yup.string()
        .required("Seo Alias is required")
        .max(200, "Seo Alias must not exceed 200 characters"),
      thumbnailImage: Yup.string().required("Product Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const prefix = "data:image/jpeg;base64,";
        let imageBase64 = image.substring(prefix.length);
        values.thumbnailImage = imageBase64;
        values.price = Number(values.price);
        values.cost = Number(values.cost);
        values.originalPrice = Number(values.originalPrice);
        values.inputStock = Number(values.inputStock);
        if (values.languageId == "") {
          values.languageId = "en";
        }

        if (values.isFeatured == "True") {
          values.isFeatured = true;
        } else if (values.isFeatured == "False") {
          values.isFeatured = false;
        }

        if (values.languageId == "USA") {
          values.languageId = "en";
        } else if (values.languageId == "VietNam") {
          values.languageId = "vi";
        }
        const bearerToken = Cookies.get("token");
        const response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Products`,
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
          router.push("/managerPage/product/product-list");
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
    hideElementsFreeWithStyle();
    hideElementsWithStyle();
  }, []);
  return (
    <>
      <div className="mx-auto w-full mt-3 h-fit mb-3">
        <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
          <h2 className="text-[32px] font-medium mb-3 text-center">
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
              {formik.touched.name && formik.errors.name ? (
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
                    ref={(richtexteditor) => {
                      formatPainterRTE = richtexteditor;
                    }}
                    toolbarSettings={toolbarSettings}
                    value={editorValue}
                    change={handleValueChange}
                  >
                    <Inject
                      services={[
                        HtmlEditor,
                        Toolbar,
                        QuickToolbar,
                        Link,
                        Table,
                        PasteCleanup,
                      ]}
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
                    {formik.touched.details && formik.errors.details ? (
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
                      />
                    </div>
                    {formik.touched.seoDescription &&
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
                      />
                    </div>
                    {formik.touched.seoTitle && formik.errors.seoTitle ? (
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
                      />
                    </div>
                    {formik.touched.seoAlias && formik.errors.seoAlias ? (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formik.errors.seoAlias}
                      </div>
                    ) : null}

                    <div>
                      <label>Is Featured</label>

                      <Select
                        name="isFeatured"
                        id="isFeatured"
                        className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                        style={{ width: 220, height: 41 }}
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
                      <label>Import Price</label>
                      <input
                        name="cost"
                        id="cost"
                        type="number"
                        placeholder="Inport Price"
                        className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cost}
                      />
                    </div>
                    {formik.touched.cost && formik.errors.cost ? (
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
                      />
                    </div>
                    {formik.touched.price && formik.errors.price ? (
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
                      />
                    </div>
                    {formik.touched.originalPrice &&
                    formik.errors.originalPrice ? (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formik.errors.originalPrice}
                      </div>
                    ) : null}

                    <div>
                      <label>Import Stock</label>
                      <input
                        name="inputStock"
                        id="inputStock"
                        type="number"
                        placeholder="Import Stock"
                        className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputStock}
                      />
                    </div>
                    {formik.touched.inputStock && formik.errors.inputStock ? (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formik.errors.inputStock}
                      </div>
                    ) : null}

                    <div>
                      <label>Country</label>

                      <Select
                        name="languageId"
                        id="languageId"
                        className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                        style={{ width: 170, height: 41 }}
                        placeholder="Select country"
                        onChange={(value) =>
                          formik.setFieldValue("languageId", value)
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.languageId}
                      >
                        <Select.Option value="en">USA</Select.Option>

                        <Select.Option value="vi">VietNam</Select.Option>
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

                      <div className="absolute bottom-[-27px] right-[-27px] bg-[#74A65D] w-16 h-16 leading-[28px] text-center rounded-[50%] overflow-hidden flex items-center justify-center">
                        <input
                          id="thumbnailImage"
                          name="thumbnailImage"
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
                    {formik.touched.thumbnailImage &&
                    formik.errors.thumbnailImage ? (
                      <div className="text-sm text-red-600 dark:text-red-400 mt-8">
                        {formik.errors.thumbnailImage}
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
                <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]" type="button">
                  <Link2 href={`/managerPage/product/product-list`}>
                    <p className="text-xl font-bold">Back</p>
                  </Link2>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(ProductCreate, "manager");

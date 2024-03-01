"use client";
import styles from "./ProductEditScreen.module.css";
import React from "react";
import {
  Select,
  List,
  Rating,
  Modal,
  Avatar,
  Typography,
  Spin,
  Button,
} from "@douyinfe/semi-ui";
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

import { IconAlertTriangle } from "@douyinfe/semi-icons";

import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import InfiniteScroll from "react-infinite-scroller";
import { withAuth } from "../../../../context/withAuth";

/* The following is available after version 1.13.0 */

const ProductEdit = () => {
  const [ids, setIds] = useState([]);
  const [image, setImage] = useState(null);
  const productId = useParams().id;

  const country = useParams().country;

  const [isEditMode, setIsEditMode] = useState(false);

  const [isCancelMode, setIsCancelMode] = useState(false);

  const [isSaveMode, setIsSaveMode] = useState(false);

  const [commentIdDeleted, setCommentIdDeleted] = useState();

  const { Text } = Typography;

  const [maxHeight, setMaxHeight] = useState(0);

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsCancelMode(false);
  };

  const handleCancelClick = () => {
    setIsCancelMode(true);
    setIsEditMode(false);
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
        `https://ersmanagerapi.azurewebsites.net/api/Products/${productId}/${country}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCommentData(data.commentsList);
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("name", data.name);
        formik.setFieldValue("description", data.description);
        formik.setFieldValue("details", data.details);
        formik.setFieldValue("seoDescription", data.seoDescription);
        formik.setFieldValue("seoTitle", data.seoTitle);
        formik.setFieldValue("seoAlias", data.seoAlias);
        formik.setFieldValue("languageId", data.languageId);
        formik.setFieldValue("isFeatured", data.isFeatured);
        formik.setFieldValue("price", data.price);
        formik.setFieldValue("originalPrice", data.originalPrice);
        formik.setFieldValue("stock", data.stock);

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
      price: 0,
      originalPrice: 0,
      stock: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product Name is required"),
      description: Yup.string().required("Description is required"),
      details: Yup.string().required("Details is required"),
      seoDescription: Yup.string().required("Seo Desription is required"),
      seoTitle: Yup.string().required("Seo Title is required"),
      seoAlias: Yup.string().required("Seo Alias is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be greater than or equal to 0"),
      originalPrice: Yup.number()
        .required("Original Price is required")
        .min(0, "Original Price must be greater than or equal to 0"),
      stock: Yup.number()
        .required("Stock is required")
        .min(0, "Stock must be greater than or equal to 0"),
    }),
    onSubmit: async (values) => {
      try {
        if ((!isEditMode && !isCancelMode) || isSaveMode) {
          const bearerToken = Cookies.get("token");
          values.languageId = country;
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

          console.log("Values Edit: " + JSON.stringify(values));

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
            console.log(
              "Failed to update product information:",
              response.status
            );
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

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = (commentId) => {
    setVisible(true);
    setCommentIdDeleted(commentId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Comments/${commentIdDeleted}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
        setCommentIdDeleted(0);
        fetchProductData();
        setVisible(false);
        console.log("Comment deleted successfully");
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete comment");
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setCommentIdDeleted(0);
    setVisible(false);
  };

  // end modal

  const ShowMoreLessList = ({ content }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
      setShowMore((prev) => !prev);
    };

    return (
      <div>
        <p className={`line-clamp-${showMore ? "none" : "3"} min-h-[60px]`}>
          {content}
        </p>
        <button onClick={toggleShowMore}>
          {showMore ? (
            <button className="flex self-end text-sm font-medium text-[#318980] bg-[#d6e7e6] border border-solid border-[#d6e7e6] rounded-[0.2rem] px-6 py-2 mt-2 cursor-pointer transition-all duration-500 ease hover:text-white hover:bg-[#318980]">
              Show Less
            </button>
          ) : (
            <button className="flex self-end text-sm font-medium text-[#318980] bg-[#d6e7e6] border border-solid border-[#d6e7e6] rounded-[0.2rem] px-6 py-2 mt-2 cursor-pointer transition-all duration-500 ease hover:text-white hover:bg-[#318980]">
              Show More
            </button>
          )}
        </button>
      </div>
    );
  };

  //  loading  scroll
  const count = 5;
  const [dataComment, setCommentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [countValue, setCountValue] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dataSource = dataComment.slice(
        countValue * count,
        countValue * count + count
      );
      setCountValue(countValue + 1);
      setCommentData([...dataComment, ...dataSource]);
      setHasMore(!!dataSource.length);
    } finally {
      setLoading(false);
    }
    console.log("Check Loading: " + loading);
  };

  const showLoadMore = countValue % 4 === 0;

  const loadMore =
    !loading && hasMore && showLoadMore ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={fetchData}>show more</Button>
      </div>
    ) : null;
  // end loading scroll

  const commentList = (
    <>
      <div
        className
        Name="light-scrollbar"
        style={{
          height: 420,
          overflow: "auto",
          borderBottomRightRadius: "15px",
          borderBottomLeftRadius: "15px",
          padding: 10,
        }}
      >
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          threshold={20}
          loadMore={fetchData}
          hasMore={!loading && hasMore && !showLoadMore}
          useWindow={false}
          style={{
            borderBottomRightRadius: "15px",
            borderBottomLeftRadius: "15px",
          }}
        >
          <List
            grid={{
              gutter: 12,
              Xs: 24,
              sm: 24,
              md: 12,
              lg: 12,
              Xl: 8,
              xxl: 6,
            }}
            dataSource={dataComment}
            style={{ display: "flex", flexWrap: "wrap" }}
            loadMore={loadMore}
            renderItem={(item) => (
              <List.Item
                header={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      size="small"
                      shape="square"
                      src={item.userAvatar}
                      style={{ marginRight: 12 }}
                    ></Avatar>
                    {/* The width calculation method is the cell setting width minus the non-text content width */}
                    <Text heading={5} ellipsis={{ showTooltip: true }}>
                      {item.userName}
                    </Text>
                  </span>
                }
                style={style}
                emptyContent={empty}
              >
                <div className="mt-2 w-full">
                  <div className="flex flex-col items-start">
                    <p className="font-normal text-[#1C1F239E]">Rating</p>
                    <Rating
                      allowHalf
                      size="small"
                      value={item.grade}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <p className="font-normal text-[#1C1F239E]">Feedbacks</p>
                    <div style={{}}>
                      <ShowMoreLessList content={item.content} />
                    </div>
                  </div>
                  {/* <Descriptions
                    align="center"
                    size="small"
                    row
                    data={[
                      {
                        key: "Rating",
                        value: (
                          <Rating
                            allowHalf
                            size="small"
                            value={item.grade}
                            disabled
                          />
                        ),
                      },
                      {
                        key: "Feedbacks",
                        value: (
                          <div style={{ position: "relative" }}>
                            <ShowMoreLessList content={item.content} />
                          </div>
                        ),
                      },
                    ]}
                  /> */}
                  <div
                    style={{
                      margin: "12px 0",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 500,
                        color: "#FF5C5C",
                        backgroundColor: "#FFB3B360",
                        border: "1px solid #FFB3B360",
                        borderRadius: "0.2rem",
                        padding: "8px 24px",
                        marginTop: "0.5rem",
                        cursor: "pointer",
                        transition: "all 0.5s ease",
                      }}
                      onClick={() => showDialog(item.id)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.backgroundColor = "#FF5C5C";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "#FF5C5C";
                        e.currentTarget.style.backgroundColor = "#FFB3B360";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </List.Item>
            )}
          />
          {loading && hasMore && (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          )}
        </InfiniteScroll>
      </div>

      {/* Move Modal outside of List */}
      <Modal
        title={<div className="text-center w-full">Delete Comment</div>}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Yes, Delete"}
        cancelText={"No, Cancel"}
        okButtonProps={{
          style: { background: "rgba(222, 48, 63, 0.8)" },
        }}
      >
        <p className="text-center text-base">
          Are you sure you want to delete <b>this comment</b>?
        </p>
        <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
          <p className="text-[#771505] flex items-center font-semibold">
            <IconAlertTriangle /> Warning
          </p>
          <p className="text-[#BC4C2E] font-medium">
            By Deleting this comment, the comment will be permanently deleted
            from the system.
          </p>
        </div>
      </Modal>
    </>
  );
  useEffect(() => {
    fetchProductData();
    fetchData();
  }, []);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="m-auto w-full mb-10">
          <div className={styles.table}>
            <h2 className="text-[32px] font-bold mb-3 text-center">
              {isEditMode ? "Edit Product" : "Product Details"}
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
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.name}
                  </div>
                ) : null}

                <div>
                  <label>
                    Product Description
                    <textarea
                      id="description"
                      name="description"
                      defaultValue="I really enjoyed biking yesterday!"
                      rows={8}
                      cols={40}
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                      disabled={!isEditMode}
                    />
                  </label>
                </div>
                {formik.touched.description && formik.errors.description ? (
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
                          disabled={!isEditMode}
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
                          disabled={!isEditMode}
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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.seoAlias && formik.errors.seoAlias ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.seoAlias}
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
                          disabled={!isEditMode}
                        />
                      </div>
                      {formik.touched.originalPrice &&
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
                      {formik.touched.stock && formik.errors.stock ? (
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
                        <div className="w-[100px] relative m-auto mt-3">
                          {formik.values.thumbnailImage !== null ? (
                            <img
                              alt="preview image"
                              src={formik.values.thumbnailImage}
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
                              disabled={!isEditMode}
                            />
                            <FaCamera className="inline-block text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start gap-4 mt-4 mb-2">
                  {isEditMode ? (
                    <button
                      className="w-[112px] py-2 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
                      type="submit"
                      onClick={handleSaveClick}
                    >
                      <span className="text-xl font-bold">Save</span>
                    </button>
                  ) : (
                    <button
                      className="w-[112px] py-2 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
                      type="button"
                      onClick={handleEditClick}
                    >
                      <span className="text-xl font-bold">Edit</span>
                    </button>
                  )}
                  {isEditMode ? (
                    <button
                      className="border-solid border border-[#ccc] w-[112px] py-2 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white"
                      type="button"
                      onClick={handleCancelClick}
                    >
                      <span className="text-xl font-bold">Cancel</span>
                    </button>
                  ) : (
                    <button className="border-solid border border-[#ccc] w-[112px] py-2 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
                      <a
                        className="text-xl font-bold"
                        href="/adminPage/product/product-list"
                      >
                        Back
                      </a>
                    </button>
                  )}
                </div>
              </div>
            </form>
            <div className="text-center mt-4">
              <p className="text-xl font-semibold mb-3">Comment</p>
              {commentList}
            </div>
          </div>
        </div>
      </LocaleProvider>
    </>
  );
}

export default withAuth(ProductEdit, "manager");
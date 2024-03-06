"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Modal } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import { Notification } from "@douyinfe/semi-ui";
import { Rating } from "@douyinfe/semi-ui";
import { Progress } from "@douyinfe/semi-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IconStar } from "@douyinfe/semi-icons";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconShoppingBag } from "@douyinfe/semi-icons";
import { Pagination } from "@douyinfe/semi-ui";

const ProductDetail = () => {
  const productId = useParams().id;
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState(1); // Giá trị ban đầu là 1
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rating, setRating] = useState(5); // Giá trị ban đầu của rating
  const [ids, setIds] = useState([]);
  const [page, setPage] = useState(1);
  const commentsPerPage = 5;
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = comments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );
  const increaseQty = (amount) => {
    const newQty = amount + 1;
    setAmount(newQty);
  };

  const decreaseQty = () => {
    const newQty = Math.max(amount - 1, 1); // Giới hạn giá trị không thể nhỏ hơn 1
    setAmount(newQty);
  };
  //Modal
  const [visible, setVisible] = useState(false);

  const [commentIdDeleted, setCommentIdDeleted] = useState(null); // New state to store the comment ID to be deleted
  const showDialog = (commentId) => {
    setVisible(true);
    setCommentIdDeleted(commentId);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  //xu ly update comment
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const [selectedComment, setSelectedComment] = useState({
    id: null,
    content: "",
    grade: 5,
  });
  const handleUpdateClick = (commentId) => {
    setIsUpdating(true);
    setSelectedCommentId(commentId);
    // Lấy thông tin của comment được chọn để hiển thị trong form cập nhật
    const selectedComment = comments.find(
      (comment) => comment.id === commentId
    );
    setSelectedComment({
      id: selectedComment.id,
      content: selectedComment.content,
      grade: selectedComment.grade,
    });
  };

  const cancelUpdate = () => {
    setIsUpdating(false);
    setSelectedCommentId(null);
    setSelectedComment({
      id: null,
      content: "",
      grade: 5,
    });
  };

  // het phan xu ly comment
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of comment could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Upload Comment Successfully.",
    duration: 3,
    theme: "light",
  };
  let successMess2 = {
    title: "Success",
    content: "Delete Comment Successfully.",
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
  const formik = useFormik({
    initialValues: {
      content: "",
      grade: 5,
      userId: "",
      productId: "",
    },
    validationSchema: Yup.object({
      content: Yup.string().required("Comment can't be empty"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const userId = Cookies.get("userId");
        values.userId = userId;
        values.productId = Number(productId);
        const bearerToken = Cookies.get("token");
        console.log("Values: " + JSON.stringify(values));
        const response = await fetch(
          `https://eatright2.azurewebsites.net/api/Comments`,
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
          console.log("Create comment successful. Response:", data);
          Notification.success(successMess);
          resetForm();
          getComments();
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
  //Form Update
  const formikUpdate = useFormik({
    initialValues: {
      content: "",
      grade: 5,
      id: "",
    },
    // validationSchema: Yup.object({
    //   content: Yup.string().required("Comment can't be empty"),
    // }),
    onSubmit: async () => {
      try {
        console.log("Formik Update Values:", {
          id: selectedCommentId,
          content: selectedComment.content,
          grade: selectedComment.grade,
        }); // Log update data before sending
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const userId = Cookies.get("userId");
        const bearerToken = Cookies.get("token");
        const response = await fetch(
          `https://eatright2.azurewebsites.net/api/Comments/${userId}/${selectedCommentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: selectedCommentId,
              content: selectedComment.content,
              grade: selectedComment.grade,
            }),
          }
        );

        if (response.ok) {
          console.log("Update comment successful");
          Notification.success(successMess);
          getComments();
          cancelUpdate(); // Hủy bỏ trạng thái cập nhật sau khi thành công
        } else {
          console.error("An error update occurred:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        console.error("An error update occurred:", error);
        Notification.error(errorMess);
      } finally {
        let idsTmp = [...ids];
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
      }
    },
  });
  // Function to get current user's ID from cookies
  const getCurrentUserIdFromCookies = () => {
    const userIdFromCookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
    setCurrentUserId(userIdFromCookies);
  };

  //api get detail product
  const getProductDetail = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Products/${productId}/${storedLanguage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const detailProductData = await response.json();
        // const myJson = JSON.stringify(detailProductData);
        // console.log(myJson);
        // console.log("Product detail:", detailProductData);
        setProduct(detailProductData);
        // Xử lý dữ liệu product detail ở đây, có thể hiển thị trong modal hoặc component riêng
      } else {
        console.error("Failed to fetch product detail:", response);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };
  // API to get comments for the product
  const getComments = async () => {
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Comments/getAll?productId=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const commentsData = await response.json();
        console.log("Comments:", commentsData);
        setComments(commentsData); // Assuming the comments are stored in the 'items' property
      } else {
        console.error("Failed to fetch comments:", response);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // Function to handle comment deletion
  const deleteComment = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Comments/${currentUserId}/${commentIdDeleted}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // If deletion is successful, update the comments state to reflect the changes
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentIdDeleted)
        );
        setVisible(false);
        console.log("Comment deleted successfully");
        Notification.success(successMess2);
      } else {
        console.error("Failed to delete comment:", response);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisible(false);
    }
  };
  // Calculate average rating and rating percentages
  const calculateRatingStats = () => {
    const totalComments = comments.length;

    if (totalComments === 0) {
      return {
        averageRating: 0,
        ratingPercentages: Array(5).fill(0), // Assuming ratings are on a scale of 1 to 5
      };
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.grade,
      0
    );
    const averageRating = totalRating / totalComments;

    const ratingCounts = Array(5).fill(0);

    comments.forEach((comment) => {
      ratingCounts[comment.grade - 1]++;
    });

    const ratingPercentages = ratingCounts.map(
      (count) => (count / totalComments) * 100
    );

    return {
      averageRating,
      ratingPercentages,
      totalComments,
    };
  };

  const { averageRating, ratingPercentages, totalComments } =
    calculateRatingStats();
  useEffect(() => {
    getProductDetail();
    getComments(); // Call the function to get comments
    getCurrentUserIdFromCookies(); // Call the function to get the current user's ID
  }, []);
  return (
    <>
      <div className="ml-32">
        <Breadcrumb compact={false}>
          <Breadcrumb.Item
            icon={<IconHome />}
            href="/customerPage/home"
          ></Breadcrumb.Item>
          <Breadcrumb.Item
            icon={<IconShoppingBag />}
            href="/customerPage/product/product-list"
          >
            Product
          </Breadcrumb.Item>
          {product && <Breadcrumb.Item>{product.name}</Breadcrumb.Item>}
        </Breadcrumb>
      </div>
      <div className="max-w-7xl mx-auto my-4 px-4 flex flex-col lg:flex-row lg:justify-center lg:items-start lg:flex-wrap">
        {product && ( // Kiểm tra nếu có dữ liệu sản phẩm thì hiển thị
          <div className="flex flex-wrap mt-10 justify-center">
            <div className="w-full lg:w-96">
              <img
                className="w-full h-auto lg:h-96 "
                src={
                  product.thumbnailImage ||
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                }
                alt="Product Image"
              />
            </div>
            <div className="lg:w-7/12 ml-0 lg:ml-20 relative lg:flex justify-start flex-col xl:mt-0 mt-3">
              <div className="">
                <h1 className="font-bold text-xl lg:text-2xl mb-2">
                  {product.name}
                </h1>
                <p className="italic text-xl text-red-600 font-bold mb-2">
                  Price: {product.price} VND
                </p>
                <p className="w-auto mb-2 text-xl">
                  Available in stock:
                  <span> </span>
                  <span className="mb-2 text-lime-600 font-bold">
                    {product.stock}
                  </span>
                </p>
              </div>
              <div className="">
                <p className="mb-2 text-sm">{product.description}</p>
              </div>

              <div className="xl:absolute lg:static  md:static sm:static bottom-0 flex flex-col lg:w-7/12">
                <div className="flex items-center mb-2">
                  <label htmlFor="amount" className="mr-2">
                    Amount:{" "}
                  </label>
                  <div className="flex flex-row h-10 w-30 rounded-lg relative bg-transparent mt-1 border border-gray-200">
                    <button
                      data-action="decrement"
                      className=" bg-gray-200 text-black hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-l cursor-pointer outline-none"
                      onClick={() => decreaseQty(amount)}
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="focus:outline-none text-center w-10 bg-gray-200 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-900 custom-input-number"
                      name="custom-input-number"
                      value={amount}
                      readOnly
                    ></input>
                    <button
                      data-action="increment"
                      className="bg-gray-200 text-black hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-r cursor-pointer"
                      onClick={() => increaseQty(amount)}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
                <Link href={""}>
                  <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-black mt-5">
                    Add To Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full flex-wrap flex-col-reverse md:flex-row">
          <div className="w-full md:w-7/12 lg:w-7/12">
            {/* begin comment */}
            <div className="max-w-7xl mx-auto my-7 px-4">
              <h2 className="font-bold text-xl mb-5">Comment</h2>
              <div>
                <form onSubmit={formik.handleSubmit}>
                  <input
                    className="block w-11/12 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#beebc2] sm:text-sm sm:leading-6 ml-4 mb-2"
                    type="text"
                    placeholder="Give your comment here..."
                    name="content"
                    id="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.content && formik.errors.content ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.content}
                    </div>
                  ) : null}
                  <div className="ml-4">
                    <Rating
                      defaultValue={5}
                      onChange={(value) => {
                        setRating(value);
                        formik.setFieldValue("grade", value);
                      }}
                    />
                  </div>
                  <button
                    className="buttonGradient rounded-lg font-bold ml-4"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
              {currentPageData.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col justify-center ml-4 mt-2"
                >
                  <div className="flex items-center">
                    <img
                      className="rounded-full w-10 h-10 my-2 mr-1"
                      src={
                        comment.userAvatar ||
                        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                    ></img>
                    <p className="font-bold text-sm my-2">{comment.userName}</p>
                  </div>

                  {isUpdating && selectedCommentId === comment.id ? (
                    <>
                      <form onSubmit={formikUpdate.handleSubmit}>
                        <input
                          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#beebc2] sm:text-sm sm:leading-6 ml-4 mb-2"
                          type="text"
                          placeholder="Edit your comment here..."
                          name="content"
                          id="content"
                          value={selectedComment.content}
                          onChange={(e) =>
                            setSelectedComment({
                              ...selectedComment,
                              content: e.target.value,
                            })
                          }
                          onBlur={formikUpdate.handleBlur}
                        />
                        <div className="ml-4">
                          <Rating
                            defaultValue={selectedComment.grade}
                            onChange={(value) =>
                              setSelectedComment({
                                ...selectedComment,
                                grade: value,
                              })
                            }
                          />
                        </div>
                        <button
                          className="rounded-lg ml-4 w-20 bg-blue-600 text-white"
                          type="submit"
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-400 rounded-lg ml-4 w-20 text-white"
                          type="button"
                          onClick={() => cancelUpdate()}
                        >
                          Cancel
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="bg-[#CCE1C233] rounded-xl p-2 flex flex-row justify-between">
                      <div>
                        <p>{comment.content}</p>
                        <Rating value={comment.grade} disabled />
                      </div>
                      <div className="flex flex-row justify-end">
                        <div className="flex flex-col justify-center">
                          {/* Display delete button if the current user is the comment creator */}
                          {currentUserId === comment.userId && (
                            <>
                              <button
                                onClick={() => handleUpdateClick(comment.id)}
                                className="text-blue-500 cursor-pointer text-xs font-light rounded-md bg-white p-1 hover:bg-gray-200"
                              >
                                {isUpdating && selectedCommentId === comment.id
                                  ? "Updating"
                                  : "Update"}
                              </button>

                              <button
                                onClick={() => showDialog(comment.id)}
                                className="text-red-500 cursor-pointer mt-2 text-xs font-light rounded-md bg-white p-1 hover:bg-gray-200"
                              >
                                Delete
                              </button>
                              <Modal
                                title={
                                  <div className="text-center w-full">
                                    Delete Comment
                                  </div>
                                }
                                visible={visible}
                                onOk={deleteComment}
                                onCancel={handleCancel}
                                okText={"Yes, Delete"}
                                cancelText={"No, Cancel"}
                                okButtonProps={{
                                  style: {
                                    background: "rgba(222, 48, 63, 0.8)",
                                  },
                                }}
                              >
                                <p className="text-center text-base">
                                  Are you sure you want to delete?
                                </p>
                                <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                                  <p className="text-[#771505] flex items-center font-semibold">
                                    <IconAlertTriangle /> Warning
                                  </p>
                                  <p className="text-[#BC4C2E] font-medium">
                                    By Deleting this comment, the comment will
                                    be permanently deleted from the system.
                                  </p>
                                </div>
                              </Modal>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-center my-4">
                <Pagination
                  total={totalPages * 10}
                  currentPage={page}
                  onPageChange={onPageChange}
                ></Pagination>
              </div>
            </div>
            {/* end comment */}
          </div>
          <div className="w-full md:w-5/12 lg:w-5/12">
            {/* Display average rating and rating percentages */}
            <div className="max-w-7xl mx-auto my-7 px-4">
              <h2 className="font-bold text-xl mb-2">Rating Statistics</h2>
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-end">
                  <p className="text-4xl font-extrabold">
                    {averageRating.toFixed(1)}
                  </p>
                  <span className="text-md text-gray-400 ml-3 uppercase">
                    out of 5
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <Rating value={averageRating} disabled />
                  <p className="text-md text-gray-400">
                    {totalComments} ratings
                  </p>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-xl">1</p>
                    <IconStar className="text-yellow-400" />
                  </div>
                  <Progress
                    className="mx-3"
                    style={{ width: 240 }}
                    percent={ratingPercentages[0].toFixed(2)}
                    aria-label="download progress"
                  />
                  <p className="ml-2">{ratingPercentages[0].toFixed(2)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xl">2</p>
                    <IconStar className="text-yellow-400" />
                  </div>
                  <Progress
                    className="mx-3"
                    style={{ width: 240 }}
                    percent={ratingPercentages[1].toFixed(2)}
                    aria-label="download progress"
                  />
                  <p className="ml-2">{ratingPercentages[1].toFixed(2)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xl">3</p>
                    <IconStar className="text-yellow-400" />
                  </div>
                  <Progress
                    className="mx-3"
                    style={{ width: 240 }}
                    percent={ratingPercentages[2].toFixed(2)}
                    aria-label="download progress"
                  />
                  <p className="ml-2">{ratingPercentages[2].toFixed(2)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xl">4</p>
                    <IconStar className="text-yellow-400" />
                  </div>
                  <Progress
                    className="mx-3"
                    style={{ width: 240 }}
                    percent={ratingPercentages[3].toFixed(2)}
                    aria-label="download progress"
                  />
                  <p className="ml-2">{ratingPercentages[3].toFixed(2)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xl">5</p>
                    <IconStar className="text-yellow-400" />
                  </div>
                  <Progress
                    className="mx-3"
                    style={{ width: 240 }}
                    percent={ratingPercentages[4].toFixed(2)}
                    aria-label="download progress"
                  />
                  <p className="ml-2">{ratingPercentages[4].toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductDetail;

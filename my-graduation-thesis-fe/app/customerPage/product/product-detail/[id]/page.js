"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Modal, Skeleton } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import {
  Notification,
  Dropdown,
  Avatar,
  Typography,
  InputNumber,
} from "@douyinfe/semi-ui";
import { Rating } from "@douyinfe/semi-ui";
import { Progress } from "@douyinfe/semi-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IconStar } from "@douyinfe/semi-icons";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconShoppingBag } from "@douyinfe/semi-icons";
import { Pagination } from "@douyinfe/semi-ui";
import { useCart } from "../../../../../context/CartContext";
import { GoPencil } from "react-icons/go";
import { IoMdMore } from "react-icons/io";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/libs/commonFunction";
import ProductDetailScreen from "./ProductDetailScreen.css"; //css cua hieu dan
const ProductDetail = () => {
  const productId = useParams().id;
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState(1); // Giá trị ban đầu là 1
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rating, setRating] = useState(5); // Giá trị ban đầu của rating
  const [ids, setIds] = useState([]);
  const [page, setPage] = useState(1);
  const commentsPerPage = 3;
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const [loading, setLoading] = useState(false);
  const productsPerPage = 8;
  const [dataSourceProduct, setDataProduct] = useState([]);
  const [pageProduct, setPageProduct] = useState(1);
  const commentsPerPageProduct = 8;
  const initialized = useRef(false);
  const { Paragraph } = Typography;

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = comments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );
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
    formikUpdate.setFieldValue("id", selectedComment.id);
    formikUpdate.setFieldValue("grade", selectedComment.grade);
    formikUpdate.setFieldValue("content", selectedComment.content);
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
  const { cartItems, addToCart } = useCart();
  const handleAddToCart = () => {
    // Sản phẩm cần thêm vào giỏ hàng
    const productToAdd = {
      id: Number(productId),
      name: product.name,
      price: product.price, // Giá sản phẩm
      thumbnailImage: product.thumbnailImage,
      stock: product.stock,
    };
    addToCart(productToAdd, amount);
  };
  const handleChangeAmountInput = (value) => {
    // Cập nhật giá trị của tempQuantity

    const existingItemIndex = cartItems.findIndex(
      (item) => Number(item.id) === Number(productId)
    );
    // Check if the product already exists in the cart
    if (existingItemIndex !== -1) {
      const existingItem = cartItems[existingItemIndex];
      const totalQuantity = existingItem.quantity + value;

      // Check if the total quantity exceeds the stock limit
      if (totalQuantity > product.stock) {
        // Handle error (exceeding stock limit)
        Notification.warning({
          title: "Quantity Error",
          content: "Exceeding stock limit when product exist",
          with: 3,
        });
        setAmount(0);
        return;
      }
      setAmount(value);
    } else {
      // Check if the input amount exceeds the stock limit
      if (value > product.stock) {
        // Handle error (exceeding stock limit)
        Notification.warning({
          title: "Quantity",
          content: "Quantity can not be greater than stock",
          with: 3,
        });
        return;
      } else {
        setAmount(value);
      }
    }
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
  const router = useRouter();
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
        if (!userId) {
          Notification.error({
            title: "Error",
            content: "You must be logged in to comment on this product",
            duration: 5,
            theme: "light",
          });
          router.push("/auth/login");
        } else {
          values.userId = userId;
          values.productId = Number(productId);
          const bearerToken = Cookies.get("token");
          const response = await fetch(
            `https://erscus.azurewebsites.net/api/Comments`,
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
            resetForm();
            // Ẩn form sau khi submit
            getComments();
          } else {
            let idsTmp = [...ids];
            Notification.close(idsTmp.shift());
            setIds(idsTmp);
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred at catch:", error);
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
    validationSchema: Yup.object({
      content: Yup.string().required("Comment can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const userId = Cookies.get("userId");
        const bearerToken = Cookies.get("token");
        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Comments/${userId}/${selectedCommentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
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

  // API Add view count
  const addViewCount = async () => {
    try {
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Products/AddViewcount?productId=${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // console.log("Add View Count for product successfully");
      } else {
        console.error("Failed to add View Count for product:", response);
      }
    } catch (error) {
      console.error("Error add View Count for product:", error);
    }
  };

  // API to get comments for the product
  const getComments = async () => {
    try {
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Comments/getAll?productId=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const commentsData = await response.json();
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
        `https://erscus.azurewebsites.net/api/Comments/${currentUserId}/${commentIdDeleted}`,
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

  const getProductDetail = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Products/${productId}  `,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const detailProductData = await response.json();
        setProduct(detailProductData);
        return detailProductData.categories;
        // Xử lý dữ liệu product detail ở đây, có thể hiển thị trong modal hoặc component riêng
      } else {
        console.error("Failed to fetch product detail:", response);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  const setMaxHeight = async () => {
    const elements = document.querySelectorAll(".line-clamp-2");
    let maxHeight = 0;
    elements.forEach((element) => {
      // Your logic here to handle each element
      const height = element.offsetHeight;
      maxHeight = Math.max(maxHeight, height);
    });
    elements.forEach((element) => {
      element.style.height = maxHeight + "px";
      element.style.overflow = "hidden";
    });
  };

  const { averageRating, ratingPercentages, totalComments } =
    calculateRatingStats();

  useEffect(() => {
    //api get detail product

    getProductDetail();
    if (!initialized.current) {
      initialized.current = true;
      addViewCount();
    }
    setMaxHeight();
    getComments(); // Call the function to get comments
    getCurrentUserIdFromCookies(); // Call the function to get the current user's ID
    getCategories();
    fetchData();
  }, [amount]);

  // Handle datetime
  const TimeAgo = ({ date }) => {
    // Tính sự chênh lệch giữa thời gian hiện tại và dateCreated
    const timeDiff = new Date() - new Date(date + "Z");

    // Chuyển đổi sự chênh lệch thành năm, tháng, ngày, giờ, phút hoặc giây
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30 * 12));
    const months = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30)
    );
    const days = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Xác định và trả về kết quả phù hợp
    if (years > 0) {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(years)} about years ago
        </span>
      );
    } else if (months > 0) {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(months)} months ago
        </span>
      );
    } else if (days > 0) {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(days)} days ago
        </span>
      );
    } else if (hours > 0) {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(hours)} hours ago
        </span>
      );
    } else if (minutes > 0) {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(minutes)} minutes ago
        </span>
      );
    } else {
      return (
        <span className="text-sm font-light">
          Updated {Math.abs(seconds)} seconds ago
        </span>
      );
    }
  };
  // End handle datetime

  // ** Handle Related Product **
  const getCategories = async () => {
    const res = await fetch(`https://erscus.azurewebsites.net/api/Categories`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    return data;
  };

  const getAllData = async () => {
    let dataCategory;
    await getCategories().then((result) => {
      dataCategory = result;
    });

    let dataCategoryProduct;
    await getProductDetail().then((result) => {
      dataCategoryProduct = result;
    });

    // Mảng mới để lưu ID tương ứng
    const categoryIdArray = [];

    // Duyệt qua từng phần tử trong mảng categories
    dataCategoryProduct.forEach((category) => {
      // Tìm đối tượng có name trùng với category trong listCategories
      const foundCategory = dataCategory.find((item) => item.name === category);
      if (foundCategory) {
        // Nếu tìm thấy, thêm ID của đối tượng đó vào mảng mới
        categoryIdArray.push(foundCategory.id);
      }
    });
    const allData = [];

    // Duyệt qua từng categoryId trong mảng categoryIdArray
    for (const categoryId of categoryIdArray) {
      try {
        let storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
        } else {
          storedLanguage = "en"; // Gán giá trị mặc định là "en" nếu không có trong localStorage
        }
        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Products/GetAllProductActive?LanguageId=${storedLanguage}&CategoryId=${categoryId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          allData.push(data); // Thêm dữ liệu vào mảng allData
        } else {
          console.error("Failed to fetch data for categoryId:", categoryId);
        }
      } catch (error) {
        console.error("Error fetching data for categoryId:", categoryId, error);
      }
    }

    return allData;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllData();
      setMaxHeight();
      const mergedData = [].concat(...data);
      const idSet = new Set();
      const uniqueData = mergedData.filter((item) => {
        if (!idSet.has(item.id)) {
          idSet.add(item.id); // Đánh dấu id đã xuất hiện
          return true; // Giữ lại phần tử trong mảng
        }
        return false; // Loại bỏ phần tử trùng lặp
      });
      const updatedDataProduct = uniqueData.filter(
        (item) => item.id != productId
      );
      setDataProduct(updatedDataProduct);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChangeProduct = (currentPageProduct) => {
    setPageProduct(currentPageProduct);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageDataProduct = dataSourceProduct.slice(
    (pageProduct - 1) * productsPerPage,
    pageProduct * productsPerPage
  );

  return (
    <>
      <LocaleProvider locale={en_US}>
        <Modal
          title={<div className="text-center w-full">Delete Comment</div>}
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
            <p className="text-[#771505] flex items-center font-semibold gap-1">
              <IconAlertTriangle /> Warning
            </p>
            <p className="text-[#BC4C2E] font-medium">
              By Deleting this comment, the comment will be permanently deleted
              from the system.
            </p>
          </div>
        </Modal>

        <div className="max-w-7xl mx-auto my-4 px-4">
          <div className="p-[7px] bg-[#eee]">
            <Breadcrumb compact={false}>
              <Breadcrumb.Item icon={<IconHome />}>
                <Link href="/customerPage/home">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item icon={<IconShoppingBag />}>
                <Link href="/customerPage/product/product-list"> Product</Link>
              </Breadcrumb.Item>
              {product && (
                <Breadcrumb.Item noLink={true}>{product.name}</Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 px-4 min-h-[100vh]">
          {product && ( // Kiểm tra nếu có dữ liệu sản phẩm thì hiển thị
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 md:gap-3">
              <div className="">
                <img
                  className="w-full max-h-[496px] object-contain"
                  src={
                    product.thumbnailImage ||
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  }
                  alt="Product Image"
                />
              </div>

              <div className="mt-2">
                <h1 className="font-normal text-xl text-[#74A65D] lg:text-2xl mb-2">
                  {product.name}
                </h1>
                <p className="text-base mb-2">
                  Price:{" "}
                  <span className="text-[#fe7314] text-xl">
                    {formatCurrency(product.price)} đ
                  </span>
                </p>
                {/* <p className="w-auto mb-2 text-xl">
                  Available in stock:
                  <span className="mb-2 text-lime-600 font-bold">
                    {product.stock}
                  </span>
                </p> */}
                <p
                  className="mb-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                ></p>

                <div className="flex items-center mb-2">
                  <label htmlFor="amount" className="mr-2">
                    Amount:{" "}
                  </label>
                  <div className="flex h-10 w-30 rounded-lg relative bg-transparent">
                    <InputNumber
                      type="number"
                      className="items-center"
                      defaultValue={amount}
                      placeholder=""
                      style={{ width: "80px" }}
                      min={1}
                      max={product.stock}
                      id="amount"
                      name="amount"
                      onChange={(value) => handleChangeAmountInput(value)}
                    />
                  </div>
                  <p className="text-lg font-medium mr-2 ml-4">
                    {product.stock}
                  </p>
                  <span className="text-gray-400">products available</span>
                </div>

                {product.stock > 0 ? (
                  <button
                    className="w-[192px] h-auto p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] rounded-lg font-bold"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add To Cart
                  </button>
                ) : (
                  // Nếu không có hàng, hiển thị nút Out of Stock và làm cho nút bị vô hiệu hóa
                  <button
                    className="h-auto p-2 bg-gray-300 border border-gray-400 w-[192px] rounded-lg font-bold cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="w-full border-b-2 border-[#000000] text-[#44703D] text-2xl mt-4">
            Feedback
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-2 md:mt-0">
            <div className="w-full border-b-2 pb-5 md:border-b-0 md:pb-0 md:mt-3">
              {/* Display average rating and rating percentages */}
              <div className="border-b-2 pb-5">
                <h2 className="text-xl mb-2">Rating Statistics</h2>
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
                      size="large"
                      className="mx-3"
                      style={{ width: "100%" }}
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
                      size="large"
                      className="mx-3"
                      style={{ width: "100%" }}
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
                      size="large"
                      className="mx-3"
                      style={{ width: "100%" }}
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
                      size="large"
                      className="mx-3"
                      style={{ width: "100%" }}
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
                      size="large"
                      className="mx-3"
                      style={{ width: "100%" }}
                      percent={ratingPercentages[4].toFixed(2)}
                      aria-label="download progress"
                    />
                    <p className="ml-2">{ratingPercentages[4].toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              {currentPageData.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col justify-center mt-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center mb-2">
                      <Avatar
                        size="default"
                        shape="circle"
                        src={
                          comment.userAvatar ||
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                        }
                      ></Avatar>
                      <div>
                        <p className="text-lg">{comment.userName}</p>
                        {comment.modifieddAt == null ? (
                          <TimeAgo date={comment.createdAt} />
                        ) : (
                          <TimeAgo date={comment.modifieddAt} />
                        )}
                      </div>
                    </div>
                    {currentUserId === comment.userId && (
                      <>
                        <Dropdown
                          trigger={"click"}
                          position={"bottomRight"}
                          render={
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleUpdateClick(comment.id)}
                              >
                                {isUpdating && selectedCommentId === comment.id
                                  ? "Updating"
                                  : "Update"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={() => showDialog(comment.id)}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          }
                        >
                          <div>
                            <IoMdMore className="cursor-pointer text-lg" />
                          </div>
                        </Dropdown>
                      </>
                    )}
                  </div>

                  {isUpdating && selectedCommentId === comment.id ? (
                    <>
                      <form onSubmit={formikUpdate.handleSubmit}>
                        <div className="">
                          <Rating
                            onChange={(value) => {
                              formikUpdate.setFieldValue("grade", value);
                            }}
                            onBlur={formikUpdate.handleBlur}
                            value={formikUpdate.values.grade}
                          />
                        </div>

                        <textarea
                          name="content"
                          id="content"
                          placeholder="Give your comment here..."
                          rows={4}
                          cols={40}
                          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                          value={formikUpdate.values.content}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.content &&
                        formikUpdate.errors.content ? (
                          <div className="text-sm text-red-600 dark:text-red-400">
                            {formikUpdate.errors.content}
                          </div>
                        ) : null}

                        <div className="text-right">
                          <button
                            className="p-1 rounded-lg w-20 bg-[#74A65D] text-white hover:bg-[#44703D]"
                            type="submit"
                          >
                            Update
                          </button>
                          <button
                            className="p-1 rounded-lg ml-4 w-20 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                            type="button"
                            onClick={() => cancelUpdate()}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="ml-12 flex flex-row justify-between border-b border-solid border-[#cccccc] pb-3">
                      <div>
                        <Rating size="small" value={comment.grade} disabled />
                        <Paragraph
                          className="text-sm"
                          ellipsis={{
                            rows: 3,
                            expandable: true,
                            collapsible: true,
                            collapseText: "Show Less",
                            onExpand: (bool, e) => console.log(bool, e),
                          }}
                        >
                          {comment.content}
                        </Paragraph>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {comments.length != 0 ? (
                <div className="flex justify-center mt-5 md:my-4">
                  <Pagination
                    total={totalPages * 10}
                    currentPage={page}
                    onPageChange={onPageChange}
                  ></Pagination>
                </div>
              ) : null}
            </div>
            <div className="mt-3 w-full col-start-1 row-start-1 md:col-start-auto md:row-start-auto mb-4 md:mb-0">
              {/* begin comment */}
              <div className="">
                <div className="w-full flex justify-between mb-2">
                  <h2 className="text-xl">Comment</h2>
                  <div className="flex items-center gap-1 opacity-80">
                    <p>Write a comment </p>
                    <GoPencil />
                  </div>
                </div>

                {/* Phần form comment */}

                <div className="comment-submit shadow-md z-10 !rounded-xl border p-3">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="">
                      <p className="font-semibold">Rate: </p>
                      <Rating
                        defaultValue={5}
                        onChange={(value) => {
                          setRating(value);
                          formik.setFieldValue("grade", value);
                        }}
                      />
                    </div>
                    <div className="w-full mb-[6px]">
                      <p className="font-semibold">Review: </p>
                      <textarea
                        name="content"
                        id="content"
                        placeholder="Give your comment here..."
                        rows={6}
                        cols={40}
                        className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.content && formik.errors.content ? (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          {formik.errors.content}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="bg-[#74A65D] rounded-xl text-white px-4 py-2 hover:bg-white hover:text-[#74A65D] border-2 border-[#74A65D]"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* end comment */}
            </div>
          </div>

          <div className="w-full border-b-2 border-[#000000] text-[#44703D] text-2xl mt-4">
            Related Product
          </div>

          <div className="my-4">
            {currentPageDataProduct == "" ? (
              <div className="overflow-x-auto">
                <div className="flex flex-col items-center">
                  <Empty
                    image={
                      <IllustrationNoResult
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    darkModeImage={
                      <IllustrationNoResultDark
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    description={
                      <p className="font-semibold text-2xl">Not Found</p>
                    }
                    className="p-6 pb-1"
                  />
                </div>
              </div>
            ) : (
              <div className="grid-cols-1 gap-3 sm:grid-cols-2 grid lg:grid-cols-4 m-auto place-items-center">
                {currentPageDataProduct.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    class="h-full rounded-lg outline outline-1 outline-[#74A65D] col-span-1 flex flex-col bg-white p-2"
                  >
                    <div className="flex flex-wrap mb-2">
                      <Skeleton
                        loading={loading}
                        style={{
                          width: "auto",
                          height: "256px",
                          background: "#cccccc",
                        }}
                      >
                        <img
                          className="relative aspect-square"
                          src={
                            product.thumbnailImage ||
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                          }
                          alt="Product Thumbnail"
                        />
                      </Skeleton>
                    </div>

                    <h2 className="mb-2 font-medium text-xl line-clamp-2 hover:text-[#74A65D]">
                      <Link
                        href={`/customerPage/product/product-detail/${product.id}`}
                      >
                        <Skeleton
                          loading={loading}
                          style={{
                            width: "290px",
                            height: "26px",
                            background: "#cccccc",
                          }}
                        >
                          {product.name}
                        </Skeleton>
                      </Link>
                    </h2>
                    <Skeleton
                      loading={loading}
                      style={{
                        width: "290px",
                        height: "72px",
                        background: "#cccccc",
                        marginTop: "4px",
                      }}
                    >
                      <p
                        className="line-clamp-3 mt-2 text-justify"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      ></p>
                    </Skeleton>
                    <div class="flex flex-wrap mt-auto pt-3 justify-center">
                      <div className="flex gap-2 items-center my-4">
                        <Skeleton
                          loading={loading}
                          style={{
                            width: "100px",
                            height: "28px",
                            background: "#cccccc",
                            textAlign: "center",
                          }}
                        >
                          <h5 className="text-md text-[#cccccc] line-through">
                            {formatCurrency(product.originalPrice)} đ
                          </h5>
                          <h5 className="text-xl text-[#fe7314] font-semibold">
                            {formatCurrency(product.price)} đ
                          </h5>
                        </Skeleton>
                      </div>

                      {/* Kiểm tra nếu sản phẩm có hàng */}
                      {product.stock > 0 ? (
                        <button
                          className="h-[42px] p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] w-full rounded-lg font-bold"
                          onClick={() =>
                            addToCart(
                              {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                thumbnailImage: product.thumbnailImage,
                                stock: product.stock,
                                quantity: 1,
                              },
                              1
                            )
                          }
                        >
                          Add To Cart
                        </button>
                      ) : (
                        // Nếu không có hàng, hiển thị nút Out of Stock và làm cho nút bị vô hiệu hóa
                        <button
                          className="h-[42px] p-2 border bg-gray-300 border-gray-400 w-full rounded-lg font-bold cursor-not-allowed"
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};
export default ProductDetail;

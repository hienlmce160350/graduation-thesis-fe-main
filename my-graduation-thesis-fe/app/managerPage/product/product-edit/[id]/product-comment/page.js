"use client";
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
  Pagination,
  Empty,
} from "@douyinfe/semi-ui";
import { useEffect, useState, useRef } from "react";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../../../context/withAuth";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import Link from "next/link";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";

/* The following is available after version 1.13.0 */

const ProductComment = () => {
  const productId = useParams().id;
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState([]);
  const { Paragraph, Title } = Typography;

  const [pageComment, setPageComment] = useState(1);
  const commentsPerPage = 3;
  const totalPagesComment = Math.ceil(comments.length / commentsPerPage);

  const [commentIdDeleted, setCommentIdDeleted] = useState();
  // Hàm xử lý sự kiện thay đổi trang
  const onPageChangeComment = (currentPageComment) => {
    setPageComment(currentPageComment);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageDataComment = comments.slice(
    (pageComment - 1) * commentsPerPage,
    pageComment * commentsPerPage
  );

  let errorMessComment = {
    title: "Error",
    content: "Deleting comment could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMessComment = {
    title: "Success",
    content: "Comment Deleted Successfully.",
    duration: 3,
    theme: "light",
  };

  const fetchProductData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
        setComments(data.commentsList);
      } else {
        notification.error({
          message: "Failed to fetch comment data",
        });
      }
    } catch (error) {
      console.error("Error fetching comment data", error);
    }
  };

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
        `https://ersmanager.azurewebsites.net/api/Comments/${commentIdDeleted}`,
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
        Notification.success(successMessComment);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete comment");
        Notification.error(errorMessComment);
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

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No Comment"}
    />
  );

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <>
      <div className="mx-auto w-full mt-3 h-fit">
        <div className="flex items-center mb-3 gap-2">
          <Link
            href={`/managerPage/product/product-list`}
            className="hover:text-[#74A65D] hover:opacity-100"
          >
            <h2 className="text-2xl opacity-65">Product Management</h2>
          </Link>

          <span className="text-base opacity-65">{">"}</span>
          <h2 className="text-2xl opacity-65">Comments </h2>
          <span className="text-base opacity-65">{">"}</span>
          <Title
            heading={5}
            ellipsis={{ showTooltip: true }}
            className="font-semibold text-xl"
          >
            {product.name}
          </Title>
        </div>

        <div className="bg-white h-fit m-auto p-7 rounded-[4px] border">
          {currentPageDataComment.length == 0 ? <>{empty}</> : null}
          {currentPageDataComment.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col justify-center mt-2 p-3 border rounded-[10px]"
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
                  <div className="text-sm font-normal">
                    <p className="text-lg font-semibold">{comment.userName}</p>
                    <p className="opacity-80 text-sm font-normal">
                      {convertDateStringToFormattedDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
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
                    cursor: "pointer",
                    transition: "all 0.5s ease",
                  }}
                  onClick={() => showDialog(comment.id)}
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
                {/* Move Modal outside of List */}
                <Modal
                  title={
                    <div className="text-center w-full">Delete Comment</div>
                  }
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText={"Yes, Delete"}
                  cancelText={"No, Cancel"}
                  okButtonProps={{
                    type: "danger",
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
                      By Deleting this comment, the comment will be permanently
                      deleted from the system.
                    </p>
                  </div>
                </Modal>
              </div>
              <div className="ml-12 flex flex-row justify-between">
                <div>
                  <Rating size="large" value={comment.grade} disabled />
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
            </div>
          ))}

          {currentPageDataComment.length != 0 ? (
            <>
              <div className="flex justify-center my-4">
                <Pagination
                  className="text-white"
                  total={totalPagesComment * 10}
                  currentPage={pageComment}
                  onPageChange={onPageChangeComment}
                ></Pagination>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default withAuth(ProductComment, "manager");

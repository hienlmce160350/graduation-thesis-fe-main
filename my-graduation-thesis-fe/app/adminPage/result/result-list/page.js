"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Avatar,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Input,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle, IconSearch } from "@douyinfe/semi-icons";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import styles from "./VerifierScreen.module.css";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { IconMore } from "@douyinfe/semi-icons";
import { Notification } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { FaPaperPlane } from "react-icons/fa";
import { withAuth } from "../../../../context/withAuth";

const { Text } = Typography;

const ResultManagement = () => {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const [ids, setIds] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Deleting result could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Result Deleted Successfully.",
    duration: 3,
    theme: "light",
  };

  let sendResultSuccessMess = {
    title: "Success",
    content: "Send Result to Email Successfully.",
    duration: 3,
    theme: "light",
  };

  let sendResultErrorMess = {
    title: "Error",
    content: "Send Result to Email could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let emailNotFoundErrorMess = {
    title: "Error",
    content: "Email not found. Please try again.",
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

  // test filter
  const [filteredValue, setFilteredValue] = useState([]);
  const compositionRef = useRef({ isComposition: false });

  const handleChange = (value) => {
    if (compositionRef.current.isComposition) {
      return;
    }
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  const handleCompositionStart = () => {
    compositionRef.current.isComposition = true;
  };

  const handleCompositionEnd = (event) => {
    compositionRef.current.isComposition = false;
    const value = event.target.value;
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  // end test filter

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = (productId) => {
    setVisible(true);
    setProductIdDeleted(productId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete result
      const response = await fetch(
        `https://ersverifierapi.azurewebsites.net/api/Result/Delete/${productIdDeleted}`,
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
        setProductIdDeleted(0);
        fetchData();
        setVisible(false);
        console.log("Result deleted successfully");
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete result");
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
    setProductIdDeleted(0);
    setVisible(false);
  };

  // end modal

  // send Result to Email
  const sendResult = async (resultId, email) => {
    const bearerToken = Cookies.get("token");
    let id = Notification.info(loadingMess);
    setIds([...ids, id]);
    fetch(
      `https://ersverifierapi.azurewebsites.net/api/Result/GetResultEmail/${email}?id=${resultId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(sendResultSuccessMess);
        } else {
          // Failure logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          if (data.message == "Email not found") {
            Notification.error(emailNotFoundErrorMess);
          } else {
            Notification.error(sendResultErrorMess);
          }
          console.error("Send Result to Email failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  // End send Result to Email

  // Update IsSend
  const updateIsSend = async (id, email) => {
    const bearerToken = Cookies.get("token");
    const requestBody = {
      isSended: true,
    };
    fetch(
      `https://ersverifierapi.azurewebsites.net/api/Result/UpdateIsSend/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        if (response.ok) {
          sendResult(id, email);
          fetchData();
        } else {
          console.error("Update IsSend failed");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // End Update IsSend

  const columns = [
    {
      title: "Result Title",
      dataIndex: "title",
    },
    {
      title: "Email",
      dataIndex: "email",
      onFilter: (value, record) => record.email.includes(value),
      filteredValue,
    },
    {
      title: "Result Date",
      dataIndex: "resultDate",
      render: (text, record, index) => {
        const date = new Date(text);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        let statusColor, statusText;

        switch (text) {
          case 0:
            statusColor = "blue";
            statusText = "In Progress";
            break;
          case 1:
            statusColor = "green";
            statusText = "Confirmed";
            break;
          case 2:
            statusColor = "red"; // Chọn màu tương ứng với Shipping
            statusText = "Rejected";
            break;
          default:
            statusColor = "black"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Unknown";
            break;
        }

        return (
          <>
            <div className="flex items-center gap-1">
              <div
                class={`bg-${statusColor}-500 border-3 border-${statusColor}-900 rounded-full shadow-md h-3 w-3`}
              ></div>
              <span style={{ color: statusColor }}>{statusText}</span>
            </div>
          </>
        );
      },
    },

    {
      title: "Is Send",
      dataIndex: "isSend",
      render: (text, record, index) => {
        return (
          <span style={{ color: text === false ? "red" : "green" }}>
            {text === false ? <FaTimes /> : <FaCheck />}
          </span>
        );
      },
    },

    {
      title: "",
      dataIndex: "operate",
      render: (text, record) => {
        return (
          <Dropdown
            trigger={"click"}
            position={"bottom"}
            render={
              <Dropdown.Menu>
                <Link href={`/adminPage/result/result-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit Result
                  </Dropdown.Item>
                </Link>
                {record.isSend === false ? (
                  <Dropdown.Item
                    onClick={() => updateIsSend(record.id, record.email)}
                  >
                    <FaPaperPlane className="pr-2 text-2xl" />
                    Send Result to Email
                  </Dropdown.Item>
                ) : null}

                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete Result
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete Result</div>
                    }
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
                      Are you sure you want to delete <b>{record.title}</b>?
                    </p>
                    <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                      <p className="text-[#771505] flex items-center font-semibold">
                        <IconAlertTriangle /> Warning
                      </p>
                      <p className="text-[#BC4C2E] font-medium">
                        By Deleteing this result, the result will be permanently
                        deleted from the system.
                      </p>
                    </div>
                  </Modal>
                </>
              </Dropdown.Menu>
            }
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        );
      },
    },
  ];

  const getData = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersverifierapi.azurewebsites.net/api/Result/getAll`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );

    let data = await res.json();
    console.log("data: " + JSON.stringify(data));
    setTotal(data.length);
    return data;
  };

  const fetchData = async (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataProduct;
    await getData().then((result) => {
      dataProduct = result;
    });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataProduct;
        console.log("Data fetch: " + data);
        let dataSource = data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        res(dataSource);
      }, 300);
    }).then((dataSource) => {
      setLoading(false);
      setData(dataSource);
    });
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="m-auto w-full mb-10">
          <h2 className="text-[32px] font-bold mb-3 ">Result Management</h2>
          <div className={styles.table}>
            <div className="mt-4 mb-4">
              <Input
                placeholder="Input filter email"
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onChange={handleChange}
                className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-green-500 !rounded-[10px] !w-2/5 !h-11 !border-2 border-solid !border-[#DDF7E3] !bg-white"
                showClear
                suffix={<IconSearch className="!text-2xl" />}
              />
            </div>
            <Table
              style={{ minHeight: "fit-content" }}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                currentPage,
                pageSize: 10,
                total: totalItem,
                onPageChange: handlePageChange,
              }}
              empty={empty}
              loading={loading}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};

// Sử dụng withAuth để bảo vệ trang với vai trò "admin"
export default withAuth(ResultManagement, "verifier");

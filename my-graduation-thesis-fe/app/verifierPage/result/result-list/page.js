"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Input,
  Select,
  Button,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle, IconSearch } from "@douyinfe/semi-icons";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
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
import { debounce } from "@/libs/commonFunction";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { FaPlus } from "react-icons/fa";

const ResultManagement = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [resultTitleDeleted, setResultTitleDeleted] = useState(false);
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
  const debouncedHandleChange = debounce(handleChange, 1000);
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

  // filter order status
  const [resultStatus, setResultStatus] = useState("");

  const handleResultStatusChange = (value) => {
    setResultStatus(value);
  };

  // end filter status

  // Delete All
  let errorMessCount = {
    title: "Delete selected items",
    content: "You have not selected any items to delete.",
    duration: 3,
    theme: "light",
  };

  const [delLoading, setDelLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [selectedCount, setSelectedCount] = useState(0);

  const showDialogSelect = () => {
    if (selectedCount == 0) {
      Notification.error(errorMessCount);
    } else {
      setVisible2(true);
    }
  };
  const [visible2, setVisible2] = useState(false);

  const deleteSelect = async () => {
    setDelLoading(true);
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      let response;
      for (const itemId of selectedRowKeys) {
        response = await fetch(
          `https://ersverifier.azurewebsites.net/api/Result/Delete/${itemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.ok) {
        // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
        setDelLoading(false);
        setSelectedRowKeys([]);
        fetchData();
        setVisible(false);
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete blog");
        setDelLoading(false);
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      setDelLoading(false);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setDelLoading(false);
      setVisible2(false);
    }
  };

  const handleCancelSelect = () => {
    setVisible2(false);
  };

  const rowSelection = useMemo(
    () => ({
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );

        setSelectedCount(selectedRows.length);

        selectedRows.forEach((items) => {
          console.log("Item Id: " + items.id);
        });
        const itemIds = selectedRows.map((item) => item.id);
        setSelectedRowKeys(itemIds);
      },
      // getCheckboxProps: (record) => ({
      //   disabled: record.name === "Michael James", // Column configuration not to be checked
      //   name: record.name,
      // })
    }),
    []
  );
  // End Delete All

  // modal
  const [visible, setVisible] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const showDialog = (resultId, resultTitle) => {
    setVisible(true);
    setResultTitleDeleted(resultTitle);
    setProductIdDeleted(resultId);
  };

  const handleOk = async () => {
    setLoadingDelete(true);
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete result
      const response = await fetch(
        `https://ersverifier.azurewebsites.net/api/Result/Delete/${productIdDeleted}`,
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
        setLoadingDelete(false);
        setVisible(false);
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        setLoadingDelete(false);
        console.error("Failed to delete result");
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      setLoadingDelete(false);
      console.error("An error occurred", error);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setLoadingDelete(false);
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
      `https://ersverifier.azurewebsites.net/api/Result/GetResultEmail/${email}?id=${resultId}`,
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
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(sendResultSuccessMess);
          fetchData();
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
      `https://ersverifier.azurewebsites.net/api/Result/UpdateIsSend/${id}`,
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
      onFilter: (value, record) =>
        record.email.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Result Date",
      dataIndex: "resultDate",
      render: (text, record, index) => {
        return <span>{convertDateStringToFormattedDate(text)}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        let statusColor, statusText, statusColorText;

        switch (text) {
          case 0:
            statusColor = "blue-600";
            statusText = "In Progress";
            statusColorText = "blue-500";
            break;
          case 1:
            statusColor = "green-400";
            statusText = "Confirmed";
            statusColorText = "green-400";
            break;
          case 2:
            statusColor = "red-400"; // Chọn màu tương ứng với Shipping
            statusText = "Rejected";
            statusColorText = "red-500";
            break;
          default:
            statusColor = "black-400"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Unknown";
            break;
        }

        return (
          <>
            <div className="flex items-center gap-1">
              <span class={`text-${statusColorText}`}>{statusText}</span>
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
          <>
            <Dropdown
              trigger={"click"}
              position={"bottomRight"}
              render={
                <Dropdown.Menu>
                  <Link href={`/verifierPage/result/result-edit/${record.id}`}>
                    <Dropdown.Item>
                      <FaPen className="pr-2 text-2xl" />
                      View Result Detail
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
                    <Dropdown.Item
                      onClick={() => showDialog(record.id, record.title)}
                    >
                      <FaTrashAlt className="pr-2 text-2xl" />
                      Delete Result
                    </Dropdown.Item>
                  </>
                </Dropdown.Menu>
              }
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>

            <Modal
              title={<div className="text-center w-full">Delete Result</div>}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText={"Yes, Delete"}
              cancelText={"No, Cancel"}
              okButtonProps={{
                type: "danger",
                style: { background: "rgba(222, 48, 63, 0.8)" },
              }}
              confirmLoading={loadingDelete}
            >
              <p className="text-center text-base">
                Are you sure you want to delete <b>{resultTitleDeleted}</b>?
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold gap-1">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  By Deleteing this result, the result will be permanently
                  deleted from the system.
                </p>
              </div>
            </Modal>
          </>
        );
      },
    },
  ];
  // API

  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersverifier.azurewebsites.net/api/Result/getAll?status=${encodeURIComponent(
        resultStatus
      )}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      let data = await res.json();
      data = data.map((item, index) => ({
        ...item,
        key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
      }));
      setLoading(false);
      return data;
    } else {
      setLoading(false);
    }
  };

  // End API
  const fetchData = async () => {
    try {
      const data = await getData();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );

  useEffect(() => {
    fetchData();
  }, [resultStatus]);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <Modal
          title={<div className="text-center w-full">Delete Result</div>}
          visible={visible2}
          onOk={deleteSelect}
          onCancel={handleCancelSelect}
          okText={"Yes, Delete"}
          cancelText={"No, Cancel"}
          okButtonProps={{
            type: "danger",
            style: { background: "rgba(222, 48, 63, 0.8)" },
          }}
          confirmLoading={delLoading}
        >
          <p className="text-center text-base">
            Are you sure you want to delete <b>{selectedCount} items</b>?
          </p>
          <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
            <p className="text-[#771505] flex items-center font-semibold gap-1">
              <IconAlertTriangle /> Warning
            </p>
            <p className="text-[#BC4C2E] font-medium">
              By Deleteing results, the results will be permanently deleted from
              the system.
            </p>
          </div>
        </Modal>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3 ">Result Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="flex w-full items-center mt-4 justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Input filter email"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
                <Select
                  onChange={handleResultStatusChange}
                  className="ml-3"
                  style={{ height: 44 }}
                  placeholder="Select Result Status"
                  loading={loading}
                  defaultValue={""}
                >
                  <Select.Option key={0} value={""}>
                    All Status
                  </Select.Option>
                  <Select.Option key={1} value={0}>
                    In Progress
                  </Select.Option>
                  <Select.Option key={2} value={1}>
                    Confirmed
                  </Select.Option>
                  <Select.Option key={3} value={2}>
                    Rejected
                  </Select.Option>
                </Select>
              </div>
              <div className="flex">
                <Button
                  loading={delLoading}
                  icon={<FaTrashAlt className="text-2xl text-white" />}
                  type="warning"
                  onClick={() => showDialogSelect()}
                  style={{ marginRight: 14 }}
                  className="!h-11 w-11 !bg-red-400 hover:!bg-red-500"
                  theme="solid"
                ></Button>
              </div>
            </div>
            <Table
              style={{ minHeight: "fit-content" }}
              columns={columns}
              dataSource={dataSource}
              rowSelection={rowSelection}
              empty={empty}
              loading={loading}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};
// Sử dụng withAuth để bảo vệ trang với vai trò "verifier"
export default withAuth(ResultManagement, "verifier");

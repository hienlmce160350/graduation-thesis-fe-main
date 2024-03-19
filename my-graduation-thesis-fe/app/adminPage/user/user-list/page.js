"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Input,
  Button
} from "@douyinfe/semi-ui";
import { IconAlertTriangle, IconSearch } from "@douyinfe/semi-icons";
import { IconMore } from "@douyinfe/semi-icons";
import { FaPen } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import Link from "next/link";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { Notification } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { FaPlus } from "react-icons/fa";

import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";

const UserManagement = () => {
  const [dataSource, setData] = useState([]);
  const [filteredValue, setFilteredValue] = useState([]);
  const [userIdDeleted, setUserIdDeleted] = useState(false);
  const [userIdBanned, setUserIdBanned] = useState(false);
  const [userStatusBanned, setUserStatusBanned] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const debouncedHandleChange = debounce(handleChange, 1000);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of user could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successBanMess = {
    title: "Success",
    content: "User Banned Successfully.",
    duration: 3,
    theme: "light",
  };

  let successUnBanMess = {
    title: "Success",
    content: "User Unbanned Successfully.",
    duration: 3,
    theme: "light",
  };

  let successDeleteMess = {
    title: "Success",
    content: "User Deleted Successfully.",
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
          `https://ersadmin.azurewebsites.net/api/Users/${itemId}`,
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
        Notification.success(successDeleteMess);
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

  const showDialog = (userId) => {
    setVisible(true);
    setUserIdDeleted(userId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersadmin.azurewebsites.net/api/Users/${userIdDeleted}`,
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
        setUserIdDeleted(0);
        fetchData();
        setVisible(false);
        Notification.success(successDeleteMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete user");
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setUserIdDeleted(0);
    setVisible(false);
  };

   // end modal

  // modal ban
  const [visibleB, setVisibleB] = useState(false);
  const showDialogBan = (userId, isBanned) => {
    setVisibleB(true);
    setUserIdBanned(userId);
    setUserStatusBanned(isBanned);
  };

  const handleOkBan = async () => {
    try {
      const bearerToken = Cookies.get("token");
      let response;
      if (userStatusBanned) {
        // Gọi API unban user
        response = await fetch(
          `https://ersadmin.azurewebsites.net/api/Users/BanAccount/${userIdBanned}/false`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
          setUserIdBanned(0);
          fetchData();
          setVisibleB(false);
          Notification.success(successUnBanMess);
        } else {
          // Xử lý khi có lỗi từ server
          console.error("Failed to ban user");
        }
      } else {
        // Gọi API ban user
        response = await fetch(
          `https://ersadmin.azurewebsites.net/api/Users/BanAccount/${userIdBanned}/true`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
          setUserIdBanned(0);
          fetchData();
          setVisibleB(false);
          Notification.success(successBanMess);
        } else {
          // Xử lý khi có lỗi từ server
          console.error("Failed to ban user");
        }
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisibleB(false);
    }
  };

  const handleCancelBan = () => {
    setUserIdBanned(0);
    setVisibleB(false);
  };
  // end modal ban

  // API

  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersadmin.azurewebsites.net/api/Users/GetAll`,
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

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record, index) => {
        if (text == null) {
          text = "Not Yet";
        }
        return <span>{text}</span>;
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record, index) => {
        if (text == null) {
          text = "Not Yet";
        }
        return <span>{text}</span>;
      },
    },
    {
      title: "User Name",
      dataIndex: "userName",
      onFilter: (value, record) =>
        record.userName.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dob",
      render: (text, record, index) => {
        return <span>{convertDateStringToFormattedDate(text)}</span>;
      },
    },
    {
      title: "isBanned",
      dataIndex: "isBanned",
      render: (text, record, index) => {
        return <span>{record.isBanned.toString()}</span>;
      },
      filters: [
        {
          text: "Banned",
          value: "true",
        },
        {
          text: "Not Banned",
          value: "false",
        },
      ],
      onFilter: (value, record) => record.isBanned.toString() == value,
    },
    {
      title: "",
      dataIndex: "operate",
      render: (text, record) => {
        return (
          <Dropdown
            trigger={"click"}
            position={"bottomRight"}
            render={
              <Dropdown.Menu>
                <Link href={`/adminPage/user/user-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    View User Detail
                  </Dropdown.Item>
                </Link>

                <Link href={`/adminPage/user/user-assign/${record.id}`}>
                  <Dropdown.Item>
                    <FaUserEdit className="pr-2 text-2xl" />
                    Assign Role
                  </Dropdown.Item>
                </Link>

                <Dropdown.Item
                  onClick={() => showDialogBan(record.id, record.isBanned)}
                >
                  {record.isBanned ? (
                    <>
                      <FaUserSlash className="pr-2 text-2xl" />
                      Unban User
                    </>
                  ) : (
                    <>
                      <FaUserSlash className="pr-2 text-2xl" />
                      Ban User
                    </>
                  )}
                </Dropdown.Item>

                <Modal
                  title={
                    <div className="text-center w-full">
                      {record.isBanned ? "Unban User" : "Ban User"}
                    </div>
                  }
                  visible={visibleB}
                  onOk={handleOkBan}
                  onCancel={handleCancelBan}
                  okText={record.isBanned ? "Yes, Unban" : "Yes, Ban"}
                  cancelText={"No, Cancel"}
                  okButtonProps={{
                    style: { background: "rgba(222, 48, 63, 0.8)" },
                  }}
                >
                  <p className="text-center text-base">
                    {record.isBanned ? (
                      <>
                        Are you sure you want to unban <b>{record.email}</b>?
                      </>
                    ) : (
                      <>
                        Are you sure you want to ban <b>{record.email}</b>?
                      </>
                    )}
                  </p>
                  <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                    <p className="text-[#771505] flex items-center font-semibold">
                      <IconAlertTriangle /> Warning
                    </p>
                    <p className="text-[#BC4C2E] font-medium">
                      {record.isBanned
                        ? "By Unbanning this user, the user will be unbanned from the system."
                        : "By Banning this user, the user will be banned from the system."}
                    </p>
                  </div>
                </Modal>
                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete User
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete User</div>
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
                      Are you sure you want to delete <b>{record.email}</b>?
                    </p>
                    <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                      <p className="text-[#771505] flex items-center font-semibold">
                        <IconAlertTriangle /> Warning
                      </p>
                      <p className="text-[#BC4C2E] font-medium">
                        By Deleteing this user, the user will be permanently
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
  }, []);

  return (
    <>
      <LocaleProvider locale={en_US}>
      <Modal
          title={<div className="text-center w-full">Delete User</div>}
          visible={visible2}
          onOk={deleteSelect}
          onCancel={handleCancelSelect}
          okText={"Yes, Delete"}
          cancelText={"No, Cancel"}
          okButtonProps={{
            style: { background: "rgba(222, 48, 63, 0.8)" },
          }}
        >
          <p className="text-center text-base">
            Are you sure you want to delete <b>{selectedCount} items</b>?
          </p>
          <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
            <p className="text-[#771505] flex items-center font-semibold">
              <IconAlertTriangle /> Warning
            </p>
            <p className="text-[#BC4C2E] font-medium">
              By Deleteing users, the users will be permanently deleted from the
              system.
            </p>
          </div>
        </Modal>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3">User Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
          <div className="flex w-full items-center mt-4 mb-4 justify-between">
              <div className="flex-1">
                <Input
                  placeholder="Input filter user name"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
              </div>
              <div>
                <Link href={`/adminPage/user/user-create`}>
                  <Button
                    loading={false}
                    icon={<FaPlus className="text-2xl text-white" />}
                    type="warning"
                    style={{ marginRight: 14 }}
                    className="!h-11 w-11 !bg-[#74A65D] hover:!bg-[#599146]"
                  ></Button>
                </Link>

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
              loading={loading}
              empty={empty}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};
// Sử dụng withAuth để bảo vệ trang với vai trò "admin"
export default withAuth(UserManagement, "admin");

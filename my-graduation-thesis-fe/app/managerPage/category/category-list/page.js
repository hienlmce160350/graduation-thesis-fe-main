"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Table,
  Empty,
  Modal,
  Dropdown,
  Button,
  Input,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { IconMore } from "@douyinfe/semi-icons";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../context/withAuth";
import { FaPlus } from "react-icons/fa";
import { Notification } from "@douyinfe/semi-ui";
import { debounce } from "@/libs/commonFunction";
import { IconSearch } from "@douyinfe/semi-icons";

const CategoryManagement = () => {
  const [dataSource, setData] = useState([]);
  const [userIdDeleted, setUserIdDeleted] = useState(false);
  const [cateNameDeleted, setCateNameDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Deleting category could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Category Deleted Successfully.",
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

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = (cateId, cateName) => {
    setVisible(true);
    setCateNameDeleted(cateName);
    setUserIdDeleted(cateId);
  };

  const handleOk = async () => {
    try {
      setLoadingDelete(true);
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Categories/${userIdDeleted}`,
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
        setLoadingDelete(false);
        setVisible(false);
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete category");
        setLoadingDelete(false);
        Notification.error(errorMess);
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
      setLoadingDelete(false);
      Notification.error(errorMess);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setLoadingDelete(false);
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setUserIdDeleted(0);
    setVisible(false);
  };

  // end modal

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
          `https://ersmanager.azurewebsites.net/api/Categories/${itemId}`,
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
        console.error("Failed to delete category");
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Category Name",
      dataIndex: "name",
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "",
      dataIndex: "operate",
      render: (text, record, index) => {
        return (
          <>
            <Dropdown
              trigger={"click"}
              position={"bottomRight"}
              render={
                <>
                  <Dropdown.Menu>
                    <Link
                      href={`/managerPage/category/category-edit/${record.id}`}
                    >
                      <Dropdown.Item>
                        <FaPen className="pr-2 text-2xl" />
                        Edit Category
                      </Dropdown.Item>
                    </Link>
                    <>
                      <Dropdown.Item
                        onClick={() => showDialog(record.id, record.name)}
                      >
                        <FaTrashAlt className="pr-2 text-2xl" />
                        Delete Category
                      </Dropdown.Item>
                    </>
                  </Dropdown.Menu>
                </>
              }
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
            <Modal
              title={<div className="text-center w-full">Delete Category</div>}
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
                Are you sure you want to delete <b>{cateNameDeleted}</b>?
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold gap-1">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  By Deleting this category, the category will be permanently
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
      `https://ersmanager.azurewebsites.net/api/Categories`,
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
  }, []);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <Modal
          title={<div className="text-center w-full">Delete Category</div>}
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
              By Deleting categories, the categories will be permanently deleted
              from the system.
            </p>
          </div>
        </Modal>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3">Category Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="flex w-full items-center mt-4 mb-4 justify-between min-w-[438px]">
              <div className="flex-1">
                <Input
                  placeholder="Input filter category name"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white min-w-[300px]"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
              </div>
              <div className="min-w-[116px]">
                <Link href={`/managerPage/category/category-create`}>
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
export default withAuth(CategoryManagement, "manager");

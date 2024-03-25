"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Input,
  Button,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle, IconSearch } from "@douyinfe/semi-icons";
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
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { FaPlus } from "react-icons/fa";
import { FaSyncAlt } from "react-icons/fa";

const PromotionManagement = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promotionIdStatus, setPromotionIdStatus] = useState(0);
  const [promotionStatus, setPromotionStatus] = useState(0);
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [promotionNameDeleted, setPromotionNameDeleted] = useState(false);
  const [promotionNameChanged, setPromotionNameChanged] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Deleting promotion could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let errorMessCount = {
    title: "Delete selected items",
    content: "You have not selected any items to delete.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Promotion Deleted Successfully.",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };

  let successActiveStatusMess = {
    title: "Success",
    content: "Voucher activated successfully.",
    duration: 3,
    theme: "light",
  };

  let successInactiveStatusMess = {
    title: "Success",
    content: "Voucher deactivated successfully.",
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

  const showDialog = (promotionId, promotionName) => {
    setVisible(true);
    setPromotionNameDeleted(promotionName);
    setProductIdDeleted(promotionId);
  };

  const handleOk = async () => {
    setLoadingDelete(true);
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Promotions/${productIdDeleted}`,
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
        console.error("Failed to delete promotion");
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

  // Update Status
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [visibleStatus, setVisibleStatus] = useState(false);
  const showDialogStatus = (promotionId, isStatus, promotionName) => {
    setVisibleStatus(true);
    setPromotionIdStatus(promotionId);
    setPromotionNameChanged(promotionName);
    setPromotionStatus(isStatus);
  };

  const handleOkStatus = async () => {
    try {
      const bearerToken = Cookies.get("token");
      let response;
      setLoadingStatus(true);
      if (promotionStatus == 0) {
        // Gọi API unban user
        let credentials = {
          promotionId: promotionIdStatus,
          status: 1,
        };
        response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Promotions/UpdateStatusOnly`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );

        if (response.ok) {
          // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
          setPromotionIdStatus(0);
          fetchData();
          setLoadingStatus(false);
          setVisibleStatus(false);
          Notification.success(successActiveStatusMess);
        } else {
          // Xử lý khi có lỗi từ server
          setLoadingStatus(false);
          console.error("Failed to change status of promotion");
        }
      } else {
        // Gọi API change status
        let credentials = {
          promotionId: promotionIdStatus,
          status: 0,
        };
        response = await fetch(
          `https://ersmanager.azurewebsites.net/api/Promotions/UpdateStatusOnly`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );

        if (response.ok) {
          // Xử lý thành công, có thể thêm logic thông báo hoặc làm gì đó khác
          setPromotionIdStatus(0);
          fetchData();
          setLoadingStatus(false);
          setVisibleStatus(false);
          Notification.success(successInactiveStatusMess);
        } else {
          // Xử lý khi có lỗi từ server
          setLoadingStatus(false);
          console.error("Failed to change status of promotion");
        }
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      setLoadingStatus(false);
      console.error("An error occurred", error);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setLoadingStatus(false);
      setVisibleStatus(false);
    }
  };

  const handleCancelStatus = () => {
    setPromotionIdStatus(0);
    setVisibleStatus(false);
  };
  // end modal ban
  // End Update Status

  // Delete All
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
          `https://ersmanager.azurewebsites.net/api/Promotions/${itemId}`,
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
        console.error("Failed to delete promotion");
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
      title: "Discount Code",
      dataIndex: "discountCode",
    },
    {
      title: "Promotion Name",
      dataIndex: "name",
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Discount Percent",
      dataIndex: "discountPercent",
    },
    {
      title: "Remain Voucher",
      dataIndex: "stock",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      render: (text, record, index) => {
        return <span>{convertDateStringToFormattedDate(text)}</span>;
      },
    },

    {
      title: "To Date",
      dataIndex: "toDate",
      render: (text, record, index) => {
        return <span>{convertDateStringToFormattedDate(text)}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        return (
          <span style={{ color: text === 0 ? "red" : "green" }}>
            {text === 0 ? "Inactive" : "Active"}
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
                  <Link
                    href={`/managerPage/promotion/promotion-edit/${record.id}`}
                  >
                    <Dropdown.Item>
                      <FaPen className="pr-2 text-2xl" />
                      View Promotion Detail
                    </Dropdown.Item>
                  </Link>

                  <Dropdown.Item
                    onClick={() =>
                      showDialogStatus(record.id, record.status, record.name)
                    }
                  >
                    {record.status == 0 ? (
                      <>
                        <FaSyncAlt className="pr-2 text-2xl" />
                        Activate Promotion
                      </>
                    ) : (
                      <>
                        <FaSyncAlt className="pr-2 text-2xl" />
                        Deactivate Promotion
                      </>
                    )}
                  </Dropdown.Item>

                  <>
                    <Dropdown.Item
                      onClick={() => showDialog(record.id, record.name)}
                    >
                      <FaTrashAlt className="pr-2 text-2xl" />
                      Delete Promotion
                    </Dropdown.Item>
                  </>
                </Dropdown.Menu>
              }
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
            <Modal
              title={<div className="text-center w-full">Delete Promotion</div>}
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
                Are you sure you want to delete <b>{promotionNameDeleted}</b>?
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  By Deleteing this promotion, the promotion will be permanently
                  deleted from the system.
                </p>
              </div>
            </Modal>

            <Modal
              title={
                <div className="text-center w-full">
                  {promotionStatus == 0
                    ? "Activate Promotion"
                    : "Deactivate Promotion"}
                </div>
              }
              visible={visibleStatus}
              onOk={handleOkStatus}
              onCancel={handleCancelStatus}
              okText={
                promotionStatus == 0 ? "Yes, Activate" : "Yes, Deactivate"
              }
              cancelText={"No, Cancel"}
              okButtonProps={{
                type: "danger",
                style: { background: "rgba(222, 48, 63, 0.8)" },
              }}
              confirmLoading={loadingStatus}
            >
              <p className="text-center text-base">
                {promotionStatus == 0 ? (
                  <>
                    Are you sure you want to activate{" "}
                    <b>{promotionNameChanged}</b>?
                  </>
                ) : (
                  <>
                    Are you sure you want to deactivate{" "}
                    <b>{promotionNameChanged}</b>?
                  </>
                )}
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  {promotionStatus == 0
                    ? "By Activating this promotion, the promotion will be activated from the system."
                    : "By Deactivating this promotion, the promotion will be deactivated from the system."}
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
      `https://ersmanager.azurewebsites.net/api/Promotions/getAll`,
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
          title={<div className="text-center w-full">Delete Promotion</div>}
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
            <p className="text-[#771505] flex items-center font-semibold">
              <IconAlertTriangle /> Warning
            </p>
            <p className="text-[#BC4C2E] font-medium">
              By Deleteing promotions, the promotion will be permanently deleted
              from the system.
            </p>
          </div>
        </Modal>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3 ">
            Promotion Management
          </h2>

          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="mt-4 mb-4 flex justify-between">
              <Input
                placeholder="Input filter promotion name"
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onChange={debouncedHandleChange}
                className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                showClear
                suffix={<IconSearch className="!text-2xl" />}
              />
              <div>
                <Link href={`/managerPage/promotion/promotion-create`}>
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
// Sử dụng withAuth để bảo vệ trang với vai trò "manager"
export default withAuth(PromotionManagement, "manager");

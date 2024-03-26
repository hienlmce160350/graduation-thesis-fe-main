"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  Avatar,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Select,
  Button,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { IconMore } from "@douyinfe/semi-icons";
import { Notification } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { FaComments } from "react-icons/fa";
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";
import { FaPlus } from "react-icons/fa";
import { formatCurrency } from "@/libs/commonFunction";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";

const { Text } = Typography;

const ProductManagement = () => {
  const [dataSource, setData] = useState([]);
  const [filteredValue, setFilteredValue] = useState([]);
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [productNameDeleted, setProductNameDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

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
    content: "Deleting product could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Product Deleted Successfully.",
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

  // filter language
  const [countryName, setCountryName] = useState("en");

  const handleCountryNameChange = (value) => {
    setCountryName(value);
  };

  // end filter language

  // filter category
  const [categoryName, setCategoryName] = useState("");

  const handleCategoryNameChange = (value) => {
    setCategoryName(value);
  };
  // end filter category

  // load API Cateogries
  const [categoriesData, setCategoriesData] = useState([]);
  // Load API Categories
  const fetchCategoriesData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Categories`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCategoriesData(data);
      } else {
        notification.error({
          message: "Failed to fetch categories data",
        });
      }
    } catch (error) {
      console.error("Error fetching categories data", error);
    }
  };
  // End load API Categories

  const list = [
    {
      id: "en",
      name: "USA",
      avatar: "/staticImage/usa-flag-round-circle-icon.svg",
    },
    {
      id: "vi",
      name: "VietNam",
      avatar: "/staticImage/vietnam-flag-round-circle-icon.svg",
    },
  ];

  const renderSelectedItem = (optionNode) => (
    <div
      key={optionNode.name}
      style={{ display: "flex", alignItems: "center" }}
    >
      <Avatar src={optionNode.avatar} size="small">
        {optionNode.abbr}
      </Avatar>
      <span style={{ marginLeft: 8 }}>{optionNode.name}</span>
    </div>
  );

  const renderCustomOption = (item, index) => {
    const optionStyle = {
      display: "flex",
      paddingLeft: 24,
      paddingTop: 10,
      paddingBottom: 10,
    };
    return (
      <Select.Option
        value={item.id}
        style={optionStyle}
        showTick={true}
        {...item}
        key={item.id}
      >
        <Avatar size="small" src={item.avatar} />
        <div style={{ marginLeft: 8 }}>
          <div style={{ fontSize: 14 }}>{item.name}</div>
        </div>
      </Select.Option>
    );
  };
  // end filter language

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = (productId, productName) => {
    setVisible(true);
    setProductNameDeleted(productName);
    setProductIdDeleted(productId);
  };

  const handleOk = async () => {
    try {
      setLoadingDelete(true);
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Products/${productIdDeleted}`,
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
        setLoadingDelete(false);
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete product");
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
    setProductIdDeleted(0);
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
          `https://ersmanager.azurewebsites.net/api/Products/${itemId}`,
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
      title: "Product Name",
      dataIndex: "name",
      render: (text, record, index) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={record.thumbnailImage}
              style={{ marginRight: 12 }}
            ></Avatar>
            {/* The width calculation method is the cell setting width minus the non-text content width */}
            <Text
              heading={5}
              ellipsis={{ showTooltip: true }}
            >
              {text}
            </Text>
          </span>
        );
      },
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record, index) => {
        return <span className="whitespace-nowrap">{formatCurrency(text)} đ</span>;
      },
    },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
      render: (text, record, index) => {
        return <span className="whitespace-nowrap">{formatCurrency(text)} đ</span>;
      },
    },
    {
      title: "Import Price",
      dataIndex: "cost",
      render: (text, record, index) => {
        return <span className="whitespace-nowrap">{formatCurrency(text)} đ</span>;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Views",
      dataIndex: "viewCount",
    },
    {
      title: "Date created",
      dataIndex: "dateCreated",
      render: (text, record, index) => {
        return <span className="whitespace-nowrap">{convertDateStringToFormattedDate(text)}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        let statusColor, statusText;

        switch (text) {
          case 0:
            statusColor =
              "bg-[#fef1f1] text-[#dc2828] border border-[#dc2828] w-fit rounded-md px-2 flex items-center whitespace-nowrap";
            statusText = "Inactive";
            break;
          case 1:
            statusColor =
              "bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2 flex items-center whitespace-nowrap";
            statusText = "Active";
            break;
        }

        return (
          <>
            <div className={statusColor}>{statusText}</div>
          </>
        );
      },
      filters: [
        {
          text: "Active",
          value: 1,
        },
        {
          text: "Inactive",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status.toString() == value,
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
                  <Link href={`/managerPage/product/product-edit/${record.id}`}>
                    <Dropdown.Item>
                      <FaPen className="pr-2 text-2xl" />
                      View Product Detail
                    </Dropdown.Item>
                  </Link>

                  <Link
                    href={`/managerPage/product/product-assign/${record.id}`}
                  >
                    <Dropdown.Item>
                      <TbCategoryPlus className="pr-2 text-2xl" />
                      Assign Category
                    </Dropdown.Item>
                  </Link>

                  <Link
                    href={`/managerPage/product/product-edit/${record.id}/product-comment`}
                  >
                    <Dropdown.Item>
                      <FaComments className="pr-2 text-2xl" />
                      Comments
                    </Dropdown.Item>
                  </Link>

                  <>
                    <Dropdown.Item
                      onClick={() => showDialog(record.id, record.name)}
                    >
                      <FaTrashAlt className="pr-2 text-2xl" />
                      Delete Product
                    </Dropdown.Item>
                  </>
                </Dropdown.Menu>
              }
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
            <Modal
              title={<div className="text-center w-full">Delete Product</div>}
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
                Are you sure you want to delete <b>{productNameDeleted}</b>?
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold gap-1">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  By Deleteing this product, the product will be permanently
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
      `https://ersmanager.azurewebsites.net/api/Products/GetAll?LanguageId=${encodeURIComponent(
        countryName
      )}&CategoryId=${encodeURIComponent(categoryName)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
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
    fetchCategoriesData();
    const adContainer = document.querySelector(
      'div[style="position: fixed; top: 10px; left: 10px; right: 10px; font-size: 14px; background: #EEF2FF; color: #222222; z-index: 999999999; text-align: left; border: 1px solid #EEEEEE; padding: 10px 11px 10px 50px; border-radius: 8px; font-family: Helvetica Neue, Helvetica, Arial;"]'
    );
    if (adContainer) {
      adContainer.style.display = "none";
    }
  }, [countryName, categoryName]);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <Modal
          title={<div className="text-center w-full">Delete Product</div>}
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
              By Deleteing products, the products will be permanently deleted
              from the system.
            </p>
          </div>
        </Modal>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-bold mb-3 ">Product Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="flex w-full items-center mt-4 justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Input filter product name"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="mr-3 transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
                <Select
                  placeholder="Please select country"
                  style={{ height: 44 }}
                  onChange={handleCountryNameChange}
                  defaultValue={"en"}
                  renderSelectedItem={renderSelectedItem}
                >
                  {list.map((item, index) => renderCustomOption(item, index))}
                </Select>
                <Select
                  onChange={handleCategoryNameChange}
                  className="ml-2"
                  style={{ height: 44 }}
                  placeholder="Select Categories"
                  loading={loading}
                  defaultValue={""}
                  position="bottomRight"
                >
                  <Select.Option key={0} value={""}>
                    All Categories
                  </Select.Option>
                  {categoriesData.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex">
                <Link href={`/managerPage/product/product-create`}>
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
              empty={empty}
              rowSelection={rowSelection}
              loading={loading}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};
// Sử dụng withAuth để bảo vệ trang với vai trò "admin"
export default withAuth(ProductManagement, "manager");

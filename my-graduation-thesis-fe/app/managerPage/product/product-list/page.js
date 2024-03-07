"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Avatar,
  Button,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Select,
} from "@douyinfe/semi-ui";
import { IconDelete, IconAlertTriangle } from "@douyinfe/semi-icons";
import { IconEdit } from "@douyinfe/semi-icons";
import styles from "./ProductScreen.module.css";
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
import { Form, Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../context/withAuth";

const { Text } = Typography;

const ProductManagement = () => {
  const [dataSource, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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
        `https://ersmanagerapi.azurewebsites.net/api/Categories?languageId=${encodeURIComponent(
          countryName
        )}`,
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

  const showDialog = (productId) => {
    setVisible(true);
    setProductIdDeleted(productId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Products/${productIdDeleted}`,
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
        handleSend();
        setVisible(false);
        console.log("Product deleted successfully");
        Notification.success(successMess);
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete product");
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
              style={{ width: "calc(400px - 76px)" }}
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
    },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
    },
    {
      title: "Import Price",
      dataIndex: "cost",
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Date created",
      dataIndex: "dateCreated",
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
          <Dropdown
            trigger={"click"}
            position={"bottom"}
            render={
              <Dropdown.Menu>
                <Link
                  href={`/managerPage/product/product-edit/${countryName}/${record.id}`}
                >
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    View Product Detail
                  </Dropdown.Item>
                </Link>

                <Link
                  href={`/managerPage/product/product-assign/${countryName}/${record.id}`}
                >
                  <Dropdown.Item>
                    <TbCategoryPlus className="pr-2 text-2xl" />
                    Assign Category
                  </Dropdown.Item>
                </Link>
                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete Product
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete Product</div>
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
                      Are you sure you want to delete <b>{record.name}</b>?
                    </p>
                    <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                      <p className="text-[#771505] flex items-center font-semibold">
                        <IconAlertTriangle /> Warning
                      </p>
                      <p className="text-[#BC4C2E] font-medium">
                        By Deleteing this product, the product will be
                        permanently deleted from the system.
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

  let count = 1;
  const handleSend = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Products/GetAll?LanguageId=${encodeURIComponent(
        countryName
      )}&CategoryId=${encodeURIComponent(categoryName)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    data = data.map((item, index) => ({
      ...item,
      key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
    }));
    setProductData(data);
    console.log("Data in send: " + JSON.stringify(data));
    setTotal(data.length);
    if (count == 1) {
      await fetchData(1, data, count);
      count += 1;
    } else {
      await fetchData(1);
    }
    return data;
  };

  const fetchData = async (currentPage, data, countFetch) => {
    setPage(currentPage);

    if (countFetch == 1) {
      console.log("Hello 1");
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log("Data fetch: " + data);
          console.log("Order List: " + JSON.stringify(data));
          let dataSource = data.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          console.log("Data Source: " + dataSource);
          res(dataSource);
        }, 300);
      }).then((dataSource) => {
        setLoading(false);
        setData(dataSource);
      });
    } else {
      console.log("Hello 2");
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log("Data fetch: " + productData);
          console.log("Order List: " + JSON.stringify(productData));
          let dataSource = productData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          console.log("Data Source: " + dataSource);
          res(dataSource);
        }, 300);
      }).then((dataSource) => {
        setLoading(false);
        setData(dataSource);
      });
    }
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  useEffect(() => {
    handleSend();
    fetchCategoriesData();
  }, [countryName, categoryName]);

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
          <h2 className="text-[32px] font-bold mb-3 ">Product Management</h2>
          <div className={styles.table}>
            <div className="flex w-full items-center mt-4 justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Input filter product name"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={handleChange}
                  className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-green-500 !rounded-[10px] !w-2/5 !h-11 !border-2 border-solid !border-[#DDF7E3] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
              </div>
              <div className="flex">
                <Select
                  placeholder="Please select country"
                  style={{ height: 40 }}
                  onChange={handleCountryNameChange}
                  defaultValue={"en"}
                  renderSelectedItem={renderSelectedItem}
                >
                  {list.map((item, index) => renderCustomOption(item, index))}
                </Select>
                <Select
                  onChange={handleCategoryNameChange}
                  className="ml-2"
                  style={{ height: 40 }}
                  placeholder="Select Categories"
                  loading={loading}
                  defaultValue={""}
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

export default withAuth(ProductManagement, "manager");

"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Avatar,
  Empty,
  Typography,
  Modal,
  Dropdown,
  Space,
} from "@douyinfe/semi-ui";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import styles from "./OrderScreen.module.css";
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
import { LocaleProvider, Form, Input, Select } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../context/withAuth";
import { title } from "process";

const { Text } = Typography;

const OrderManagement = () => {
  const [dataSource, setData] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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

  // filter order status
  const [orderStatus, setOrderStatus] = useState("");

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
  };

  // end filter status

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      onFilter: (value, record) =>
        record.orderCode.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Ship Address",
      dataIndex: "shipAddress",
    },
    {
      title: "Ship Email",
      dataIndex: "shipEmail",
    },
    {
      title: "Ship Phone Number",
      dataIndex: "shipPhoneNumber",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
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
            statusColor = "gray-200"; // Chọn màu tương ứng với Shipping
            statusText = "Shipping";
            statusColorText = "gray-600";
            break;
          case 3:
            statusColor = "green-400"; // Chọn màu tương ứng với Success
            statusText = "Success";
            statusColorText = "green-400";
            break;
          case 4:
            statusColor = "red-400"; // Chọn màu tương ứng với Canceled
            statusText = "Canceled";
            statusColorText = "red-500";
            break;
          default:
            statusColor = "black-400"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Unknown";
            statusColorText = "black-400";
            break;
        }

        return (
          <>
            <div className="flex items-center gap-1">
              <div
                class={`bg-${statusColor} border-3 border-${statusColor} rounded-full shadow-md h-3 w-3`}
              ></div>
              <span class={`text-${statusColorText}`}>{statusText}</span>
            </div>
          </>
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
                <Link href={`/managerPage/order/order-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit Order
                  </Dropdown.Item>
                </Link>
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
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetAllByOrderStatus?Status=${encodeURIComponent(
        orderStatus
      )}`,
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
    setDataOrder(data);
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
          console.log("Data fetch: " + dataOrder);
          console.log("Order List: " + JSON.stringify(dataOrder));
          let dataSource = dataOrder.slice(
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
  }, [orderStatus]);

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
          <h2 className="text-[32px] font-bold mb-3 ">Order Management</h2>
          <div className={styles.table}>
            <div className="flex w-full items-center mt-4 justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Input filter order code"
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
                  onChange={handleOrderStatusChange}
                  className="ml-2"
                  style={{ height: 40 }}
                  placeholder="Select Order Status"
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
                    Shipping
                  </Select.Option>
                  <Select.Option key={4} value={3}>
                    Success
                  </Select.Option>
                  <Select.Option key={5} value={4}>
                    Canceled
                  </Select.Option>
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

export default withAuth(OrderManagement, "manager");

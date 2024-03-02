"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Empty,
  Typography,
  Modal,
  Dropdown,
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
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // search
  const [orderCode, setOrderCode] = useState("");

  const handleOrderCodeChange = (value) => {
    setOrderCode(value);
  };
  // end search

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
        let statusColor, statusText;

        switch (text) {
          case 0:
            statusColor = "red";
            statusText = "In Progress";
            break;
          case 1:
            statusColor = "green";
            statusText = "Confirmed";
            break;
          case 2:
            statusColor = "blue"; // Chọn màu tương ứng với Shipping
            statusText = "Shipping";
            break;
          case 3:
            statusColor = "purple"; // Chọn màu tương ứng với Success
            statusText = "Success";
            break;
          case 4:
            statusColor = "gray"; // Chọn màu tương ứng với Canceled
            statusText = "Canceled";
            break;
          default:
            statusColor = "black"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Unknown";
            break;
        }

        return <span style={{ color: statusColor }}>{statusText}</span>;
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
                <Link href={`/adminPage/order/order-edit/${record.id}`}>
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

  const getData = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetAll`,
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

  const handleSend = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetAllByOrderStatus?Keyword=${encodeURIComponent(
        orderCode
      )}&Status=${encodeURIComponent(orderStatus)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let data = await res.json();
    console.log("Data in send: " + JSON.stringify(data));
    setTotal(data.length);
    fetchData(1, data);
    return data;
  };

  const fetchData = async (currentPage, data) => {
    setLoading(true);
    setPage(currentPage);

    return new Promise((res, rej) => {
      setTimeout(() => {
        console.log("Data fetch: " + data);
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
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  useEffect(() => {
    handleSend();
  }, [orderCode, orderStatus]);

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
              <Form className="flex-1">
                <Input
                  suffix={<IconSearch className="!text-2xl" />}
                  showClear
                  onChange={handleOrderCodeChange}
                  initValue={orderCode}
                  placeholder="Search by order code"
                  className="!rounded-[10px] !w-4/5 !h-11 !border-2 border-solid !border-[#DDF7E3] !bg-white"
                ></Input>
              </Form>
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
                  <Select.Option key={0} value={0}>
                    In Progress
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    Confirmed
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    Shipping
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    Success
                  </Select.Option>
                  <Select.Option key={4} value={4}>
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

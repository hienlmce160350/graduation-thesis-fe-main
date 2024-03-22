"use client";
import React, { useEffect, useState, useRef } from "react";
import { Table, Empty, Dropdown } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { IconMore } from "@douyinfe/semi-icons";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider, Input, Select } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { formatCurrency } from "@/libs/commonFunction";

const OrderManagement = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const [orderStatus, setOrderStatus] = useState("");

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
  };

  // end filter status

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      onFilter: (value, record) =>
        record.orderCode.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Ship Email",
      dataIndex: "shipEmail",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
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
            statusColor =
              "bg-[#f0f6ff] text-[#2463eb] border border-[#2463eb] w-fit rounded-md px-2 flex items-center";
            statusText = "In Progress";
            break;
          case 1:
            statusColor =
              "bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2 flex items-center";
            statusText = "Confirmed";
            break;
          case 2:
            statusColor =
              "bg-[#fefce7] text-[#c88a04] border border-[#c88a04] w-fit rounded-md px-2 flex items-center"; // Chọn màu tương ứng với Shipping
            statusText = "Shipping";
            break;
          case 3:
            statusColor =
              "bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2 flex items-center"; // Chọn màu tương ứng với Success
            statusText = "Success";
            break;
          case 4:
            statusColor =
              "bg-[#fef1f1] text-[#dc2828] border border-[#dc2828] w-fit rounded-md px-2 flex items-center"; // Chọn màu tương ứng với Canceled
            statusText = "Cancelled";
            break;
          case 5:
            statusColor =
              "bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] w-fit rounded-md px-2 flex items-center"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Refunded";
            break;
        }

        return (
          <>
            <div class={statusColor}>{statusText}</div>
          </>
        );
      },
    },

    {
      title: "Total Order",
      dataIndex: "totalPriceOfOrder",
      render: (text, record, index) => {
        return <span>{formatCurrency(text)} đ</span>;
      },
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
                <Link href={`/managerPage/order/order-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    View Order Detail
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
  // API

  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/GetAllByOrderStatus?Status=${encodeURIComponent(
        orderStatus
      )}`,
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
  }, [orderStatus]);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3 ">Order Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="flex w-full items-center mt-4 justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Input filter order code"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
              </div>
              <div className="flex">
                <Select
                  onChange={handleOrderStatusChange}
                  className="ml-2"
                  style={{ height: 44 }}
                  placeholder="Select Order Status"
                  loading={loading}
                  defaultValue={""}
                  position="bottomRight"
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
                  <Select.Option key={6} value={5}>
                    Refunded
                  </Select.Option>
                </Select>
              </div>
            </div>
            <Table
              style={{ minHeight: "fit-content" }}
              columns={columns}
              dataSource={dataSource}
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
export default withAuth(OrderManagement, "manager");

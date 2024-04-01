"use client";
import React, { useEffect, useState, useRef } from "react";
import { Table, Avatar, Button, Empty, Typography } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import { Notification } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { Form, Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";

const { Text } = Typography;
const Statistical04 = () => {
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

  const columns = [
    {
      title: "Top",
      dataIndex: "key",
      render: (text, record, index) => {
        return <span>{Number(text) + 1}</span>;
      },
    },

    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record, index) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={record.userAvatar}
              style={{ marginRight: 12 }}
            ></Avatar>
            {/* The width calculation method is the cell setting width minus the non-text content width */}
            <Text heading={5} ellipsis={{ showTooltip: true }}>
              {text}
            </Text>
          </span>
        );
      },
      onFilter: (value, record) =>
        record.userName.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },

    {
      title: "User ID",
      dataIndex: "userId",
    },

    {
      title: <div className="whitespace-nowrap">Total Of Comment</div>,
      dataIndex: "totalOfComment",
    },
  ];
  // API

  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Statistical/GetListUserInteraction`,
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
  }, []);

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3 ">
            Users with the most comments on products
          </h2>

          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="mt-4 mb-4">
              <Input
                placeholder="Input filter user name"
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onChange={debouncedHandleChange}
                className="transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white min-w-[280px]"
                showClear
                suffix={<IconSearch className="!text-2xl" />}
              />
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
export default withAuth(Statistical04, "manager");

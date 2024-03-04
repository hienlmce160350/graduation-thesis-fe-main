"use client";
import React, { useState, useEffect, useRef } from "react";
import { Table, Avatar, Input, Space, Typography } from "@douyinfe/semi-ui";
import * as dateFns from "date-fns";
import Cookies from "js-cookie";

const App = () => {
  const [dataSource, setData] = useState([]);
  const [filteredValue, setFilteredValue] = useState([]);
  const compositionRef = useRef({ isComposition: false });

  const { Text } = Typography;

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

  const columns = [
    {
        title: (
            <Space>
                <span>Product Name</span>
                <Input
                    placeholder="Input filter value"
                    style={{ width: 200 }}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onChange={handleChange}
                    showClear 
                />
            </Space>
        ),
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
  ];

  const getData = async () => {
    let data = [];
  
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Products/GetAll?LanguageId=en`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    data = await res.json();
    
    // Thêm thuộc tính key cho mỗi object trong mảng data
    data = data.map((item, index) => ({
      ...item,
      key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
    }));
  
    console.log("Data: ", data);
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return <Table columns={columns} dataSource={dataSource} />;
};

export default App;
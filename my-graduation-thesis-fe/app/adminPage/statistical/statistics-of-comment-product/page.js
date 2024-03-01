"use client";
import React, { useEffect, useState } from "react";
import { Table, Avatar, Button, Empty, Typography } from "@douyinfe/semi-ui";
import styles from "./StatisticScreen.module.css";
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

const { Text } = Typography;

const Statistical02 = () => {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const [productName, setProductName] = useState("");

  const handleProductNameChange = (value) => {
    setProductName(value);
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
    },

    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record, index) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={record.imagePath}
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
    },
    {
      title: "Total Of Comment",
      dataIndex: "totalOfComment",
    },
  ];

  const handleSend = async () => {
    const bearerToken = Cookies.get("token");
    console.log("Product Name Search: " + productName);
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Statistical/GetListProductInteraction?keyword=${encodeURIComponent(
        productName
      )}`,
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
  }, [productName]);

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
        <div className="m-auto w-[82%] mb-10">
          <h2 className="text-[32px] font-bold mb-3 ">
            Statistics of comment product
          </h2>

          <div className={styles.table}>
            <Form className="mt-4">
              <Input
                suffix={<IconSearch className="!text-2xl" />}
                showClear
                onChange={handleProductNameChange}
                initValue={productName}
                className="!rounded-[10px] !w-[30%] !h-11 !border border-solid !border-[#DDF7E3] !bg-white"
              ></Input>
            </Form>

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
}

export default withAuth(Statistical02, "manager");

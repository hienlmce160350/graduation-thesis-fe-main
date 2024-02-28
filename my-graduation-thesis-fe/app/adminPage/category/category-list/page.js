"use client";
import React, { useEffect, useState } from "react";
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
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import { IconMore } from "@douyinfe/semi-icons";
import { FaPen } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./CategoryScreen.module.css";
import Cookies from "js-cookie";
import Link from "next/link";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";

import ProtectedRoute from "../../../../utils/ProtectedRoute";

import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
const { Text } = Typography;

export default function CategoryManagement() {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [userIdDeleted, setUserIdDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of user could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successBanMess = {
    title: "Success",
    content: "Banned Successfully.",
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

  const list = [
    {
      id: "en",
      name: "USA",
      avatar:
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg",
    },
    {
      id: "vi",
      name: "VietNam",
      avatar:
        "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg",
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

  const showDialog = (userId) => {
    setVisible(true);
    setUserIdDeleted(userId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Categories/${userIdDeleted}`,
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
        setVisible(false);
        console.log("Category deleted successfully");
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete category");
      }
    } catch (error) {
      // Xử lý lỗi khi có vấn đề với kết nối hoặc lỗi từ server
      console.error("An error occurred", error);
    } finally {
      // Đóng modal hoặc thực hiện các công việc khác sau khi xử lý
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setUserIdDeleted(0);
    setVisible(false);
  };

  // end modal

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Category Name",
      dataIndex: "name",
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
                  href={`/adminPage/category/category-edit/${countryName}/${record.id}`}
                >
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit Category
                  </Dropdown.Item>
                </Link>
                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete Category
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete Category</div>
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
                        By Deleteing this category, the category will be
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

  const getData = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
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
    let data = await res.json();
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
    getData();
  }, [countryName]);

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );

  return (
    <>
      {/* <ProtectedRoute roles={['admin']}> */}
      <LocaleProvider locale={en_US}>
        <div className="m-auto w-[82%] mb-10">
          <h2 className="text-[32px] font-bold mb-3">Category Management</h2>
          <div className={styles.table}>
            <div className="w-full text-right mt-4 mb-4">
              <Select
                placeholder="Please select country"
                style={{ height: 40 }}
                onChange={handleCountryNameChange}
                defaultValue={"en"}
                renderSelectedItem={renderSelectedItem}
              >
                {list.map((item, index) => renderCustomOption(item, index))}
              </Select>
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
      {/* </ProtectedRoute> */}
    </>
  );
}

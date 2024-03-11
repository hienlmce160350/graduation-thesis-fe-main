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
import { withAuth } from "../../../../context/withAuth";

import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
const { Text } = Typography;

const CategoryManagement = () => {
  const [dataSource, setData] = useState([]);
  const [dataCategory, setDataCateogry] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [userIdDeleted, setUserIdDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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
        getData();
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
            position={"bottomRight"}
            render={
              <Dropdown.Menu>
                <Link href={`/managerPage/category/category-edit/${record.id}`}>
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

  let count = 1;
  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Categories`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    data = data.map((item, index) => ({
      ...item,
      key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
    }));
    setDataCateogry(data);
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
          console.log("Data fetch: " + dataCategory);
          console.log("Order List: " + JSON.stringify(dataCategory));
          let dataSource = dataCategory.slice(
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
    getData();
  }, []);

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
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3">Category Management</h2>
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
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
};

export default withAuth(CategoryManagement, "manager");

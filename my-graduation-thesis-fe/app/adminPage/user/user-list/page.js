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
} from "@douyinfe/semi-ui";
import { IconDelete, IconAlertTriangle } from "@douyinfe/semi-icons";
import { IconEdit, IconMore } from "@douyinfe/semi-icons";
import { FaPen } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./UserScreen.module.css";
import Cookies from "js-cookie";
import Link from "next/link";

import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
const { Text } = Typography;

export default function UserManagement() {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [userIdDeleted, setUserIdDeleted] = useState();
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
        `https://ersadminapi.azurewebsites.net/api/Users/${userIdDeleted}`,
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
        console.log("User deleted successfully");
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete user");
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
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dob",
    },
    // {
    //   title: "",
    //   dataIndex: "edit",
    //   render: (text, record) => (
    //     <>
    //       <Link href={`/adminPage/user/user-edit/${record.id}`}>
    //         <Button icon={<IconEdit />} theme="borderless" />
    //       </Link>
    //     </>
    //   ),
    // },
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
                <Link href={`/adminPage/user/user-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit User
                  </Dropdown.Item>
                </Link>

                <Dropdown.Item>
                  <FaUserEdit className="pr-2 text-2xl" />
                  Assign Role
                </Dropdown.Item>
                <Dropdown.Item>
                  <FaUserSlash className="pr-2 text-2xl" />
                  Ban User
                </Dropdown.Item>
                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete User
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete User</div>
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
                      Are you sure you want to delete <b>{record.email}</b>?
                    </p>
                    <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                      <p className="text-[#771505] flex items-center font-semibold">
                        <IconAlertTriangle /> Warning
                      </p>
                      <p className="text-[#BC4C2E] font-medium">
                        By Deleteing this user, the user will be permanently
                        deleted from the system.
                      </p>
                    </div>
                  </Modal>
                </>
              </Dropdown.Menu>
            }
          >
            <IconMore />
          </Dropdown>
        );
      },
    },
    // {
    //   title: "",
    //   dataIndex: "delete",
    //   render: (text, record) => (
    //     <>
    //       <Button
    //         icon={<IconDelete className="text-red-500" />}
    //         theme="borderless"
    //         onClick={() => showDialog(record.id)}
    //       />
    //       <Modal
    //         title={<div className="text-center w-full">Delete User</div>}
    //         visible={visible}
    //         onOk={handleOk}
    //         onCancel={handleCancel}
    //         okText={"Yes, Delete"}
    //         cancelText={"No, Cancel"}
    //         okButtonProps={{ style: { background: "rgba(222, 48, 63, 0.8)" } }}
    //       >
    //         <p className="text-center text-base">
    //           Are you sure you want to delete <b>{record.email}</b>?
    //         </p>
    //         <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
    //           <p className="text-[#771505] flex items-center font-semibold">
    //             <IconAlertTriangle /> Warning
    //           </p>
    //           <p className="text-[#BC4C2E] font-medium">
    //             By Deleteing this user, the user will be permanently deleted
    //             from the system.
    //           </p>
    //         </div>
    //       </Modal>
    //     </>
    //   ),
    // },
  ];

  const getData = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/paging?PageIndex=1&PageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    console.log("Data: " + JSON.stringify(data));
    data = data.resultObj.items;
    setTotal(data.length);
    return data;
  };

  const fetchData = async (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataUser;
    await getData().then((result) => {
      dataUser = result;
    });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataUser;
        console.log("Data fetch: " + data);
        let dataSource = data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
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
    fetchData();
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
      <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
        <h2 className="text-[32px] font-bold mb-3 ">User Management</h2>
        <div className={styles.table}>
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
    </>
  );
}

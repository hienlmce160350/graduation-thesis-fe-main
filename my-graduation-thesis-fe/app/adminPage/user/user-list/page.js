"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Empty,
  Typography,
  Modal,
} from "@douyinfe/semi-ui";
import { IconDelete, IconAlertTriangle } from "@douyinfe/semi-icons";
import { IconEdit } from "@douyinfe/semi-icons";
import styles from "./UserScreen.module.css";
import Cookies from "js-cookie";

import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
const { Text } = Typography;

export default function UserManagement() {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // end modal

  const removeRecord = (key) => {
    let newDataSource = [...dataSource];
    if (key != null) {
      let idx = newDataSource.findIndex((data) => data.key === key);

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setData(newDataSource);
      }
    }
  };

  const columns = [
    // {
    //   title: "Product Name",
    //   dataIndex: "name",
    //   render: (text, record, index) => {
    //     return (
    //       <span style={{ display: "flex", alignItems: "center" }}>
    //         <Avatar
    //           size="small"
    //           shape="square"
    //           src={record.thumbnailImage}
    //           style={{ marginRight: 12 }}
    //         ></Avatar>
    //         {/* The width calculation method is the cell setting width minus the non-text content width */}
    //         <Text
    //           heading={5}
    //           ellipsis={{ showTooltip: true }}
    //           style={{ width: "calc(400px - 76px)" }}
    //         >
    //           {text}
    //         </Text>
    //       </span>
    //     );
    //   },
    // },
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
    {
      title: "Role",
      dataIndex: "roles",
    },
    {
      title: "",
      dataIndex: "edit",
      render: (text, record) => (
        <Button
          icon={<IconEdit />}
          theme="borderless"
          onClick={() => removeRecord(record.key)}
        />
      ),
    },
    {
      title: "",
      dataIndex: "delete",
      render: (text, record) => (
        <>
          <Button
            icon={<IconDelete className="text-red-500" />}
            theme="borderless"
            onClick={showDialog}
          />
          <Modal
            title={<div className="text-center w-full">Delete User</div>}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={"Yes, Delete"}
            cancelText={"No, Cancel"}
            okButtonProps={{ style: { background: "rgba(222, 48, 63, 0.8)" } }}
          >
            <p className="text-center text-base">
              Are you sure you want to delete <b>User Name</b>?
            </p>
            <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
              <p className="text-[#771505] flex items-center font-semibold">
                <IconAlertTriangle /> Warning
              </p>
              <p className="text-[#BC4C2E] font-medium">
                By Deleteing this user, the user will be permanently deleted
                from the system.
              </p>
            </div>
          </Modal>
        </>
      ),
    },
  ];

  const getData = async () => {
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/paging?PageIndex=1&PageSize=10`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    data = data.resultObj.items;
    setTotal(data.length);
    return data;
  };

  const fetchData = async (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataProduct;
    await getData().then((result) => {
      dataProduct = result;
    });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataProduct;
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
      <div className="ml-[12px] w-[82%] mt-[104px]">
        <h2 className="text-[32px] font-bold mb-3 ">User Management</h2>

        {/* <Button onClick={resetData} style={{ marginBottom: 10 }}>
          Reset
        </Button> */}
        <div className={styles.table}>
          <Table
            style={{ minHeight: "fit-content" }}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              currentPage,
              pageSize: 5,
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

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
import { IconEdit } from "@douyinfe/semi-icons";
import styles from "./ProductScreen.module.css";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { IconMore } from "@douyinfe/semi-icons";

const { Text } = Typography;

export default function ProductManagement() {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [productIdDeleted, setProductIdDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = (productId) => {
    setVisible(true);
    setProductIdDeleted(productId);
  };

  const handleOk = async () => {
    try {
      const bearerToken = Cookies.get("token");
      // Gọi API delete user
      const response = await fetch(
        `https://ersmanagerapi.azurewebsites.net/api/Products/${productIdDeleted}`,
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
        setProductIdDeleted(0);
        fetchData();
        setVisible(false);
        console.log("Product deleted successfully");
      } else {
        // Xử lý khi có lỗi từ server
        console.error("Failed to delete product");
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
    setProductIdDeleted(0);
    setVisible(false);
  };

  // end modal

  const columns = [
    {
      title: "Product Name",
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
      title: "Details",
      dataIndex: "details",
    },
    {
      title: "Date created",
      dataIndex: "dateCreated",
    },
    {
      title: "Is Featured",
      dataIndex: "isFeatured",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
    },
    {
      title: "Status",
      dataIndex: "status",
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
                <Link href={`/adminPage/user/user-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit Product
                  </Dropdown.Item>
                </Link>

                <Link href={`/adminPage/user/user-assign/${record.id}`}>
                  <Dropdown.Item>
                    <TbCategoryPlus className="pr-2 text-2xl" />
                    Assign Category
                  </Dropdown.Item>
                </Link>
                <>
                  <Dropdown.Item onClick={() => showDialog(record.id)}>
                    <FaTrashAlt className="pr-2 text-2xl" />
                    Delete Product
                  </Dropdown.Item>
                  <Modal
                    title={
                      <div className="text-center w-full">Delete Product</div>
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
                        By Deleteing this product, the product will be
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
      `https://ersmanagerapi.azurewebsites.net/api/Products/paging?LanguageId=en&PageIndex=1&PageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
          "Content-Type": "application/json",
        },
      }
    );

    let data = await res.json();
    console.log("data: " + JSON.stringify(data));
    data = data.items;
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
      <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
        <h2 className="text-[32px] font-bold mb-3 ">Product Management</h2>

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

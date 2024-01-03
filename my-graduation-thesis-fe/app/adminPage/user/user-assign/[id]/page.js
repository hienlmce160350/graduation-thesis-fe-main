"use client";
import styles from "./UserAssignScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { Tag, Space } from "@douyinfe/semi-ui";

const UserAssign = () => {
  const userId = useParams().id;
  const [data, setUserData] = useState([]);
  // Assign Select
  const renderOptionItem = (renderProps) => {
    const {
      disabled,
      selected,
      label,
      value,
      focused,
      className,
      style,
      onMouseEnter,
      onClick,
      empty,
      emptyContent,
      ...rest
    } = renderProps;
    const optionCls = classNames({
      ["custom-option-render"]: true,
      ["custom-option-render-focused"]: focused,
      ["custom-option-render-disabled"]: disabled,
      ["custom-option-render-selected"]: selected,
      flex: true,
      "gap-3": true,
      "py-3": true,
      "px-2": true,
    });
    // Notice：
    // 1. The style passed in by props needs to be consumed on wrapper dom, otherwise it will not be able to be used normally in virtualization scenarios
    // 2. The styles of selected (selected), focused (focused), disabled (disabled) and other states need to be added by yourself, you can get the relative boolean value from props
    // 3.onMouseEnter needs to be bound on the wrapper dom, otherwise the display will be problematic when the upper and lower keyboards are operated

    return (
      <div
        style={style}
        className={optionCls}
        onClick={() => onClick()}
        onMouseEnter={(e) => onMouseEnter()}
      >
        <Checkbox checked={selected} />
        <div className="option-right">{label}</div>
      </div>
    );
  };

  // mock Role List
  const roleList = [
    {
      id: "05dc0e15-0df0-4b67-b76e-47ee37791bd4",
      name: "manager",
      description: "Manager role",
    },
    {
      id: "46f889a9-662d-4969-84f3-6ff4e199ecf5",
      name: "admin",
      description: "Administrator role",
    },
    {
      id: "07ad9a53-bb09-4d2a-ae06-89131aa9751b",
      name: "verifier",
      description: "verifier role",
    },
  ];
  // end mock Role List

  // mock roles of user
  const roleUser = {
    resultObj: {
      id: "93510e19-8812-482f-8f1b-e116cf8c9e38",
      firstName: "Admin",
      lastName: "minator",
      phoneNumber: null,
      userName: "admin",
      email: "admin@admin.com",
      dob: "2023-01-01T00:00:00",
      roles: ["admin", "manager"],
    },
  };
  // end mock roles of user

  // function get list role user
  const UserRoleDisplay = ({ roles }) => {
    return (
      <div>
        {roles && roles.length > 0 ? (
          <span>{roles.join(", ")}</span>
        ) : (
          <span>No roles</span>
        )}
      </div>
    );
  };
  // end function get list role user

  // const optionList = [
  //   { value: "abc", label: "Semi", otherKey: 0 },
  //   { value: "capcut", label: "Capcut", otherKey: 1 },
  //   { value: "cam", label: "UlikeCam", otherKey: 2 },
  //   { value: "buzz", label: "Buzz", otherKey: 3 },
  // ];

  const optionList = [];
  for (let i = 0; i < roleList.length; i++) {
    optionList.push({
      value: roleList[i].id,
      label: roleList[i].name,
      otherKey: i,
    });
  }
  // End assign select

  // Show notification
  let errorMess = {
    title: "Error",
    content: "User Assign Role could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "User Assign Role Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail User

  const fetchUserData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersadminapi.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        notification.error({
          message: "Failed to fetch user data",
        });
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };
  // End load API Detail User

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      roles: [],
    },
    onSubmit: async (values) => {
      // Handle role data
      const rolesArray = [];

      values.roles.forEach((roleId) => {
        const matchingRole = roleList.find((role) => role.id === roleId);
        if (matchingRole) {
          matchingRole.selected = true;
          delete matchingRole.description;
          rolesArray.push(matchingRole);
        }
      });

      console.log(rolesArray);
      console.log("Values: " + JSON.stringify(values));
      // call API Assign Role
      try {
        const bearerToken = Cookies.get("token");
        const requestBody = {
          id: userId,
          roles: rolesArray,
        };
        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User assign role successfully. Response:", data);
          Notification.success(successMess);
          router.push("/adminPage/user/user-list");
        } else {
          console.log("Failed to assign role:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error assigning role:", error);
      }
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Assign Role</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}>
              <div className="flex flex-col gap-3">
                <b className={styles.email}>
                  Choose role that you want to assign this account:
                </b>
                {/* <Select
                  filter
                  placeholder="Roles"
                  multiple
                  dropdownClassName="components-select-demo-renderOptionItem"
                  optionList={optionList}
                  style={{ width: 320 }}
                  renderOptionItem={renderOptionItem}
                  className="!rounded-md"
                  name="roles"
                  id="roles"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.roles}
                /> */}

                <Select
                  onChange={(value) => formik.setFieldValue("roles", value)}
                  onBlur={formik.handleBlur}
                  value={formik.values.roles}
                  name="roles"
                  id="roles"
                  className="!rounded-md"
                  style={{ width: 320 }}
                  placeholder="Select Roles"
                  multiple // Thêm prop này để chuyển đổi thành Multiple Selection
                >
                  {roleList.map((role) => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Roles of this account: </b>{" "}
                {/* <UserRoleDisplay roles={roleUser.resultObj.roles} /> */}
                {console.log(
                  "Check: " + (data.resultObj && data.resultObj.roles)
                )}
                {data.resultObj && data.resultObj.roles != "" ? (
                  <Space wrap>
                    {data.resultObj.roles.map((item, index) => (
                      <Tag color="green" key={index}>
                        {item}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <span>No roles</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="w-[100px] py-1 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
              type="submit"
            >
              <span className="text-xl font-bold">Save</span>
            </button>
            <button className="border-solid border border-[#ccc] w-[100px] py-1 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
              <a className="text-xl font-bold" href="/adminPage/user/user-list">
                Cancel
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAssign;

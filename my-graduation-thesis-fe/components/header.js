"use client";
import { Dropdown, Tag, Avatar, Typography } from "@douyinfe/semi-ui";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

const HeadComponent = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState();
  const [avatar, setAvatar] = useState();
  const { Text } = Typography;

  useEffect(() => {
    console.log("User header: " + user);
    setFullName(user.userName);
    setAvatar(user.avatar);
  }, [user]);

  return (
    <>
      <div className="h-[68px] w-full text-right">
        {/* <Tag>{fullName}</Tag>  */}
        <Tag className="!h-full !rounded-none">
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={avatar}
              style={{ marginRight: 12 }}
            ></Avatar>
            {/* The width calculation method is the cell setting width minus the non-text content width */}
            <Text heading={5} ellipsis={{ showTooltip: true }}>
              {fullName}
            </Text>
          </span>
        </Tag>
      </div>
    </>
  );
};

// Wrap your Login component with AuthProvider
const HeaderWithAuthProvider = () => (
  <AuthProvider>
    <HeadComponent />
  </AuthProvider>
);
export default HeaderWithAuthProvider;

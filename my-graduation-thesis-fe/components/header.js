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
  const { logout } = useAuth();
  const [fullName, setFullName] = useState();
  const [avatar, setAvatar] = useState();
  const userId = Cookies.get("userId");
  const { Text } = Typography;
  // const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  // Load API Detail User

  const fetchUserData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFullName(data.resultObj.lastName + " " + data.resultObj.firstName);
        setAvatar(data.resultObj.avatar);
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

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <>
      <div className="h-[68px] w-full text-right">
        <Dropdown
          position={"bottomRight"}
          trigger={"click"}
          render={
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout} className="w-[173px]">
                <TbLogout2 className="text-2xl text-red-600 pr-2" />
                Logout
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} className="w-[173px]">
                <TbLogout2 className="text-2xl text-red-600 pr-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
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
        </Dropdown>
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

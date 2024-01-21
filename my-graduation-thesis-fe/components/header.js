"use client";
import { Dropdown, Tag } from "@douyinfe/semi-ui";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

const HeadComponent = () => {
  // const { logout } = useAuth();
  // const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <>
      <div className="h-[104px] w-full text-right">
        <Dropdown
          position={"bottom"}
          trigger={"click"}
          render={
            <Dropdown.Menu>
              <Dropdown.Item>Menu Item 1</Dropdown.Item>
              <Dropdown.Item>Menu Item 2</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <TbLogout2 className="text-2xl text-red-600 pr-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Tag
            avatarSrc="https://www.blexar.com/avatar.png"
            avatarShape="circle"
            className="!text-xl !border-none mt-4 mr-4"
            suffixIcon={<IoIosArrowDown />}
          >
            Peter Behrens
          </Tag>
        </Dropdown>
      </div>
    </>
  );
};

export default HeadComponent;

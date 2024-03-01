"use client";
import React, { useEffect, useState } from "react";
import { Nav, Dropdown, Avatar } from "@douyinfe/semi-ui";
import Image from "next/image";
import Link from "next/link";
import logoShop from "../public/staticImage/logoShop.png";
import { useAuth, AuthProvider } from "../context/AuthContext";

const NavComponent = () => {
  const { menuSetting, role } = useAuth();
  const [isMenuSettingLoaded, setMenuSettingLoaded] = useState(false);
  useEffect(() => {
    console.log("Menu: " + menuSetting);
    if (menuSetting.length > 0) {
      setMenuSettingLoaded(true);
    }
  }, [menuSetting]);

  if (!isMenuSettingLoaded) {
    // Return a loading state or placeholder while menuSetting is being loaded
    return (
      <>
        <Nav
          onSelect={(data) => console.log("trigger onSelect: ", data)}
          onClick={(data) => console.log("trigger onClick: ", data)}
        >
          <Link href={"/"}>
            <Nav.Header
              logo={
                <Image
                  src={logoShop}
                  width={500}
                  height={500}
                  style={{ borderRadius: "50%" }}
                  alt="Picture of the author"
                />
              }
              text={"EatRightify System"}
              className="!py-4"
            />
          </Link>

          <Link href={"/"}>
            <Nav.Item itemKey={"loading"} text={"Loading...."} />
          </Link>
          <Nav.Footer
            collapseButton={true}
            collapseText={(collapsed) => (collapsed ? "Expand" : "Close")}
          />
        </Nav>
      </>
    );
  }

  // footer Cus

  const footerContent =
    role === "" ? (
      // Nếu người dùng đăng nhập, hiển thị Dropdown cho các tùy chọn người dùng
      <Dropdown
        position="bottomRight"
        render={
          <>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link href={"/customerPage/my-profile"}>My Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href={"/customerPage/order-history/order-list"}>
                  My Order
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/auth/login">Logout</Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        }
      >
        <Avatar size="small" color="light-blue" style={{ margin: 4 }}>
          BD
        </Avatar>
        <span>Hello</span>
      </Dropdown>
    ) : null; // Nếu có vai trò, không hiển thị footer
  // end footer Cus

  // style bg
  let background;
  let mode;
  if (role === "") {
    background = "#F4FFEB";
    mode = "horizontal";
  } else {
    background = "transparent";
    mode = "vertical";
  }
  // end style bg
  // return menu
  return (
    <>
      <Nav
        bodyStyle={{}}
        style={{ backgroundColor: background }}
        onSelect={(data) => console.log("trigger onSelect: ", data)}
        onClick={(data) => console.log("trigger onClick: ", data)}
        className="h-full"
        mode={mode}
        footer={footerContent}
      >
        <Nav.Header
          logo={
            <Image
              src={logoShop}
              width={500}
              height={500}
              style={{ borderRadius: "50%" }}
              alt="Picture of the author"
            />
          }
          text={"EatRightify System"}
          className="!py-4"
        />

        {menuSetting.map((item, idx) =>
          item.type === "item" ? (
            item.itemKey == "logout" ? (
              <Nav.Item
                className="!font-semibold hover:bg-gray-100"
                text={item.text}
                onClick={item.click}
                icon={item.icon}
                itemKey={item.itemKey}
              />
            ) : (
              <Link key={idx} href={item.link}>
                <Nav.Item
                  icon={item.icon}
                  itemKey={item.itemKey}
                  text={item.text}
                  className={item.className}
                />
              </Link>
            )
          ) : (
            <Nav.Sub
              key={idx}
              itemKey={item.itemKey}
              text={item.text}
              icon={item.icon}
            >
              {item.items?.map((ele, subIdx) => (
                <Link key={subIdx} href={ele.link}>
                  <Nav.Item
                    itemKey={ele.itemKey}
                    text={ele.text}
                    icon={ele.icon}
                  />
                </Link>
              ))}
            </Nav.Sub>
          )
        )}

        <Nav.Footer
          className="fixed left-0 bottom-0"
          collapseButton={true}
          collapseText={(collapsed) =>
            collapsed ? "Extend the sidebar" : "Collapse the sidebar"
          }
        />
      </Nav>
    </>
  );
};

const NavWithAuthProvider = () => (
  <AuthProvider>
    <NavComponent />
  </AuthProvider>
);
export default NavWithAuthProvider;

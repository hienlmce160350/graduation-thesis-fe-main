"use client";
import React, { useEffect, useState } from "react";
import { Nav, Dropdown, Avatar } from "@douyinfe/semi-ui";
import Image from "next/image";
import Link from "next/link";
import ERSLogo2 from "../public/staticImage/ERSLogo2.png";
import { useAuth, AuthProvider } from "../context/AuthContext";

const NavComponent = () => {
  const { menuSetting, role } = useAuth();
  const [isMenuSettingLoaded, setMenuSettingLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const onCollapseChange = (isCollapsed) => {
    setIsCollapsed(isCollapsed);
  };
  useEffect(() => {
    if (menuSetting.length > 0) {
      setMenuSettingLoaded(true);
    }

    const handleResize = () => {
      // Kiểm tra kích thước màn hình
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setIsCollapsed(true); // Nếu màn hình nhỏ hơn hoặc bằng 768px, đặt isCollapsed là true
      } else {
        setIsCollapsed(false); // Ngược lại, đặt isCollapsed là false
      }
    };

    // Gắn sự kiện lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    // Xóa sự kiện lắng nghe khi component bị hủy
    return () => window.removeEventListener("resize", handleResize);
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
                  src={ERSLogo2}
                  width={600}
                  height={600}
                  alt="Logo Shop"
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

  // return menu
  return (
    <>
      <Nav
        bodyStyle={{ minHeight: "100vh" }}
        onSelect={(data) => console.log("trigger onSelect: ", data)}
        onClick={(data) => console.log("trigger onClick: ", data)}
        className="h-full"
        mode={"vertical"}
        onCollapseChange={onCollapseChange}
        isCollapsed={isCollapsed}
      >
        <Nav.Header
          logo={
            <Image
              src={ERSLogo2}
              width={500}
              height={500}
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
                key={item.itemKey}
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
                    key={ele.itemKey}
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

"use client";
import { Tag, Avatar, Typography } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

const HeadComponent = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState();
  const [avatar, setAvatar] = useState();
  const { Text } = Typography;

  useEffect(() => {
    setFullName(user.userName);
    setAvatar(user.avatar);
  }, [user]);

  return (
    <>
      <div className="h-[68px] w-full text-right">
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

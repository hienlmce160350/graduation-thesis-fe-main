"use client";
import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

const FacebookMessenger = () => {
  return (
    <FacebookProvider appId="369929919229941" chatSupport>
      <CustomChat pageId="106155802418302" minimized={true} />
    </FacebookProvider>
  );
};

export default FacebookMessenger;

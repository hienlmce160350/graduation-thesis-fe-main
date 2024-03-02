"use client";
import dynamic from "next/dynamic";
import { withAuth } from "../../../context/withAuth";

const Map = dynamic(() => import("../../../components/ManagerMap"), {
  ssr: false,
});

const LocationAdminPage = () => {
  return (
    <>
      <div>
        <Map />
      </div>
    </>
  );
};

export default withAuth(LocationAdminPage, "manager");

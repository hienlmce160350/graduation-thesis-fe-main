"use client";
import dynamic from "next/dynamic";
import { withAuth } from "../../../context/withAuth";

const Map = dynamic(() => import("../../../components/ManagerMap"), {
  ssr: false,
});

const LocationmanagerPage = () => {
  return (
    <>
      <div>
        <Map />
      </div>
    </>
  );
};

export default withAuth(LocationmanagerPage, "manager");

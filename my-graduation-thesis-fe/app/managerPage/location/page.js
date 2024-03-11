"use client";
import dynamic from "next/dynamic";
import { withAuth } from "../../../context/withAuth";

const Map = dynamic(() => import("../../../components/ManagerMap"), {
  ssr: false,
});

const LocationmanagerPage = () => {
  return (
    <>
      <div className="mx-auto w-full mt-3 h-fit mb-3">
        <Map />
      </div>
    </>
  );
};

export default withAuth(LocationmanagerPage, "manager");

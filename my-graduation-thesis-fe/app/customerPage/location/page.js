"use client";
import dynamic from "next/dynamic";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconMapPin } from "@douyinfe/semi-icons";
const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

const LocationPage = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconMapPin />} noLink={true}>
              Location
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Map />
      </div>
    </>
  );
};

export default LocationPage;

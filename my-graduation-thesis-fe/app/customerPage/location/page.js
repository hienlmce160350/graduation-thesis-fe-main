"use client";
import dynamic from 'next/dynamic';
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconMapPin } from "@douyinfe/semi-icons";
const Map = dynamic(() => import('../../../components/Map'), { ssr: false });

const LocationPage = () => {
 

  return (
    <>
        <div className="ml-32">
        <Breadcrumb compact={false}>
          <Breadcrumb.Item
            icon={<IconHome />}
            href="/customerPage/home"
          ></Breadcrumb.Item>
          <Breadcrumb.Item icon={<IconMapPin />}>Location</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
          <Map/>
      </div>
    </>
  );
};

export default LocationPage;

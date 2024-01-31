"use client";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../../components/ManagerMap'), { ssr: false });

const LocationAdminPage = () => {
 

  return (
    <>
      <div>
          <Map/>
      </div>
    </>
  );
};

export default LocationAdminPage;

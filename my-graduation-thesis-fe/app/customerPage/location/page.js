"use client";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../../components/Map'), { ssr: false });

const LocationPage = () => {
 

  return (
    <>
      <div>
          <Map/>
      </div>
    </>
  );
};

export default LocationPage;

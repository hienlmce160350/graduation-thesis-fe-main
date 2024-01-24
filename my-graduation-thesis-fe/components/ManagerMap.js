import React, { useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "../app/adminPage/location/ManagerMap.css"; // Import your custom CSS file for styling
import { useFormik } from "formik";

const ManagerMap = () => {
  //Define variable
  const mapContainerRef = React.useRef(null);
  const [locationPermission, setLocationPermission] = useState(null);
  let data = null;
  let locationArray = null;
  let currentMarker = null; // Reference to the currently displayed marker
  let destinationLatLng = null;

  const formik = useFormik({
    initialValues: {
      storeId: "",
      storeName: "",
      storeLat: "",
      storeLon: "",
      storeDescrip: "",
    },
  });
  //Get store location from database
  const getData = async () => {
    try {
      const response = await fetch(
        "https://eatright2.azurewebsites.net/api/Locations/getAllLocation",
        {
          headers: {
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        data = await response.json();
        locationArray = data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        // Check for geolocation support
        if ("geolocation" in navigator) {
          // Prompt user for location permission
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          // User granted permission, proceed with map initialization
          initMap(position.coords);
        } else {
          throw new Error("Geolocation is not supported by this browser");
        }
      } catch (error) {
        Notification.requestPermission().then((permission) => {
          setLocationPermission(permission);
        });
      }
    };

    requestLocationPermission();
  }, []);

  const initMap = (coords) => {
    const mapContainer = mapContainerRef.current;

    //after getting store loc from database
    getData().then(() => {
      if (mapContainer && !mapContainer._leaflet_id) {
        //method to generate new map
        const map = L.map("map");
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        //current user location
        const userLatLng = L.latLng(coords.latitude, coords.longitude);
        console.log(userLatLng);
        //focus the map on user
        map.setView(userLatLng, 13);
        //Add a marker to check user lcoation
        L.marker(userLatLng).addTo(map);

        //For each shop in db, add a marker in the map
        locationArray.forEach((item) => {
          //Get the shop location
          const shopLatLng = L.latLng(item.longitude, item.latitude);
          //Generate the marker
          const storeMarker = L.marker(shopLatLng, {
            icon: L.divIcon({
              className: "leaflet-store-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            draggable: false,
          }).addTo(map);

          storeMarker.isStoreMarker = true;
          storeMarker.on("click", onMarkerClick);
        });

        //If click on marker
        function onMarkerClick(e) {
          destinationLatLng = e.latlng;
          destinationLatLng.lat.toFixed(6);
          destinationLatLng.lng.toFixed(6);
          
          console.log("you click on       " +destinationLatLng);
          if (
            e.target.options.icon.options.className === "leaflet-store-marker"
          ) {
            console.log(locationArray);
            locationArray.forEach((item) => {
              const storeLoc = L.latLng(item.longitude, item.latitude);
              console.log("Database store loc "+storeLoc);

              if (destinationLatLng == storeLoc) {
                console.log ("Trueeeee");
                formik.setFieldValue("storeName", locationArray);
                formik.setFieldValue("storeLon", destinationLatLng.lng);
                formik.setFieldValue("storeLat", destinationLatLng.lat);
                formik.setFieldValue("storeDescrip", destinationLatLng.lng);
              }
            });
          }
        }

        function onMapClick(e) {
          destinationLatLng = e.latlng;

          // Remove the current marker if it exists
          if (currentMarker) {
            currentMarker.remove();
          }

          // Generate the marker at the clicked location
          const newMarker = L.marker(destinationLatLng, {
            icon: L.divIcon({
              className: "leaflet-new-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            draggable: true, // Make the marker draggable if needed
          }).addTo(map);

          //renderStoreTabs();

          // Bind a popup to the marker (you can customize this part)
          newMarker
            .bindPopup(destinationLatLng.lat + " " + destinationLatLng.lng)
            .openPopup();

          // Set the new marker as the current marker
          currentMarker = newMarker;

          formik.setFieldValue("storeLat", destinationLatLng.lat);
          formik.setFieldValue("storeLon", destinationLatLng.lng);
        }

        map.on("click", onMapClick);
      }
    });
  };

  //Show message if user denied to share location
  const renderPermissionMessage = () => {
    if (locationPermission === "denied") {
      return (
        <div
          style={{ textAlign: "center", padding: "20px", fontWeight: "bold" }}
        >
          To use this function, please enable location permission.
        </div>
      );
    }
    return null;
  };

  ////////////////////////////////////////////////////////////////////////////

  const renderStoreTabs = () => {
    return (
      <div>
        <label>Store Name</label>
        <input
          name="storeName"
          id="storeName"
          type="text"
          placeholder="Store Name"
          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.storeName}
        />
        <label>Store Latitude</label>
        <input
          name="storeLat"
          id="storeLat"
          type="text"
          placeholder={formik.values.lat}
          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.storeLat}
          readOnly
        />
        <label>Store Longtitude</label>
        <input
          name="storeLon"
          id="storeLon"
          type="text"
          placeholder="Store Longtitude"
          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.storeLon}
        />

        <label>Store description</label>
        <input
          name="storeDescrip"
          id="storeDescrip"
          type="text"
          placeholder="Store description"
          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
      </div>
    );
  };
  const handleUpdate = (storeId) => {
    // Logic for handling update
    console.log(`Update store with ID: ${storeId}`);
  };

  const handleDelete = (storeId) => {
    // Logic for handling delete
    console.log(`Delete store with ID: ${storeId}`);
  };
  ////////////////////////////////////////////////////////////////////

  //html
  return (
    <div className="manager-map-container">
      <div className="store-box">{renderStoreTabs()}</div>
      <div className="map-container">
        {renderPermissionMessage()}
        <div
          id="map"
          className="map"
          style={{ height: "100vh", width: "75vw" }}
          ref={mapContainerRef}
        ></div>
        <div id="root"></div>
      </div>
    </div>
  );
};

export default ManagerMap;

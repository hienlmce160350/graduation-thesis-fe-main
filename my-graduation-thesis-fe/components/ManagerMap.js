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
        //add resource into the location array
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
          //Fixed the location number to 6 number
          destinationLatLng.lat.toFixed(6);
          destinationLatLng.lng.toFixed(6);
          if (
            e.target.options.icon.options.className === "leaflet-store-marker"
          ) {
            //Compare each store in locationArray to see which store match with the click location
            locationArray.forEach((item) => {
              if (
                destinationLatLng.lat == item.latitude &&
                destinationLatLng.lng == item.longitude
              ) {
                //Set the value to website
                formik.setFieldValue("storeName", item.locationName);
                formik.setFieldValue("storeLon", item.latitude);
                formik.setFieldValue("storeLat", item.longitude);
                formik.setFieldValue("storeDescrip", item.description);

                // Create a popup and open it on the marker
                const popupContent = item.locationName;
                const popup = L.popup()
                  .setLatLng([item.longitude, item.latitude])
                  .setContent(popupContent);

                // close any existing popups before opening a new one
                map.closePopup();

                // Open the popup on the map
                popup.openOn(map);
              }
            });
          }
        }

        //If click on map =>
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

          // Bind a popup to the marker
          newMarker
            .bindPopup(destinationLatLng.lat + " " + destinationLatLng.lng)
            .openPopup();

          // Set the new marker as the current marker
          currentMarker = newMarker;
          formik.setFieldValue("storeName", "");
          formik.setFieldValue("storeLat", destinationLatLng.lat);
          formik.setFieldValue("storeLon", destinationLatLng.lng);
          formik.setFieldValue("storeDescrip", "");
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

  // the admin controller tab
  const renderStoreTabs = () => {
    return (
      <div>
        {/* Start of the input field */}
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
          placeholder="Store Latitude"
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
          readOnly
        />

        <label>Store description</label>
        <textarea
          name="storeDescrip"
          id="storeDescrip"
          rows={4}
          placeholder="Store description"
          className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.storeDescrip}
        ></textarea>
        {/* End of the input field */}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button type="button" onClick={handleCreate}>
            Button 1
          </button>
          <button type="button" onClick={handleUpdate}>
            Button 2
          </button>
          <button type="button" onClick={handleDelete}>
            Button 3
          </button>
        </div>
      </div>
    );
  };

  const handleCreate = (storeId) => {
    // Logic for handling update
    console.log(`Create store with ID: ${storeId}`);
  };

  const handleUpdate = (storeId) => {
    // Logic for handling update
    console.log(`Update store with ID: ${storeId}`);
  };

  const handleDelete = (storeId) => {
    // Logic for handling delete
    console.log(`Delete store with ID: ${storeId}`);
  };



  //the map html section
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

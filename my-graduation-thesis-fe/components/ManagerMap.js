import React, { useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "../app/adminPage/location/ManagerMap.css"; // Import your custom CSS file for styling
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select } from "@douyinfe/semi-ui";
import * as Yup from "yup";

const ManagerMap = () => {
  const [ids, setIds] = useState([]);
  const [statusCheck, setStatusCheck] = useState(false);
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of location could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Location Added Successfully.",
    duration: 3,
    theme: "light",
  };

  let errorEditMess = {
    title: "Error",
    content: "Location editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successEditMess = {
    title: "Success",
    content: "Location Edited Successfully.",
    duration: 3,
    theme: "light",
  };

  let errorDeleteMess = {
    title: "Error",
    content: "Deleting location could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successDeleteMess = {
    title: "Success",
    content: "Location Deleted Successfully.",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };
  // End show notification

  //Define variable
  const mapContainerRef = React.useRef(null);
  const [locationPermission, setLocationPermission] = useState(null);
  let data = null;
  let locationArray = null;
  let currentMarker = null; // Reference to the currently displayed marker
  let destinationLatLng = null;
  let map;
  // userId
  const userId = Cookies.get("userId");

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      locationId: 0,
      locationName: "",
      longitude: 0,
      latitude: 0,
      description: "",
      createdBy: userId,
      status: 0,
    },
    validationSchema: Yup.object({
      locationName: Yup.string().required("Store Name is required"),
      description: Yup.string().required("Store Description is required"),
    }),
    onSubmit: async (values) => {
      console.log("Values: " + JSON.stringify(values));
    },
  });

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

  // create Location
  const createLocation = async () => {
    console.log("Valuees:  " + JSON.stringify(formik.values));
    formik.values.latitude = formik.values.latitude.toString();
    formik.values.longitude = formik.values.longitude.toString();
    delete formik.values.locationId;
    delete formik.values.status;
    console.log("Data Create: " + JSON.stringify(formik.values));
    let id = Notification.info(loadingMess);
    const bearerToken = Cookies.get("token");
    setIds([...ids, id]);
    fetch(`https://ersmanagerapi.azurewebsites.net/api/Locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(formik.values),
    })
      .then((response) => {
        let idsTmp = [...ids];

        if (response.ok) {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successMess);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          // if (data.message == "Email not found") {
          //   Notification.error(emailNotFoundErrorMess);
          // } else {
          Notification.error(errorMess);
          // }
          console.error("Create Location failed");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  // end create Location

  // Edit Location
  const editLocation = async () => {
    console.log("Valuees:  " + JSON.stringify(formik.values));
    delete formik.values.createdBy;
    formik.values.latitude = formik.values.latitude.toString();
    formik.values.longitude = formik.values.longitude.toString();
    formik.values.locationId = Number(formik.values.locationId);
    if (formik.values.status != 1 && formik.values.status != 0) {
      if (formik.values.status === "Active") {
        formik.values.status = Number(1);
      } else if (formik.values.status === "Inactive") {
        formik.values.status = Number(0);
      }
    } else if (formik.values.status == 1 || formik.values.status == 0) {
      formik.values.status = Number(formik.values.status);
    }
    console.log("Data Edit: " + JSON.stringify(formik.values));
    let id = Notification.info(loadingMess);
    const bearerToken = Cookies.get("token");
    setIds([...ids, id]);
    fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Locations/${formik.values.locationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(formik.values),
      }
    )
      .then((response) => {
        let idsTmp = [...ids];

        if (response.ok) {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successEditMess);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.error(errorEditMess);
          console.error("Edit Location failed");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // End Edit Location

  // Delete Location
  const deleteLocation = async () => {
    let id = Notification.info(loadingMess);
    const bearerToken = Cookies.get("token");
    setIds([...ids, id]);
    fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Locations/${formik.values.locationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    )
      .then((response) => {
        let idsTmp = [...ids];

        if (response.ok) {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successDeleteMess);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.error(errorDeleteMess);
          console.error("Delete Location failed");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // End Delete Location

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

  const initMap = (coords) => {
    const mapContainer = mapContainerRef.current;

    //after getting store loc from database
    getData().then(() => {
      if (mapContainer && !mapContainer._leaflet_id) {
        //method to generate new map
        map = L.map("map");
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

        console.log("Checked init Map");
        //For each shop in db, add a marker in the map
        locationArray.forEach((item) => {
          //Get the shop location
          const shopLatLng = L.latLng(item.latitude, item.longitude);
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
                destinationLatLng.lat.toFixed(6) ===
                  Number(item.latitude).toFixed(6) &&
                destinationLatLng.lng.toFixed(6) ===
                  Number(item.longitude).toFixed(6)
              ) {
                console.log("Checked");
                setStatusCheck(true);
                //Set the value to website
                formik.setFieldValue("locationId", item.locationId);
                formik.setFieldValue("locationName", item.locationName);
                formik.setFieldValue("latitude", item.latitude);
                formik.setFieldValue("longitude", item.longitude);
                formik.setFieldValue("description", item.description);
                if (item.status == 1) {
                  formik.setFieldValue("status", "Active");
                } else {
                  formik.setFieldValue("status", "Inactive");
                }

                // Create a popup and open it on the marker
                const popupContent = item.locationName;
                const popup = L.popup()
                  .setLatLng([item.latitude, item.longitude])
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
          setStatusCheck(false);
          formik.setFieldValue("locationName", "");
          formik.setFieldValue("latitude", destinationLatLng.lat);
          formik.setFieldValue("longitude", destinationLatLng.lng);
          formik.setFieldValue("description", "");
        }

        map.on("click", onMapClick);
      }
    });
  };

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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // the admin controller tab
  const renderStoreTabs = () => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <div>
          {/* Start of the input field */}
          <div>
            <label>Store Name</label>
            <input
              name="locationName"
              id="locationName"
              type="text"
              placeholder="Store Name"
              className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.locationName}
            />
          </div>
          {formik.touched.locationName && formik.errors.locationName ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {formik.errors.locationName}
            </div>
          ) : null}

          <div>
            <label>Store Latitude</label>
            <input
              name="latitude"
              id="latitude"
              type="text"
              placeholder="Store Latitude"
              className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.latitude}
              readOnly
            />
          </div>

          <div>
            <label>Store Longtitude</label>
            <input
              name="longitude"
              id="longitude"
              type="text"
              placeholder="Store Longtitude"
              className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.longitude}
              readOnly
            />
          </div>

          <div>
            <label>Store description</label>
            <textarea
              name="description"
              id="description"
              rows={6}
              placeholder="Store description"
              className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            ></textarea>
          </div>
          {formik.touched.description && formik.errors.description ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {formik.errors.description}
            </div>
          ) : null}

          {statusCheck ? (
            <div>
              <label>Status</label>
              <Select
                name="status"
                id="status"
                className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                style={{ width: 140, height: 41 }}
                placeholder="Active or Inactive"
                onChange={(value) => formik.setFieldValue("status", value)}
                onBlur={formik.handleBlur}
                value={formik.values.status}
              >
                <Select.Option value="1">Active</Select.Option>
                <Select.Option value="0">Inactive</Select.Option>
              </Select>
            </div>
          ) : (
            <div className="hidden"></div>
          )}

          {/* End of the input field */}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={createLocation}
              className="w-1/3 py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
            >
              Create
            </button>
            <button
              type="button"
              onClick={editLocation}
              className="w-1/3 py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
            >
              Update
            </button>
            <button
              type="button"
              onClick={deleteLocation}
              className="w-1/3 py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    );
  };

  //the map html section
  return (
    <div className="manager-map-container">
      <div className="map-container w-full relative z-0">
        <div className="store-box blur-10 [backdrop-filter:blur(10px)] absolute z-[999] w-2/5 right-0 h-full  p-4">
          <div className="bg-white p-4 border border-solid border-[#ECEEF6] rounded-xl">
            {renderStoreTabs()}
          </div>
        </div>
        {renderPermissionMessage()}
        <div
          id="map"
          className="map"
          style={{ height: "100vh" }}
          ref={mapContainerRef}
        ></div>
        <div id="root"></div>
      </div>
    </div>
  );
};

export default ManagerMap;

import React, { useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "../app/managerPage/location/ManagerMap.css"; // Import your custom CSS file for styling
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Modal } from "@douyinfe/semi-ui";
import * as Yup from "yup";
import { IconAlertTriangle } from "@douyinfe/semi-icons";

const ManagerMap = () => {
  const [ids, setIds] = useState([]);
  const [statusCheck, setStatusCheck] = useState(false);

  // test show/hide button
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // validation
  const [isCreatingVa, setIsCreatingVa] = useState(true);
  const [isUpdatingVa, setIsUpdatingVa] = useState(true);
  const [isDeletingVa, setIsDeletingVa] = useState(true);
  const [isCheckItz, setIsCheckItz] = useState(true);

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isSubmitMode, setIsSubmitMode] = useState(false);

  // end test show/hide button

  // Show notification
  let permissionMess = {
    title: "Error",
    content: "To use this function, please enable location permission.",
    duration: 3,
    theme: "light",
  };

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
  let permissionCount = 0;
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
      if (isSubmitMode) {
        if (isCreateMode) {
          createLocation();
        } else {
          if (!isDeleteMode) {
            editLocation();
          }
        }
      }
    },
  });

  // create Location
  const createLocation = async () => {
    formik.values.latitude = formik.values.latitude.toString();
    formik.values.longitude = formik.values.longitude.toString();
    delete formik.values.locationId;
    delete formik.values.status;
    let id = Notification.info(loadingMess);
    const bearerToken = Cookies.get("token");
    setIds([...ids, id]);
    fetch(`https://ersmanager.azurewebsites.net/api/Locations`, {
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
          setIsCreating(false);
          setIsUpdating(false);
          setIsDeleting(false);
          setIsSubmitMode(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          map.reload();
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
    let id = Notification.info(loadingMess);
    const bearerToken = Cookies.get("token");
    setIds([...ids, id]);
    fetch(
      `https://ersmanager.azurewebsites.net/api/Locations/${formik.values.locationId}`,
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
          setIsCreating(false);
          setIsUpdating(false);
          setIsDeleting(false);
          setIsSubmitMode(false);
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
      `https://ersmanager.azurewebsites.net/api/Locations/${formik.values.locationId}`,
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
          setVisible(false);
          setIsCreating(false);
          setIsUpdating(false);
          setIsDeleting(false);
          setIsSubmitMode(false);
          setIsDeleteMode(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.error(errorDeleteMess);
          setVisible(false);
          console.error("Delete Location failed");
        }
      })
      .then((data) => {})
      .catch((error) => {
        setVisible(false);
        console.error("Error:", error);
        // Handle errors
      });
  };
  // End Delete Location

  const cancelAction = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setIsDeleting(false);
  };

  //Get store location from database
  const getData = async () => {
    try {
      const response = await fetch(
        "https://erscus.azurewebsites.net/api/Locations/getAllLocation",
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
        //focus the map on user
        map.setView(userLatLng, 13);
        //Add a marker to check user lcoation
        L.marker(userLatLng).addTo(map);
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
          if (currentMarker) {
            currentMarker.remove();
          }

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
                setStatusCheck(true);
                setIsCreateMode(false);
                setIsEditMode(true);
                setIsCheckItz(true);

                setIsSubmitMode(false);
                setIsUpdatingVa(true);
                setIsCreatingVa(true);
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
          newMarker.bindPopup("Create new store").openPopup();

          // Set the new marker as the current marker
          currentMarker = newMarker;
          setStatusCheck(false);
          formik.setFieldValue("locationName", "");
          formik.setFieldValue("latitude", destinationLatLng.lat);
          formik.setFieldValue("longitude", destinationLatLng.lng);
          formik.setFieldValue("description", "");
          setIsSubmitMode(true);
          setIsCreateMode(true);
          setIsCheckItz(false);
          setIsEditMode(true);
          setIsCreatingVa(false);
        }

        map.on("click", onMapClick);
      }
    });
  };

  // modal
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setIsDeleteMode(true);
    deleteLocation();
    setVisible(false);
  };

  const handleSubmit = () => {
    setIsSubmitMode(true);
  };

  // end modal

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
      if (permissionCount == 0) {
        Notification.error(permissionMess);
        permissionCount++;
      }
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Function to render buttons based on the current action
  const renderActionButtons = () => {
    if (isUpdating) {
      return (
        <>
          <button
            type="submit"
            onClick={handleSubmit}
            className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={cancelAction}
            className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
          >
            Cancel
          </button>
        </>
      );
    } else {
      return (
        <>
          {isEditMode ? (
            isCreateMode ? (
              <button
                type="submit"
                className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
              >
                Create
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsUpdating(true);
                    setIsCheckItz(false);
                    setIsDeleting(false);
                  }}
                  className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showDialog();
                  }}
                  className="p-2 rounded-lg w-24 text-[#FF5C5C] border-2 border-[#FFB3B360] hover:border-[#FF5C5C] hover:border-2 hover:text-[#FF5C5C]"
                >
                  Delete
                </button>
              </>
            )
          ) : null}
        </>
      );
    }
  };

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
              readOnly={isCreatingVa && isUpdatingVa && isCheckItz}
            />
          </div>
          {formik.touched.locationName &&
          !isCheckItz &&
          formik.errors.locationName ? (
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
              readOnly={isCreatingVa && isUpdatingVa && isCheckItz}
            ></textarea>
          </div>
          {formik.touched.description &&
          !isCheckItz &&
          formik.errors.description ? (
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
                disabled={isCreatingVa && isUpdatingVa && isCheckItz}
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
            {renderActionButtons()}
            <Modal
              title={<div className="text-center w-full">Delete Location</div>}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText={"Yes, Delete"}
              cancelText={"No, Cancel"}
              okButtonProps={{
                type: "danger",
                style: { background: "rgba(222, 48, 63, 0.8)" },
              }}
            >
              <p className="text-center text-base">
                Are you sure you want to delete{" "}
                <b>{formik.values.locationName}</b>?
              </p>
              <div className="bg-[#FFE9D9] border-l-4 border-[#FA703F] p-3 gap-2 mt-4">
                <p className="text-[#771505] flex items-center font-semibold gap-1">
                  <IconAlertTriangle /> Warning
                </p>
                <p className="text-[#BC4C2E] font-medium">
                  By Deleteing this location, the location will be permanently
                  deleted from the system.
                </p>
              </div>
            </Modal>
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

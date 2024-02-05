import React, { useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Notification } from "@douyinfe/semi-ui";

const Map = () => {
  //Define variable
  const mapContainerRef = React.useRef(null);
  const [locationPermission, setLocationPermission] = useState(null);
  let data = null;
  let locationArray = null;

  // Show notification
  let permissionMess = {
    title: "Error",
    content: "To use this function, please enable location permission.",
    duration: 3,
    theme: "light",
  };

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
        Notification.error(permissionMess);
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
          const shopLatLng = L.latLng(item.latitude, item.longitude);
          //Generate the marker
          const storeMarker = L.marker(shopLatLng, {
            icon: L.divIcon({
              className: "leaflet-store-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            draggable: false,
          })
            .addTo(map)
            .bindPopup(item.locationName)
            .openPopup();

          storeMarker.isStoreMarker = true;
          storeMarker.on("click", onMarkerClick);
        });

        const routingControl = L.Routing.control({
          waypoints: [userLatLng, userLatLng],
          routeWhileDragging: true,
          createMarker: function (i, waypoint, n) {
            return L.marker(waypoint.latLng, {
              draggable: false,
            });
          },
        }).addTo(map);

        //If click on marker
        function onMarkerClick(e) {
          const destinationLatLng = e.latlng;
          if (
            e.target.options.icon.options.className === "leaflet-store-marker"
          ) {
            routingControl.setWaypoints([userLatLng, destinationLatLng]);
          }
        }

        //If click on map
        function onMapClick(e) {
          const destinationLatLng = e.latlng;
          routingControl.setWaypoints([userLatLng, destinationLatLng]);
        }

        map.on("click", onMapClick);
      }
    });
  };


  //html
  return (
    <div>
      <div
        id="map"
        style={{ height: "100vh", width: "100vw" }}
        ref={mapContainerRef}
      ></div>
      <div id="root"></div>
    </div>
  );
};

export default Map;

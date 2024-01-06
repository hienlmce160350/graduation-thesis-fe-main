"use client";
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import the Leaflet CSS
import "leaflet-routing-machine";

const LocationPage = () => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");

    if (mapContainer && !mapContainer._leaflet_id) {
      // Container exists and map is not initialized yet
      const map = L.map("map").setView([10.027008, 105.74889], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      var marker = L.marker([10.027008, 105.74889])
        .addTo(map)
        .bindPopup("Hello")
        .openPopup();

      var popup = L.popup();

      var routingControl; // Variable to store the reference to the routing control

      function onMapClick(e) {
        // Close existing popup if any
        map.closePopup();
        // Remove the existing routing control if any
        if (routingControl) {
          map.removeControl(routingControl);
        }

        // Create a new popup and open it on the map
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);

        // Create a new marker at the clicked location
        var endMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        // Create a new routing control with waypoints
        routingControl = L.Routing.control({
          waypoints: [
            L.latLng([10.027008, 105.74889]),
            L.latLng(e.latlng.lat, e.latlng.lng),
          ],
        }).addTo(map);

        // Update the waypoints in the existing control
        routingControl.spliceWaypoints(
          routingControl.getWaypoints().length - 1,
          1,
          e.latlng
        );
      }

      map.on("click", onMapClick);
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ height: "800px" }}></div>
      <div id="root"></div>
    </div>
  );
};

export default LocationPage;

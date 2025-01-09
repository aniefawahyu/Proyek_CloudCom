"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// Set global default icon
const DefaultIcon = L.icon({
  iconUrl: "/image/marker-icon.png",
  shadowUrl: "/image/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ position, onLocationChange }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map
      const map = L.map("map", {
        center: position,
        zoom: 13,
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        ],
      });

      // Add draggable marker at the initial position
      const marker = L.marker(position, { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Update position when marker is dragged
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onLocationChange([lat, lng]);
      });

      // Add search control
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        keepResult: true,
      });

      map.addControl(searchControl);

      // Update marker position when search result is selected
      map.on("geosearch/showlocation", (result) => {
        const { x, y } = result.location;

        // Check if result contains valid coordinates before updating the marker
        if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
          // Ensure the marker is correctly initialized
          if (markerRef.current) {
            markerRef.current.setLatLng([y, x]); // Update marker position
            onLocationChange([y, x]); // Notify parent of new location
          } else {
            console.error("Marker is not properly initialized.");
          }
        } else {
          console.error(
            "Invalid location from search result:",
            result.location
          );
        }
      });

      mapRef.current = map;
    }

    return () => {
      // Cleanup on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [position, onLocationChange]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapComponent;

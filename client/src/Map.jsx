import React, { useState } from "react";
import { Map, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

const MapComponent = ({ coffeeShops }) => {
  const [viewport, setViewport] = useState({
    latitude: 40.73061,
    longitude: -73.935242,
    zoom: 9,
    width: "100%",
    height: "100%",
  });

  const [selectedShop, setSelectedShop] = useState(null);

  return (
    <Map
      initialViewState={viewport}
      mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_API_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(newViewport) => setViewport(newViewport)}
    >
      {coffeeShops.map((shop) => (
        <Marker
          key={shop.id}
          latitude={shop.geocodes.main.latitude}
          longitude={shop.geocodes.main.longitude}
        >
          <div onClick={() => setSelectedShop(shop)}>
            <svg height="10" width="10">
              <circle
                cx="5"
                cy="5"
                r="4"
                stroke="black"
                strokeWidth="1"
                fill="red"
              />
            </svg>
          </div>
        </Marker>
      ))}
      {selectedShop && (
        <Popup
          latitude={selectedShop.geocodes.main.latitude}
          longitude={selectedShop.geocodes.main.longitude}
          onClose={() => setSelectedShop(null)}
        >
          <div>Popup Content</div>
        </Popup>
      )}
    </Map>
  );
};

export default MapComponent;

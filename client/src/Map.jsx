import mapboxgl from "mapbox-gl";
import "./index.css";
import React, { useEffect, useRef, useCallback } from "react";

const Map = ({ coffeeShops, setHandleCoffeeShopClick }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  let currentPopup = null; // Add this line outside your component

  const handleCoffeeShopClick = (coffeeShop) => {
    map.current.flyTo({
      center: [
        coffeeShop.geocodes.main.longitude,
        coffeeShop.geocodes.main.latitude,
      ],
      zoom: 15,
    });
    if (currentPopup) {
      currentPopup.remove();
    }

    // Open the marker's popup
    coffeeShop.marker.togglePopup();
    currentPopup = coffeeShop.marker.getPopup();
  };

  useEffect(() => {
    setHandleCoffeeShopClick.current = handleCoffeeShopClick;
  }, []);

  const handleDragStart = useCallback(() => {
    if (map.current) {
      map.current.dragPan.disable();
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    if (map.current) {
      map.current.dragPan.enable();
    }
  }, []);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ""; // Ensure the map container is empty
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11", // Set the style to "Streets"
        center: [-73.935242, 40.7301],
        zoom: 12,
      });

      let userLocation;
      map.current.on("load", () => {
        // Add a marker for the user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            userLocation = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            new mapboxgl.Marker({ color: "blue" })
              .setLngLat(userLocation)
              .addTo(map.current);

            // Add markers for coffee shops
            if (Array.isArray(coffeeShops)) {
              const bounds = new mapboxgl.LngLatBounds();

              coffeeShops.forEach((shop) => {
                if (
                  shop.geocodes &&
                  shop.geocodes.main &&
                  typeof shop.geocodes.main.longitude === "number" &&
                  typeof shop.geocodes.main.latitude === "number"
                ) {
                  const marker = new mapboxgl.Marker({
                    color: "red",
                    rotation: 0,
                    draggable: false, // Set this to true
                  })
                    .setLngLat([
                      shop.geocodes.main.longitude,
                      shop.geocodes.main.latitude,
                    ])
                    .addTo(map.current)
                    .on("dragstart", handleDragStart)
                    .on("dragend", handleDragEnd);

                  if (userLocation) {
                    const shopLocation = new mapboxgl.LngLat(
                      shop.geocodes.main.longitude,
                      shop.geocodes.main.latitude
                    );
                    const userLngLat = new mapboxgl.LngLat(...userLocation);
                    const distance = shopLocation.distanceTo(userLngLat); // distance in meters

                    // Store the distance in the coffee shop object for later use
                    shop.distanceToUser = distance;

                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <h3>${shop.name} </h3>
                    <p>${shop.location.formatted_address}</p>
                    <img src="${shop.categories[0].icon.prefix}88${
                      shop.categories[0].icon.suffix
                    }" alt="${shop.name}" style="width: 50px; height: 50px;">
                    ${
                      shop.distanceToUser
                        ? `<p>Distance: ${(
                            shop.distanceToUser * 0.000621371
                          ).toFixed(2)} miles</p>`
                        : ""
                    }
                  `);

                    marker.setPopup(popup);
                  }
                  marker
                    .getElement()
                    .addEventListener("mouseenter", () => marker.togglePopup());

                  // Hide the popup when the user leaves the marker
                  marker
                    .getElement()
                    .addEventListener("mouseleave", () => marker.togglePopup());

                  // Extend the bounds to include the shop's coordinates
                  bounds.extend([
                    shop.geocodes.main.longitude,
                    shop.geocodes.main.latitude,
                  ]);

                  // Store a reference to the marker in the coffee shop object
                  shop.marker = marker;
                } else {
                  console.error("Invalid shop data:", shop);
                }
              });

              // Fit the map to the bounds with a padding of 50 pixels on each side
              if (bounds.isEmpty()) {
                console.log("No valid bounds found");
              } else {
                map.current.fitBounds(bounds, { padding: 50 });
              }
            }
          });
        }
      });
    }
  }, [coffeeShops]);

  return <div ref={mapContainerRef} className="mapContainer" />;
};

export default Map;

import mapboxgl from "mapbox-gl";
import "./index.css";
import React, { useEffect, useRef, useCallback } from "react";

const Map = ({ coffeeShops, setHandleCoffeeShopClick }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  let currentPopup = null;

  const handleCoffeeShopClick = (coffeeShop) => {
    map.current.flyTo({
      center: [
        coffeeShop.geocodes.main.longitude,
        coffeeShop.geocodes.main.latitude,
      ],
      zoom: 10,
    });
    if (currentPopup) {
      currentPopup.remove();
    }
    coffeeShop.marker.togglePopup();
    currentPopup = coffeeShop.marker.getPopup();
  };

  useEffect(() => {
    setHandleCoffeeShopClick.current = handleCoffeeShopClick;
  }, [setHandleCoffeeShopClick]);

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
      mapContainerRef.current.innerHTML = "";
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-73.935242, 40.7301],
        zoom: 12,
      });

      map.current.on("load", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            new mapboxgl.Marker({ color: "blue" })
              .setLngLat(userLocation)
              .addTo(map.current);

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
                    draggable: false,
                  })
                    .setLngLat([
                      shop.geocodes.main.longitude,
                      shop.geocodes.main.latitude,
                    ])
                    .addTo(map.current)
                    .on("dragstart", handleDragStart)
                    .on("dragend", handleDragEnd);

                  const shopLocation = new mapboxgl.LngLat(
                    shop.geocodes.main.longitude,
                    shop.geocodes.main.latitude
                  );
                  const userLngLat = new mapboxgl.LngLat(...userLocation);
                  const distance = shopLocation.distanceTo(userLngLat);

                  shop.distanceToUser = distance;

                  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <h3>${shop.name}</h3>
                    <p>${shop.location.formatted_address}</p>
                    <img src="${shop.categories[0].icon.prefix}88${shop.categories[0].icon.suffix}" alt="${shop.name}" style="width: 50px; height: 50px;">
                    ${
                      shop.distanceToUser
                        ? `<p>Distance: ${(shop.distanceToUser * 0.000621371).toFixed(2)} miles</p>`
                        : ""
                    }
                  `);

                  marker.setPopup(popup);
                  marker
                    .getElement()
                    .addEventListener("mouseenter", () => marker.togglePopup());
                  marker
                    .getElement()
                    .addEventListener("mouseleave", () => marker.togglePopup());

                  bounds.extend([
                    shop.geocodes.main.longitude,
                    shop.geocodes.main.latitude,
                  ]);

                  shop.marker = marker;
                } else {
                  console.error("Invalid shop data:", shop);
                }
              });

              if (!bounds.isEmpty()) {
                map.current.fitBounds(bounds, { padding: 50 });
              }
            }
          });
        }
      });
    }
  }, [coffeeShops, handleDragEnd, handleDragStart]);

  return <div ref={mapContainerRef} className="mapContainer" />;
};

export default Map;

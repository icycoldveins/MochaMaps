import React, { useState, useRef } from "react";
import SearchBar from "./SearchBar";
import Map from "./Map";
import CoffeeShopList from "./CoffeeShopList";
import Banner from "./Banner";
import "./index.css";
import "./map.css";

const App = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [searchCoordinates, setSearchCoordinates] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const handleCoffeeShopClick = useRef(null);
  const fetchCoffeeShops = async (postalCode) => {
    console.log("fetchCoffeeShops called");
    try {
      // Call Foursquare API to get coffee shops
      const searchParams = new URLSearchParams({
        query: "coffee",
        near: postalCode,
        open_now: "true",
        sort: "DISTANCE",
      });
      const foursquareResponse = await fetch(
        `https://api.foursquare.com/v3/places/search?${searchParams}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `${import.meta.env.VITE_APP_FOURSQUARE_API_KEY}`,
          },
        }
      );
      const coffeeShops = await foursquareResponse.json();
      console.log("Foursquare coffee shops:", coffeeShops);
      setCoffeeShops(coffeeShops.results); // Assuming you want to pass just the array of shops
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearch = (results, coordinates) => {
    // handle the search results
    setCoffeeShops(results);
    setSearchCoordinates(coordinates);
  };
  console.log("Component rendered");
  return (
    <div className="parentContainer">
      <Banner></Banner>
      <Map
        coffeeShops={coffeeShops}
        setHandleCoffeeShopClick={handleCoffeeShopClick}
        searchCoordinates={searchCoordinates}
        setPostalCode={setPostalCode}
        fetchCoffeeShops={fetchCoffeeShops} // pass fetchCoffeeShops as a prop
      />
      <SearchBar onSearch={handleSearch} initialQuery={postalCode} />{" "}
      <CoffeeShopList
        coffeeShops={coffeeShops}
        onCoffeeShopClick={handleCoffeeShopClick.current}
      />
    </div>
  );
};

export default App;

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import axios from "axios";
import "./searchbar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Call Mapbox API to get coordinates
      const mapboxResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${
          import.meta.env.VITE_APP_MAPBOX_API_KEY
        }`
      );
      const coordinates = mapboxResponse.data.features[0].center;
      console.log("Mapbox coordinates:", coordinates);

      // Call Foursquare API to get coffee shops
      const searchParams = new URLSearchParams({
        query: "coffee",
        ll: `${coordinates[1]},${coordinates[0]}`,
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
      onSearch(coffeeShops.results); // Assuming you want to pass just the array of shops

      // Pass the coffee shops up to the parent component or handle it here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isMobile = window.innerWidth <= 600;

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter zipcode or location"
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

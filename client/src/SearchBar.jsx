import React, { useState } from "react";
import axios from "axios";
import "./index.css";

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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${import.meta.env.VITE_APP_MAPBOX_API_KEY}`
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter zipcode or location"
        style={{
          marginRight: "10px",
          padding: "10px",
          fontSize: "1em",
          border: "2px solid #0000ff",
          borderRadius: "5px",
          width: "100%", // Add this line
          maxWidth: "300px", // And this line
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontSize: "1em",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#0000ff",
          color: "#fff",
          cursor: "pointer",
          outline: "none",
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

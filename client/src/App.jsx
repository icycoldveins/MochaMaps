import React, { useState, useRef } from "react";
import SearchBar from "./SearchBar";
import Map from "./Map";
import CoffeeShopList from "./CoffeeShopList";
import Banner from "./Banner";
import "./index.css";
import "./map.css";

const App = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const handleCoffeeShopClick = useRef(null);

  const handleSearch = (results) => {
    // handle the search results
    setCoffeeShops(results);
  };

  return (
    <div className="parentContainer">
      <Banner></Banner>
      <Map
        coffeeShops={coffeeShops}
        setHandleCoffeeShopClick={handleCoffeeShopClick}
      />
      <SearchBar onSearch={handleSearch} />
      <CoffeeShopList
        coffeeShops={coffeeShops}
        onCoffeeShopClick={handleCoffeeShopClick.current}
      />
    </div>
  );
};

export default App;

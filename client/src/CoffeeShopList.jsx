import React from "react";
import { ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import "./coffe.css";

const CoffeeShopList = ({ coffeeShops, onCoffeeShopClick }) => {
  return (
    <ListGroup className="d-flex flex-column coffee-shop-list">
      {coffeeShops.map((coffeeShop, index) => (
        <ListGroup.Item
          action
          key={index}
          onClick={() => onCoffeeShopClick(coffeeShop)}
          className="p-3 fs-5 d-flex justify-content-between align-items-center mb-3 border" // Add border
        >
          <div className="d-flex align-items-center">
            <div>
              <h5>{coffeeShop.name}</h5>
              <p>{coffeeShop.location.formatted_address}</p>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CoffeeShopList;

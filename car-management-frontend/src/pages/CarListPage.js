import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import '../components/Styles/CarListPage.css';

const CarListPage = () => {
  const [cars, setCars] = useState([]); 
  const [search, setSearch] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const fetchCars = async () => {
    try {
      const endpoint = searchTriggered && search ? "/cars/search" : "/cars"; 
      const params = searchTriggered && search ? { keyword: search } : {}; 
      const response = await API.get(endpoint, { params });
      setCars(response.data);
    } catch (err) {
      alert(
        "Error fetching cars: " + (err.response?.data?.message || "Server error")
      );
    }
  };
  
  const handleSearch = () => {
    setSearchTriggered(true); 
    fetchCars(); 
  };

  useEffect(() => {
    if (!searchTriggered) {
      fetchCars();
    }
  }, []); 

  useEffect(() => {
    console.log("Cars state updated:", cars); 
  }, [cars]);

  return (
    <div>
      <Navbar />
      <h1>Your Cars</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {cars.length === 0 ? (
          <p>No cars found. Start by adding your first car!</p>
        ) : (
          cars.map((car) => {
            console.log("Rendering car:", car); 
            return (
              <div className="car-card" key={car._id}>
                <h2>{car.title}</h2>
                <p className="grey">{car.description}</p>
                <Link to={`/cars/${car._id}`}>
                <button className="button">View Details</button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CarListPage;

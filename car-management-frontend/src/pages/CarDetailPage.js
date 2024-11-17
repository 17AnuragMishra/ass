import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';

const CarDetailPage = () => {
  const { id } = useParams(); // Get car ID from URL
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

  const fetchCarDetails = async () => {
    try {
      const response = await API.get(`/cars/${id}`);
      setCar(response.data);
    } catch (err) {
      alert('Error fetching car details: ' + err.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this car?')) {
        await API.delete(`/cars/${id}`);
        alert('Car deleted successfully!');
        navigate('/'); // Redirect to Car List Page
      }
    } catch (err) {
      alert('Error deleting car: ' + err.response?.data?.message || 'Server error');
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h1>{car.title}</h1>
      <p>{car.description}</p>
      <div>
        <strong>Tags:</strong>
        <p>Car Type: {car.tags.car_type}</p>
        <p>Company: {car.tags.company}</p>
        <p>Dealer: {car.tags.dealer}</p>
      </div>
      <div>
        <strong>Images:</strong>
        <div style={{ display: 'flex', gap: '10px' }}>
          {car.images.map((image, index) => (
            <img key={index} src={image} alt={`Car ${index + 1}`} style={{ width: '100px', height: '100px' }} />
          ))}
        </div>
      </div>
      <button onClick={() => navigate(`/edit/${id}`)}>Edit Car</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
        Delete Car
      </button>
    </div>
  );
};

export default CarDetailPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import '../styles/CarEditPage.css';

const CarEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: { car_type: '', company: '', dealer: '' },
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const fetchCarDetails = async () => {
    try {
      const response = await API.get(`/cars/${id}`);
      const { title, description, tags, images } = response.data;
      setForm({ title, description, tags });
      setExistingImages(images);
    } catch (err) {
      alert('Error fetching car details: ' + err.response?.data?.message || 'Server error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTagChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, tags: { ...form.tags, [name]: value } });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 10) {
      alert('You can only have up to 10 images.');
      return;
    }
    setImageFiles(files);
  };

  const handleRemoveImage = (image) => {
    setExistingImages(existingImages.filter((img) => img !== image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    Object.entries(form.tags).forEach(([key, value]) => {
      formData.append(`tags[${key}]`, value);
    });
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('removeImages', JSON.stringify(existingImages));

    try {
      await API.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Car updated successfully!');
      navigate(`/cars/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating car.');
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="edit-container">
        <h1>Edit Car</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Car Type</label>
            <input
              type="text"
              name="car_type"
              value={form.tags.car_type}
              onChange={handleTagChange}
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={form.tags.company}
              onChange={handleTagChange}
            />
          </div>
          <div className="form-group">
            <label>Dealer</label>
            <input
              type="text"
              name="dealer"
              value={form.tags.dealer}
              onChange={handleTagChange}
            />
          </div>
          <div className="image-preview">
            <strong>Existing Images</strong>
            <div className="image-list">
              {existingImages.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Existing ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveImage(image)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Add New Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Update Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarEditPage;

import React, { useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const CarCreatePage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: { car_type: '', company: '', dealer: '' },
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

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
    if (files.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }
    setImageFiles(files);
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

    try {
      await API.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Car added successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding car.');
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Add a New Car</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <input
          type="text"
          name="car_type"
          placeholder="Car Type"
          value={form.tags.car_type}
          onChange={handleTagChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.tags.company}
          onChange={handleTagChange}
        />
        <input
          type="text"
          name="dealer"
          placeholder="Dealer"
          value={form.tags.dealer}
          onChange={handleTagChange}
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default CarCreatePage;

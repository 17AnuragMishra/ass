import axios from 'axios';

const API = axios.create({
  baseURL: 'https://assignment-ta8r.onrender.com/api', // Update with your backend URL if deployed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

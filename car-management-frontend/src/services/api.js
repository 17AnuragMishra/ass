import axios from 'axios';

const API_URL = 'https://assignment-ta8r.onrender.com/api';  // Replace with your backend API URL

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('token');

// API Service
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json',
  },
});

// API methods for authentication
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password });
  return response.data;
};

// API methods for managing products
export const getProducts = async () => {
  const response = await api.get('/cars');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/cars', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/cars/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
};

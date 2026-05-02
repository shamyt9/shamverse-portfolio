import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

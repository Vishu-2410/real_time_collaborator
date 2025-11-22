import axios from 'axios';
import { env } from '../config/env.js';

const client = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;

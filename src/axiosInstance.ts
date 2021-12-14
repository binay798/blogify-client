import axios from 'axios';

export const baseUrl = 'http://localhost:8000';
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default axiosInstance;

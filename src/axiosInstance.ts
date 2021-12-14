import axios from 'axios';

export let baseUrl = 'http://localhost:8000';
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://blogify-node-app.herokuapp.com/';
}
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default axiosInstance;

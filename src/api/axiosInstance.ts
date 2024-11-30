import axios from 'axios';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: 'http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        history.push('/login');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

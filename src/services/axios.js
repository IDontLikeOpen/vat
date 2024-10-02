import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use((config) => {
  return config;
});

instance.interceptors.response.use(
  (data) => data,
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;

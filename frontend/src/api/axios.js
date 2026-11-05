import axios from 'axios';

const api = axios.create({
  baseURL: 'https://unpadded-jackal-tubeless.ngrok-free.dev/api',
});

// Attach JWT token and ngrok bypass header to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});

// On 401 redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;

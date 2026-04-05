import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/'; // Included /api/ prefix and trailing slash for consistency

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('agro_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('agro_user');
            localStorage.removeItem('agro_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

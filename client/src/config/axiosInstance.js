import axios from "axios";

// Determine the API URL based on environment
const getApiUrl = () => {
    // If VITE_API_URL is set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // For production, use the Render server
    if (import.meta.env.PROD) {
        return "https://snedz-server.onrender.com/api/";
    }
    
    // For development, use localhost
    return "http://localhost:5600/api/";
};

const BASE_URL = getApiUrl();

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for debugging (only in development)
if (import.meta.env.DEV) {
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log('Request:', config.method.toUpperCase(), config.url);
            return config;
        },
        (error) => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Add response interceptor for debugging (only in development)
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log('Response:', response.status, response.config.url);
            return response;
        },
        (error) => {
            console.error('Response Error:', error.response?.status, error.config?.url);
            return Promise.reject(error);
        }
    );
}

export default axiosInstance;
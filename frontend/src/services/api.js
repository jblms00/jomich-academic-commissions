import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // For PHP local development server (php -S)
    withCredentials: true, // Important for session cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;

import axios from 'axios';
// create an axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api', // url = base url + request url
    headers: {
        'Content-Type': 'application/json'
    }
});
export default api;

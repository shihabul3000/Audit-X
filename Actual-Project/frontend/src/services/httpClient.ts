import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Need this for Better Auth cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling global errors (like 401 Unauthorized)
httpClient.interceptors.response.use(
  (response) => response.data, // Standard unwrapping of our generic API response
  (error) => {
    if (error.response?.status === 401) {
      // Typically we'd use an event bus or direct zustand mutation here,
      // but to avoid circular deps, the app store handles its own check
      // via the auth service wrapper.
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default httpClient;

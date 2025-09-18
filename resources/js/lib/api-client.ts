// resources/js/lib/api-client.ts
import axios from "axios";

export const apiClient = axios.create();

// Add response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      //   window.location.href = "/login";
      alert('unauthorized');
    }
    // return Promise.reject(error);
  }
);

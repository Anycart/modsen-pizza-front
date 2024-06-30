import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (accessToken) => {
  refreshSubscribers.map((callback) => callback(accessToken));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('jwt-token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // If no refresh token, redirect to login
        localStorage.removeItem('jwt-token');
        console.log("Refresh token not found, redirecting to login");
        // window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
          const accessToken = response.data["accessToken"];
          const newRefreshToken = response.data["refreshToken"];
          
          localStorage.setItem('jwt-token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          onRefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('jwt-token');
          localStorage.removeItem('refreshToken');
          console.log("Failed to refresh token, redirecting to login");
          // window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(api(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;

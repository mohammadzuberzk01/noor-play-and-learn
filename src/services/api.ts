
import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
apiClient.interceptors.request.use(
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

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authService = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

// Games
export const gameService = {
  getAllGames: async (params?: { category?: string; difficulty?: string }) => {
    const response = await apiClient.get('/games', { params });
    return response.data;
  },
  
  getGameBySlug: async (slug: string) => {
    const response = await apiClient.get(`/games/${slug}`);
    return response.data;
  }
};

// User Progress
export const progressService = {
  getUserProgress: async () => {
    const response = await apiClient.get('/progress');
    return response.data;
  },
  
  getGameProgress: async (gameSlug: string) => {
    const response = await apiClient.get(`/progress/${gameSlug}`);
    return response.data;
  },
  
  updateGameProgress: async (gameSlug: string, progressData: any) => {
    const response = await apiClient.put(`/progress/${gameSlug}`, progressData);
    return response.data;
  }
};

// Word of the Day
export const wordOfTheDayService = {
  getWordOfTheDay: async () => {
    const response = await apiClient.get('/word-of-the-day/today');
    return response.data;
  },
  
  getWordByDate: async (date: string) => {
    const response = await apiClient.get(`/word-of-the-day/date/${date}`);
    return response.data;
  }
};

export default apiClient;

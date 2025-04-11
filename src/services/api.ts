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

// Generic Question Service
export const questionService = {
  getQuestions: async (gameSlug: string, params?: { difficulty?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get(`/games/${gameSlug}/questions`, { params });
    return response.data;
  },
  
  getRandomQuestions: async (gameSlug: string, params?: { count?: number; difficulty?: string }) => {
    const response = await apiClient.get(`/games/${gameSlug}/questions/random`, { params });
    return response.data;
  },
  
  getQuestion: async (gameSlug: string, questionId: string) => {
    const response = await apiClient.get(`/games/${gameSlug}/questions/${questionId}`);
    return response.data;
  },
  
  createQuestion: async (gameSlug: string, questionData: any) => {
    const response = await apiClient.post(`/games/${gameSlug}/questions`, questionData);
    return response.data;
  },
  
  updateQuestion: async (gameSlug: string, questionId: string, questionData: any) => {
    const response = await apiClient.put(`/games/${gameSlug}/questions/${questionId}`, questionData);
    return response.data;
  },
  
  deleteQuestion: async (gameSlug: string, questionId: string) => {
    const response = await apiClient.delete(`/games/${gameSlug}/questions/${questionId}`);
    return response.data;
  }
};

// Game specific services
export const gameQuestionServices = {
  // Knowledge-based games
  trueFalse: {
    getQuestions: (gameSlug = 'true-or-false', params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions(gameSlug, params),
    getRandomQuestions: (gameSlug = 'true-or-false', count: number = 10, difficulty?: string) => 
      questionService.getRandomQuestions(gameSlug, { count, difficulty }),
    createQuestion: (gameSlug = 'true-or-false', questionData: any) =>
      questionService.createQuestion(gameSlug, questionData),
    updateQuestion: (gameSlug = 'true-or-false', questionId: string, questionData: any) =>
      questionService.updateQuestion(gameSlug, questionId, questionData),
    deleteQuestion: (gameSlug = 'true-or-false', questionId: string) =>
      questionService.deleteQuestion(gameSlug, questionId)
  },
  
  fiqhMastermind: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('fiqh-mastermind', params),
    getRandomQuestions: (count: number = 10, difficulty?: string) => 
      questionService.getRandomQuestions('fiqh-mastermind', { count, difficulty }),
  },
  
  quizDuel: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('quiz-duel', params),
    getRandomQuestions: (count: number = 10, difficulty?: string) => 
      questionService.getRandomQuestions('quiz-duel', { count, difficulty }),
  },
  
  trivia: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('trivia', params),
    getRandomQuestions: (count: number = 10, difficulty?: string) => 
      questionService.getRandomQuestions('trivia', { count, difficulty }),
  },
  
  // Word games
  wordSearch: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('word-search', params),
    getRandomQuestions: (count: number = 1, difficulty?: string) => 
      questionService.getRandomQuestions('word-search', { count, difficulty }),
  },
  
  wordOfTheDay: {
    getWordOfTheDay: async () => {
      const response = await apiClient.get('/word-of-the-day/today');
      return response.data;
    },
    getWordByDate: async (date: string) => {
      const response = await apiClient.get(`/word-of-the-day/date/${date}`);
      return response.data;
    }
  },
  
  // Matching games
  prophetMatch: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('prophet-match', params),
    getRandomQuestions: (count: number = 1, difficulty?: string) => 
      questionService.getRandomQuestions('prophet-match', { count, difficulty }),
  },
  
  // Memory games
  flashcards: {
    getQuestions: (params?: { difficulty?: string; limit?: number; category?: string }) => 
      questionService.getQuestions('flashcards', params),
    getRandomQuestions: (count: number = 10, difficulty?: string) => 
      questionService.getRandomQuestions('flashcards', { count, difficulty }),
  },
  
  // Helper function for any game
  getGameQuestionService: (gameSlug: string) => {
    return {
      getQuestions: (params?: { difficulty?: string; limit?: number }) => 
        questionService.getQuestions(gameSlug, params),
      getRandomQuestions: (count: number = 10, difficulty?: string) => 
        questionService.getRandomQuestions(gameSlug, { count, difficulty }),
      createQuestion: (questionData: any) =>
        questionService.createQuestion(gameSlug, questionData),
      updateQuestion: (questionId: string, questionData: any) =>
        questionService.updateQuestion(gameSlug, questionId, questionData),
      deleteQuestion: (questionId: string) =>
        questionService.deleteQuestion(gameSlug, questionId)
    };
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

export default apiClient;

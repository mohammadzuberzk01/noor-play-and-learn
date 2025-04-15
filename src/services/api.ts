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
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
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
      localStorage.removeItem('adminToken');
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
  
  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/admin/login', credentials);
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  adminLogout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
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
  },
  
  createGame: async (gameData: any) => {
    const response = await apiClient.post('/games', gameData);
    return response.data;
  },
  
  updateGame: async (id: string, gameData: any) => {
    const response = await apiClient.put(`/games/${id}`, gameData);
    return response.data;
  },
  
  deleteGame: async (id: string) => {
    const response = await apiClient.delete(`/games/${id}`);
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
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('true-or-false', params),
    getRandomQuestions: (count = 10, difficulty?: string) => 
      questionService.getRandomQuestions('true-or-false', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('true-or-false', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('true-or-false', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('true-or-false', questionId)
  },
  
  fiqhMastermind: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('fiqh-mastermind', params),
    getRandomQuestions: (count = 10, difficulty?: string) => 
      questionService.getRandomQuestions('fiqh-mastermind', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('fiqh-mastermind', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('fiqh-mastermind', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('fiqh-mastermind', questionId)
  },
  
  quizDuel: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('quiz-duel', params),
    getRandomQuestions: (count = 10, difficulty?: string) => 
      questionService.getRandomQuestions('quiz-duel', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('quiz-duel', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('quiz-duel', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('quiz-duel', questionId)
  },
  
  trivia: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('trivia', params),
    getRandomQuestions: (count = 10, difficulty?: string) => 
      questionService.getRandomQuestions('trivia', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('trivia', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('trivia', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('trivia', questionId)
  },
  
  // Word games
  wordSearch: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('word-search', params),
    getRandomQuestions: (count = 1, difficulty?: string) => 
      questionService.getRandomQuestions('word-search', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('word-search', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('word-search', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('word-search', questionId)
  },
  
  wordOfTheDay: {
    getWordOfTheDay: async () => {
      const response = await apiClient.get('/word-of-the-day/today');
      return response.data;
    },
    getWordByDate: async (date: string) => {
      const response = await apiClient.get(`/word-of-the-day/date/${date}`);
      return response.data;
    },
    createWord: async (wordData: any) => {
      const response = await apiClient.post('/word-of-the-day', wordData);
      return response.data;
    },
    updateWord: async (wordId: string, wordData: any) => {
      const response = await apiClient.put(`/word-of-the-day/${wordId}`, wordData);
      return response.data;
    },
    deleteWord: async (wordId: string) => {
      const response = await apiClient.delete(`/word-of-the-day/${wordId}`);
      return response.data;
    }
  },
  
  // Matching games
  prophetMatch: {
    getQuestions: (params?: { difficulty?: string; limit?: number }) => 
      questionService.getQuestions('prophet-match', params),
    getRandomQuestions: (count = 1, difficulty?: string) => 
      questionService.getRandomQuestions('prophet-match', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('prophet-match', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('prophet-match', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('prophet-match', questionId)
  },
  
  // Memory games
  flashcards: {
    getQuestions: (params?: { difficulty?: string; limit?: number; category?: string }) => 
      questionService.getQuestions('flashcards', params),
    getRandomQuestions: (count = 10, difficulty?: string) => 
      questionService.getRandomQuestions('flashcards', { count, difficulty }),
    createQuestion: (questionData: any) =>
      questionService.createQuestion('flashcards', questionData),
    updateQuestion: (questionId: string, questionData: any) =>
      questionService.updateQuestion('flashcards', questionId, questionData),
    deleteQuestion: (questionId: string) =>
      questionService.deleteQuestion('flashcards', questionId)
  },
  
  // Helper function for any game
  getGameQuestionService: (gameSlug: string) => {
    return {
      getQuestions: (params?: { difficulty?: string; limit?: number }) => 
        questionService.getQuestions(gameSlug, params),
      getRandomQuestions: (count = 10, difficulty?: string) => 
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

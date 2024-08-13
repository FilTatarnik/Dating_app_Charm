import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
};

export const userService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  uploadPhoto: (photoData) => api.post('/photos', photoData),
};

export const matchService = {
  getPotentialMatches: () => api.get('/matches/potential'),
  likeUser: (userId) => api.post('/matches/like', { likedUserId: userId }),
  getMatches: () => api.get('/matches'),
  getPotentialMatches: () => api.get('/matches/potential'),
  likeUser: (userId) => api.post('/matches/like', { likedUserId: userId }),
  getMatches: () => api.get('/matches'),
};

export const messageService = {
  sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),
  getConversation: (partnerId) => api.get(`/messages/${partnerId}`),
};

export default api;
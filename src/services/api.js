import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  verify: () => api.get('/auth/verify'),
};

export const adminAPI = {
  uploadProfilePic: (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);
    return api.post('/admin/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getProfilePic: () => api.get('/admin/profile-pic'),
  getComments: () => api.get('/admin/comments'),
  approveComment: (id, approved) => api.post(`/admin/comments/${id}/approve`, { approved }),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export const commentsAPI = {
  postComment: (name, email, message) => api.post('/comments', { name, email, message }),
  getComments: () => api.get('/comments'),
};

export const trafficAPI = {
  getAnalytics: (timeframe) => api.get('/traffic/analytics', { params: { timeframe } }),
  getTopPages: () => api.get('/traffic/top-pages'),
  getReferrers: () => api.get('/traffic/referrers'),
  getBrowsers: () => api.get('/traffic/browsers'),
};

export default api;

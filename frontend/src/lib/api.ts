import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with credentials support for cookies
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local auth state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== COOKIE UTILITIES ====================

export const cookieUtils = {
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  },

  getJSONCookie(name: string): any | null {
    const value = this.getCookie(name);
    if (!value) return null;
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (e) {
      return null;
    }
  },

  getUserInfo(): { username: string; email: string } | null {
    return this.getJSONCookie('user_info');
  },

  getUserPreferences(): { theme: string; notifications: boolean; emailUpdates: boolean } | null {
    return this.getJSONCookie('user_preferences');
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  async login(username: string, email: string) {
    const response = await api.post('/api/auth/login', { username, email });
    return response.data;
  },

  async logout() {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return { user: null, authenticated: false };
    }
  },
};

// ==================== FORUM API ====================

export const forumAPI = {
  async getCategories() {
    const response = await api.get('/api/categories');
    return response.data;
  },

  async getPosts(category: string = 'all', page: number = 1, limit: number = 20, search?: string) {
    const response = await api.get('/api/forum/posts', {
      params: { category, page, limit, search }
    });
    return response.data;
  },

  async getPost(id: number) {
    const response = await api.get(`/api/forum/posts/${id}`);
    return response.data;
  },

  async createPost(title: string, content: string, categoryId: number) {
    const response = await api.post('/api/forum/posts', {
      title, content, categoryId
    });
    return response.data;
  },

  async createReply(postId: number, content: string) {
    const response = await api.post(`/api/forum/posts/${postId}/replies`, { content });
    return response.data;
  },

  async markHelpful(replyId: number) {
    const response = await api.post(`/api/forum/replies/${replyId}/helpful`);
    return response.data;
  },
};

// ==================== PROGRESS API ====================

export const progressAPI = {
  async getProgress() {
    const response = await api.get('/api/progress');
    return response.data;
  },

  async updateProgress(courseId: number, completed: boolean) {
    const response = await api.post('/api/progress', { courseId, completed });
    return response.data;
  },
};

export default api;

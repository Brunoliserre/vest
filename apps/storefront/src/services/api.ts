import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Products
export const productsAPI = {
  getAll: (params?: any) => api.get('/api/products', { params }),
  getById: (id: string) => api.get(`/api/products/${id}`),
  search: (params: any) => api.get('/api/products/search', { params }),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getBySlug: (slug: string) => api.get(`/api/categories/slug/${slug}`),
};

// Cart
export const cartAPI = {
  get: () => api.get('/api/cart'),
  addItem: (productId: string, quantity: number) =>
    api.post('/api/cart/items', { productId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/api/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/api/cart/items/${itemId}`),
  clear: () => api.delete('/api/cart'),
  merge: (items: { productId: string; quantity: number }[]) =>
    api.post('/api/cart/merge', { items }),
};

// Orders
export const ordersAPI = {
  create: (items: { productId: string; quantity: number }[]) =>
    api.post('/api/orders', { items }),
  getAll: () => api.get('/api/orders'),
  getById: (id: string) => api.get(`/api/orders/${id}`),
};
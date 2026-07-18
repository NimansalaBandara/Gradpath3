import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { User, RegisterResponse, LoginResponse, StudentProfile, ApplicationTracker, TrackerStatus, DocumentItem, SubscriptionStatus, AIRecommendation } from '../types/api';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post<{ access: string }>('/api/auth/refresh/', { refresh });
          localStorage.setItem('access_token', data.access);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
          }
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
    api.post<RegisterResponse>('/auth/register/', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login/', data).then((r) => r.data),

  me: () => api.get<User>('/auth/me/').then((r) => r.data),

  refresh: (refresh: string) =>
    api.post<{ access: string }>('/auth/refresh/', { refresh }).then((r) => r.data),
};

export const trackerApi = {
  list: () => api.get<ApplicationTracker[]>('/applications/tracker/').then((r) => r.data),
  add: (data: { course_id: number; status?: TrackerStatus; notes?: string; deadline?: string }) =>
    api.post<ApplicationTracker>('/applications/tracker/', data).then((r) => r.data),
  update: (id: number, data: { status?: TrackerStatus; notes?: string; deadline?: string | null; applied_date?: string | null }) =>
    api.patch<ApplicationTracker>(`/applications/tracker/${id}/`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/applications/tracker/${id}/`),
};

export const documentsApi = {
  list: () => api.get<DocumentItem[]>('/applications/documents/').then((r) => r.data),
  upload: (formData: FormData) =>
    api.post<DocumentItem>('/applications/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  updateStatus: (id: number, status: 'pending' | 'complete') =>
    api.patch<DocumentItem>(`/applications/documents/${id}/`, { status }).then((r) => r.data),
  remove: (id: number) => api.delete(`/applications/documents/${id}/`),
};

export const profileApi = {
  update: (data: Partial<StudentProfile> & { first_name?: string; last_name?: string }) =>
    api.patch<User>('/auth/profile/', data).then((r) => r.data),
};

export const billingApi = {
  activate: () => api.post<User>('/billing/activate/').then((r) => r.data),
  status: () => api.get<SubscriptionStatus>('/billing/subscription/').then((r) => r.data),
};

export const recommendationsApi = {
  get: () => api.get<AIRecommendation[]>('/recommendations/').then((r) => r.data),
};

export default api;

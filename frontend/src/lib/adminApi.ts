import api from './api';
import type { AdminStats, AdminUser, University, Course, Scholarship } from '../types/api';

export const adminApi = {
  stats: () =>
    api.get<AdminStats>('/auth/admin/stats/').then((r) => r.data),

  users: {
    list: () =>
      api.get<AdminUser[]>('/auth/admin/users/').then((r) => r.data),
    update: (id: number, data: { role?: 'student' | 'admin'; is_premium?: boolean }) =>
      api.patch<AdminUser>(`/auth/admin/users/${id}/`, data).then((r) => r.data),
  },

  universities: {
    list: () =>
      api.get<{ results: University[]; count: number }>('/catalog/universities/?page_size=200').then((r) => r.data),
    create: (data: Partial<University>) =>
      api.post<University>('/catalog/universities/', data).then((r) => r.data),
    update: (id: number, data: Partial<University>) =>
      api.patch<University>(`/catalog/universities/${id}/`, data).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/catalog/universities/${id}/`),
  },

  courses: {
    list: () =>
      api.get<{ results: Course[]; count: number }>('/catalog/courses/?page_size=200').then((r) => r.data),
    create: (data: Partial<Course>) =>
      api.post<Course>('/catalog/courses/', data).then((r) => r.data),
    update: (id: number, data: Partial<Course>) =>
      api.patch<Course>(`/catalog/courses/${id}/`, data).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/catalog/courses/${id}/`),
  },

  scholarships: {
    list: () =>
      api.get<{ results: Scholarship[]; count: number }>('/catalog/scholarships/?page_size=200').then((r) => r.data),
    create: (data: Partial<Scholarship>) =>
      api.post<Scholarship>('/catalog/scholarships/', data).then((r) => r.data),
    update: (id: number, data: Partial<Scholarship>) =>
      api.patch<Scholarship>(`/catalog/scholarships/${id}/`, data).then((r) => r.data),
    remove: (id: number) =>
      api.delete(`/catalog/scholarships/${id}/`),
  },
};

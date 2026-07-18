import api from './api';
import type { University, Course, Scholarship, PaginatedResponse } from '../types/api';

export interface UniversityParams {
  search?: string;
  city?: string;
  ranking_min?: number;
  ranking_max?: number;
  page?: number;
}

export interface CourseParams {
  university?: number;
  level?: string;
  field?: string;
  search?: string;
  page?: number;
}

export interface ScholarshipParams {
  search?: string;
  type?: string;
  field?: string;
  page?: number;
}

export const catalogApi = {
  universities: (params?: UniversityParams) =>
    api.get<PaginatedResponse<University>>('/catalog/universities/', { params }).then(r => r.data),

  university: (id: number) =>
    api.get<University>(`/catalog/universities/${id}/`).then(r => r.data),

  courses: (params?: CourseParams) =>
    api.get<PaginatedResponse<Course>>('/catalog/courses/', { params }).then(r => r.data),

  course: (id: number) =>
    api.get<Course>(`/catalog/courses/${id}/`).then(r => r.data),

  scholarships: (params?: ScholarshipParams) =>
    api.get<PaginatedResponse<Scholarship>>('/catalog/scholarships/', { params }).then(r => r.data),
};

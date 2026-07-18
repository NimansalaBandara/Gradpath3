export interface StudentProfile {
  field_of_study: string;
  current_degree: string;
  gpa: string | null;
  graduation_year: number | null;
  target_level: 'masters' | 'phd' | '';
  ielts_score: string | null;
  gre_score: number | null;
  work_experience_years: number | null;
  preferred_intake: string;
  bio: string;
  country_of_origin: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'admin';
  is_premium: boolean;
  student_profile: StudentProfile | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user?: User;
}

export interface RegisterResponse extends AuthTokens {
  user: User;
}

export interface ApiError {
  detail?: string;
  [field: string]: string | string[] | undefined;
}

// Catalog types

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface University {
  id: number;
  name: string;
  city: string;
  country: string;
  world_ranking: number | null;
  logo_url: string;
  description: string;
  website_url: string;
  course_count: number;
}

export interface UniversityBrief {
  id: number;
  name: string;
  city: string;
  country: string;
  world_ranking: number | null;
  website_url: string;
}

export interface Course {
  id: number;
  title: string;
  level: 'masters' | 'phd';
  field: string;
  duration: string;
  tuition_fee: string | null;
  requirements: string;
  description: string;
  application_url: string;
  deadline: string | null;
  university: UniversityBrief;
  university_name?: string;
  university_id?: number;
  university_city?: string;
}

export interface Scholarship {
  id: number;
  name: string;
  type: 'full' | 'partial' | 'full_ride';
  amount: string | null;
  eligibility: string;
  deadline: string | null;
  link: string;
  field: string;
  university: number | null;
  university_name: string | null;
  university_id: number | null;
}

// Applications

export type TrackerStatus =
  | 'hope_to_apply'
  | 'not_yet'
  | 'applied'
  | 'interviewed'
  | 'rejected'
  | 'accepted'
  | 'waitlisted';

export interface ApplicationTracker {
  id: number;
  course: {
    id: number;
    title: string;
    level: 'masters' | 'phd';
    university: { id: number; name: string; city: string };
  };
  status: TrackerStatus;
  notes: string;
  applied_date: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export type DocType = 'sop' | 'visa' | 'passport' | 'transcript' | 'cv' | 'other';

export interface DocumentItem {
  id: number;
  doc_type: DocType;
  file: string | null;
  file_url: string | null;
  status: 'pending' | 'complete';
  uploaded_at: string;
  notes: string;
}

// Billing / Premium

export interface SubscriptionStatus {
  is_premium: boolean;
  subscription: {
    plan: string;
    status: string;
    started_at: string;
    expires_at: string | null;
  } | null;
}

// Admin

export interface AdminStats {
  total_students: number;
  premium_count: number;
  total_universities: number;
  total_courses: number;
  total_scholarships: number;
  most_tracked: {
    course_id: number;
    title: string;
    university: string;
    tracker_count: number;
  }[];
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'admin';
  is_premium: boolean;
  date_joined: string;
}

// AI Recommendations

export interface AIRecommendation {
  course_id: number;
  title: string;
  university: string;
  university_id: number;
  level: 'masters' | 'phd';
  match_reason: string;
  match_score: number;
}

export interface AIScholarshipRecommendation extends Scholarship {
  match_score: number;
  match_reason: string;
}

// Type definitions for the Student Management Dashboard
export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourse: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
}

export interface FormErrors {
  name?: string;
  email?: string;
  enrolledCourse?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoadingState {
  students: boolean;
  courses: boolean;
  saving: boolean;
  deleting: string | null; // student id being deleted
}
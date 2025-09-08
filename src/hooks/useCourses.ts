/**
 * Custom hook for managing course data
 * Demonstrates custom hook patterns and async state management
 */

import { useState, useEffect } from 'react';
import { Course } from '../types';
import { fetchCourses } from '../utils/mockApi';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing course data
 * @returns Object containing courses, loading state, error state, and refetch function
 */
export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch courses using async/await pattern
      const response = await fetchCourses();
      setCourses(response.data);
    } catch (err) {
      // Handle and display user-friendly error messages
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    refetch: loadCourses,
  };
};
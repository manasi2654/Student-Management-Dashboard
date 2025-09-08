/**
 * Custom hook for managing student data
 * Demonstrates complex state management, CRUD operations, and async patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { Student, LoadingState } from '../types';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../utils/mockApi';

interface UseStudentsReturn {
  students: Student[];
  loading: LoadingState;
  error: string | null;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  refreshStudents: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for comprehensive student management
 * @returns Object containing student data and CRUD operations
 */
export const useStudents = (): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    students: true,
    courses: false,
    saving: false,
    deleting: null,
  });
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates specific loading states
   * @param updates - Partial loading state updates
   */
  const updateLoading = useCallback((updates: Partial<LoadingState>) => {
    setLoading(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Loads all students from the API
   */
  const loadStudents = useCallback(async (): Promise<void> => {
    try {
      updateLoading({ students: true });
      setError(null);
      
      const response = await fetchStudents();
      setStudents(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load students';
      setError(errorMessage);
      console.error('Error loading students:', err);
    } finally {
      updateLoading({ students: false });
    }
  }, [updateLoading]);

  /**
   * Adds a new student
   * @param studentData - Student data to add
   */
  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      updateLoading({ saving: true });
      setError(null);
      
      const response = await createStudent(studentData);
      
      // Optimistically update the UI by adding the new student to the list
      setStudents(prev => [response.data, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add student';
      setError(errorMessage);
      throw err; // Re-throw to allow form to handle the error
    } finally {
      updateLoading({ saving: false });
    }
  }, [updateLoading]);

  /**
   * Updates an existing student
   * @param id - Student ID to update
   * @param updates - Partial student data to update
   */
  const editStudent = useCallback(async (id: string, updates: Partial<Student>): Promise<void> => {
    try {
      updateLoading({ saving: true });
      setError(null);
      
      const response = await updateStudent(id, updates);
      
      // Update the student in the local state
      setStudents(prev => prev.map(student => 
        student.id === id ? response.data : student
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student';
      setError(errorMessage);
      throw err;
    } finally {
      updateLoading({ saving: false });
    }
  }, [updateLoading]);

  /**
   * Removes a student
   * @param id - Student ID to remove
   */
  const removeStudent = useCallback(async (id: string): Promise<void> => {
    try {
      updateLoading({ deleting: id });
      setError(null);
      
      await deleteStudent(id);
      
      // Remove student from local state
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete student';
      setError(errorMessage);
      throw err;
    } finally {
      updateLoading({ deleting: null });
    }
  }, [updateLoading]);

  /**
   * Clears any existing error messages
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    loading,
    error,
    addStudent,
    editStudent,
    removeStudent,
    refreshStudents: loadStudents,
    clearError,
  };
};
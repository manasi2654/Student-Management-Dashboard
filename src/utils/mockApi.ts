/**
 * Mock API functions to simulate real backend interactions
 * Demonstrates async/await patterns and error handling
 */

import { Student, Course, ApiResponse } from '../types';

// Simulate network delay for realistic API behavior
const simulateNetworkDelay = (min: number = 500, max: number = 1500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock courses data
const mockCourses: Course[] = [
  { id: '1', name: 'Computer Science', code: 'CS101', description: 'Introduction to Programming', credits: 3 },
  { id: '2', name: 'Mathematics', code: 'MATH201', description: 'Advanced Calculus', credits: 4 },
  { id: '3', name: 'Physics', code: 'PHYS101', description: 'Classical Mechanics', credits: 3 },
  { id: '4', name: 'Chemistry', code: 'CHEM101', description: 'General Chemistry', credits: 3 },
  { id: '5', name: 'Biology', code: 'BIO101', description: 'Cell Biology', credits: 3 },
  { id: '6', name: 'English Literature', code: 'ENG201', description: 'Modern Literature', credits: 3 },
  { id: '7', name: 'History', code: 'HIST101', description: 'World History', credits: 3 },
  { id: '8', name: 'Psychology', code: 'PSYC101', description: 'Introduction to Psychology', credits: 3 },
];

// Mock students data stored in localStorage for persistence
const STUDENTS_STORAGE_KEY = 'students_dashboard_data';

/**
 * Gets students from localStorage or returns empty array
 * @returns Array of students
 */
const getStoredStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (stored) {
      const students = JSON.parse(stored);
      // Convert date strings back to Date objects
      return students.map((student: any) => ({
        ...student,
        createdAt: new Date(student.createdAt),
        updatedAt: new Date(student.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading students from storage:', error);
  }
  return [];
};

/**
 * Saves students to localStorage
 * @param students - Array of students to save
 */
const saveStudentsToStorage = (students: Student[]): void => {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to storage:', error);
  }
};

/**
 * Fetches all available courses
 * @returns Promise resolving to courses array
 */
export const fetchCourses = async (): Promise<ApiResponse<Course[]>> => {
  await simulateNetworkDelay();
  
  // Simulate occasional API errors (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch courses. Please try again.');
  }

  return {
    data: mockCourses,
    message: 'Courses fetched successfully'
  };
};

/**
 * Fetches all students
 * @returns Promise resolving to students array
 */
export const fetchStudents = async (): Promise<ApiResponse<Student[]>> => {
  await simulateNetworkDelay();
  
  const students = getStoredStudents();
  
  return {
    data: students,
    message: 'Students fetched successfully'
  };
};

/**
 * Creates a new student
 * @param studentData - Student data to create
 * @returns Promise resolving to created student
 */
export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>> => {
  await simulateNetworkDelay();
  
  const students = getStoredStudents();
  const now = new Date();
  
  const newStudent: Student = {
    ...studentData,
    id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  
  students.push(newStudent);
  saveStudentsToStorage(students);
  
  return {
    data: newStudent,
    message: 'Student created successfully'
  };
};

/**
 * Updates an existing student
 * @param studentId - ID of student to update
 * @param updates - Partial student data to update
 * @returns Promise resolving to updated student
 */
export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<ApiResponse<Student>> => {
  await simulateNetworkDelay();
  
  const students = getStoredStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex === -1) {
    throw new Error('Student not found');
  }
  
  const updatedStudent: Student = {
    ...students[studentIndex],
    ...updates,
    id: studentId, // Ensure ID doesn't change
    updatedAt: new Date(),
  };
  
  students[studentIndex] = updatedStudent;
  saveStudentsToStorage(students);
  
  return {
    data: updatedStudent,
    message: 'Student updated successfully'
  };
};

/**
 * Deletes a student
 * @param studentId - ID of student to delete
 * @returns Promise resolving to success message
 */
export const deleteStudent = async (studentId: string): Promise<ApiResponse<null>> => {
  await simulateNetworkDelay();
  
  const students = getStoredStudents();
  const filteredStudents = students.filter(s => s.id !== studentId);
  
  if (filteredStudents.length === students.length) {
    throw new Error('Student not found');
  }
  
  saveStudentsToStorage(filteredStudents);
  
  return {
    data: null,
    message: 'Student deleted successfully'
  };
};
/**
 * Form validation utilities
 * Demonstrates input validation patterns and error handling
 */

import { FormErrors, Student } from '../types';

// Email regex pattern for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates student form data
 * @param student - Student data to validate
 * @returns Object containing any validation errors
 */
export const validateStudent = (student: Partial<Student>): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!student.name || student.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (student.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!student.email || student.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(student.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Course validation
  if (!student.enrolledCourse || student.enrolledCourse.trim().length === 0) {
    errors.enrolledCourse = 'Please select a course';
  }

  return errors;
};

/**
 * Checks if the form has any validation errors
 * @param errors - FormErrors object
 * @returns boolean indicating if form is valid
 */
export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Generates a random profile image URL from a selection of placeholder images
 * @returns string URL for profile image
 */
export const generateProfileImage = (): string => {
  const imageUrls = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/men/44.jpg",
    "https://randomuser.me/api/portraits/men/76.jpg",
    "https://randomuser.me/api/portraits/men/65.jpg",
    "https://randomuser.me/api/portraits/women/23.jpg",
    "https://randomuser.me/api/portraits/men/85.jpg",
    "https://randomuser.me/api/portraits/women/91.jpg",
    "https://randomuser.me/api/portraits/men/53.jpg",
    "https://randomuser.me/api/portraits/women/36.jpg",
  ];

  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};
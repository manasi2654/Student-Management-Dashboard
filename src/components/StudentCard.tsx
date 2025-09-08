/**
 * Individual student card component
 * Demonstrates component composition, event handling, and responsive design
 */

import React from 'react';
import { Student, Course } from '../types';
import { Edit, Trash2, Mail, BookOpen, Clock } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  courses: Course[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  isDeleting: boolean;
}

/**
 * Student card component displaying student information with edit/delete actions
 * @param student - Student data to display
 * @param courses - Available courses for looking up course names
 * @param onEdit - Function called when edit button is clicked
 * @param onDelete - Function called when delete button is clicked
 * @param isDeleting - Whether this student is currently being deleted
 */
export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  courses,
  onEdit,
  onDelete,
  isDeleting
}) => {
  // Find the course name for the enrolled course ID
  const enrolledCourse = courses.find(course => course.id === student.enrolledCourse);
  const courseName = enrolledCourse ? enrolledCourse.name : student.enrolledCourse;

  const handleEdit = () => {
    onEdit(student);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      onDelete(student.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      {/* Student Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={student.profileImage || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face`}
            alt={`${student.name}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <Mail className="w-4 h-4 mr-1" aria-hidden="true" />
              <a 
                href={`mailto:${student.email}`}
                className="hover:text-blue-600 transition-colors duration-200"
                aria-label={`Send email to ${student.name}`}
              >
                {student.email}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            aria-label={`Edit ${student.name}`}
            disabled={isDeleting}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDeleting
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            }`}
            aria-label={`Delete ${student.name}`}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Course Information */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center text-gray-700">
          <BookOpen className="w-4 h-4 mr-2 text-blue-500" aria-hidden="true" />
          <span className="font-medium">Enrolled Course:</span>
          <span className="ml-2">{courseName}</span>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
          <span>Added: {student.createdAt.toLocaleDateString()}</span>
        </div>
        {student.updatedAt.getTime() !== student.createdAt.getTime() && (
          <span>Updated: {student.updatedAt.toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};
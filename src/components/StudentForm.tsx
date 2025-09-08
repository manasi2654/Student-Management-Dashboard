/**
 * Student form component for creating and editing students
 * Demonstrates controlled components, form validation, async operations, and image upload
 */

import React, { useState, useEffect, useMemo } from "react";
import { Student, Course, FormErrors } from "../types";
import {
  validateStudent,
  isFormValid,
  generateProfileImage,
} from "../utils/validation";
import { LoadingSpinner } from "./LoadingSpinner";
import { User, Mail, BookOpen, Image, Save, X } from "lucide-react";

interface StudentFormProps {
  student?: Student | null;
  courses: Course[];
  onSubmit: (
    student: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  courses,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrolledCourse: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        enrolledCourse: student.enrolledCourse,
        profileImage: student.profileImage || "",
      });
    } else {
      setFormData({ name: "", email: "", enrolledCourse: "", profileImage: "" });
    }
    setErrors({});
    setTouched({});
  }, [student]);

  const validationErrors = useMemo(() => validateStudent(formData), [formData]);

  useEffect(() => {
    setErrors(validationErrors);
  }, [validationErrors]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, enrolledCourse: true });

    if (!isFormValid(validationErrors)) return;

    try {
      const profileImage = formData.profileImage || generateProfileImage();
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        enrolledCourse: formData.enrolledCourse,
        profileImage,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleGenerateImage = () => {
    const newImage = generateProfileImage();
    handleInputChange("profileImage", newImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <User className="w-4 h-4 inline mr-1" /> Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 ${
                touched.name && errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter student's full name"
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
              disabled={isSubmitting}
            />
            {touched.name && errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <Mail className="w-4 h-4 inline mr-1" /> Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 ${
                touched.email && errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="student@example.com"
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {touched.email && errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <BookOpen className="w-4 h-4 inline mr-1" /> Enrolled Course *
            </label>
            <select
              id="course"
              value={formData.enrolledCourse}
              onChange={(e) => handleInputChange("enrolledCourse", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 ${
                touched.enrolledCourse && errors.enrolledCourse
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-describedby={
                touched.enrolledCourse && errors.enrolledCourse
                  ? "course-error"
                  : undefined
              }
              disabled={isSubmitting}
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {touched.enrolledCourse && errors.enrolledCourse && (
              <p
                id="course-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.enrolledCourse}
              </p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <Image className="w-4 h-4 inline mr-1" /> Profile Image (Optional)
            </label>

            <div className="flex flex-col space-y-2">
              {/* URL Input + Generate */}
              <div className="flex space-x-2">
                <input
                  type="url"
                  id="profileImage"
                  value={formData.profileImage}
                  onChange={(e) =>
                    handleInputChange("profileImage", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Generate
                </button>
              </div>

              {/* Browse File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="profileFile"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleInputChange("profileImage", reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="profileFile"
                  className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Browse...
                </label>
              </div>
            </div>

            {/* Preview */}
            {formData.profileImage && (
              <div className="mt-3">
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid(validationErrors)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting || !isFormValid(validationErrors)
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {student ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

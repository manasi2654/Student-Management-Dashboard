import React, { useState, useEffect, useMemo } from "react";
import { Student } from "../types";
import { useStudents } from "../hooks/useStudents";
import { useCourses } from "../hooks/useCourses";
import { StudentCard } from "./StudentCard";
import { StudentForm } from "./StudentForm";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import {
  Users,
  Plus,
  Clock,
  RefreshCw,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";

export const Dashboard: React.FC = () => {
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    addStudent,
    editStudent,
    removeStudent,
    refreshStudents,
    clearError: clearStudentsError,
  } = useStudents();

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourses();


  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const autoRefreshTimeout = setTimeout(() => {
      if (!studentsLoading.students && !coursesLoading) {
        console.log("Auto-refreshing data...");
      }
    }, 300000);
    return () => clearTimeout(autoRefreshTimeout);
  }, [studentsLoading.students, coursesLoading, refreshStudents]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        courses
          .find((course) => course.id === student.enrolledCourse)
          ?.name.toLowerCase()
          .includes(query)
    );
  }, [students, searchQuery, courses]);

  const statistics = useMemo(() => {
    const courseEnrollment = courses.reduce((acc, course) => {
      acc[course.id] = students.filter(
        (student) => student.enrolledCourse === course.id
      ).length;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularCourse = Object.entries(courseEnrollment).reduce(
      (max, [courseId, count]) =>
        count > max.count ? { courseId, count } : max,
      { courseId: "", count: 0 }
    );

    return {
      totalStudents: students.length,
      courseEnrollment,
      mostPopularCourse:
        courses.find((c) => c.id === mostPopularCourse.courseId)?.name ||
        "None",
    };
  }, [students, courses]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleSubmitStudent = async (
    studentData: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingStudent) {
        await editStudent(editingStudent.id, studentData);
      } else {
        await addStudent(studentData);
      }
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error submitting student:", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await removeStudent(studentId);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([refreshStudents(), refetchCourses()]);
  };

  if (studentsLoading.students && coursesLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    
    
    <div className={theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      
    }>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-gray-800/70 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Student Management</h1>
              <p className="text-sm opacity-70">
                Manage your students and courses efficiently
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-mono opacity-80">
              <Clock className="w-4 h-4 mr-2" />
              {currentTime.toLocaleTimeString()}
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Messages */}
        {studentsError && (
          <ErrorMessage
            message={studentsError}
            onDismiss={clearStudentsError}
            className="mb-6"
          />
        )}
        {coursesError && (
          <ErrorMessage
            message={coursesError}
            onDismiss={() => {}}
            className="mb-6"
          />
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-400 text-white p-6 shadow-lg">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm">Total Students</p>
            <p className="text-2xl font-bold">{statistics.totalStudents}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-tr from-green-500 to-green-400 text-white p-6 shadow-lg">
            <BookOpen className="w-8 h-8 mb-2" />
            <p className="text-sm">Available Courses</p>
            <p className="text-2xl font-bold">{courses.length}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-tr from-purple-500 to-purple-400 text-white p-6 shadow-lg">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm">Most Popular Course</p>
            <p className="text-lg font-bold truncate">
              {statistics.mostPopularCourse}
            </p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button
              onClick={handleAddStudent}
              disabled={coursesLoading || !!coursesError}
              className="flex items-center px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={studentsLoading.students || coursesLoading}
              className="flex items-center px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  studentsLoading.students || coursesLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Students */}
        {studentsLoading.students ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading students..." />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 opacity-80">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "No students found" : "No students yet"}
            </h3>
            <p className="mb-6">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first student"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddStudent}
                className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Student
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <StudentCard
                  student={student}
                  courses={courses}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  isDeleting={studentsLoading.deleting === student.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Form Modal */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            courses={courses}
            onSubmit={handleSubmitStudent}
            onCancel={handleCancelForm}
            isSubmitting={studentsLoading.saving}
          />
        )}
      </main>
    </div>
  );
};

/**
 * Reusable error message component
 * Demonstrates error handling and user feedback patterns
 */

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Error message component with optional dismiss functionality
 * @param message - Error message to display
 * @param onDismiss - Optional function to call when error is dismissed
 * @param className - Additional CSS classes
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = ''
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`} role="alert">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 p-0.5 text-red-400 hover:text-red-600 transition-colors duration-200"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
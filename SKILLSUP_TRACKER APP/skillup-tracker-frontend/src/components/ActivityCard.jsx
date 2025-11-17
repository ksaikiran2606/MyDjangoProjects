import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle, Clock } from 'lucide-react';

const ActivityCard = ({ activity, onEdit, onDelete, onStatusChange }) => {
  // Add safety check for undefined activity
  if (!activity) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Activity data not available</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-500" />
    );
  };

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activity.topic || 'No topic'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(activity)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activity.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {activity.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {activity.category_name && (
          <span
            className="px-2 py-1 text-xs rounded-full text-white"
            style={{ backgroundColor: activity.category?.color || '#3B82F6' }}
          >
            {activity.category_name}
          </span>
        )}
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
          {getStatusIcon(activity.status)} {activity.status}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(activity.date).toLocaleDateString()}</span>
        </div>
        <button
          onClick={() => onStatusChange(activity.id, activity.status === 'completed' ? 'pending' : 'completed')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            activity.status === 'completed'
              ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {activity.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
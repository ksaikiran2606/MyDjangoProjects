import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar } from 'lucide-react';
import { activitiesAPI, categoriesAPI } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import Loader from '../components/Loader';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    ordering: '-date',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search || undefined,
        status: filters.status || undefined,
        category: filters.category || undefined,
        ordering: filters.ordering,
      };
      
      const response = await activitiesAPI.getActivities(params);
      setActivities(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStatusChange = async (activityId, newStatus) => {
    try {
      await activitiesAPI.updateActivity(activityId, { status: newStatus });
      fetchActivities(); // Refresh list
    } catch (error) {
      console.error('Failed to update activity status:', error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activitiesAPI.deleteActivity(activityId);
        fetchActivities(); // Refresh list
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      ordering: '-date',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Learning Activities
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track and manage all your learning activities
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <a
                href="/add-activity"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </a>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {(filters.status || filters.category || filters.ordering !== '-date') && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="-date">Newest First</option>
                  <option value="date">Oldest First</option>
                  <option value="-created_at">Recently Added</option>
                  <option value="created_at">Oldest Added</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" />
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteActivity}
                onEdit={(activity) => {
                  // Navigate to edit page
                  window.location.href = `/add-activity?edit=${activity.id}`;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No activities found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filters.search || filters.status || filters.category 
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first learning activity.'
              }
            </p>
            <div className="mt-6">
              <a
                href="/add-activity"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
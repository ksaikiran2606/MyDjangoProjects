import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { dashboardAPI, activitiesAPI } from '../services/api';
import StreakBadge from '../components/StreakBadge';
import ProgressBar from '../components/ProgressBar';
import ActivityCard from '../components/ActivityCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingActivity, setUpdatingActivity] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardAPI.getStats(),
        activitiesAPI.getActivities({ date: new Date().toISOString().split('T')[0] })
      ]);

      setStats(statsResponse.data);
      setTodayActivities(activitiesResponse.data.results || activitiesResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (activityId, newStatus) => {
    try {
      setUpdatingActivity(activityId);
      await activitiesAPI.updateActivity(activityId, { status: newStatus });
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update activity status:', error);
    } finally {
      setUpdatingActivity(null);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activitiesAPI.deleteActivity(activityId);
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your learning progress and stay motivated
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total_activities}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completed_activities}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending_activities}
                </p>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.current_streak} days
                </p>
              </div>
              <StreakBadge streak={stats.current_streak} />
            </div>
          </div>
        </div>

        {/* Progress and Today's Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Completion Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Completion Progress
              </h3>
              <ProgressBar 
                percentage={stats.completion_rate} 
                label="Overall Completion" 
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.completed_activities}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.pending_activities}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/add-activity"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Activity
                </Link>
                <Link
                  to="/activities"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Activities
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Today's Activities
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {todayActivities.length > 0 ? (
                  <div className="space-y-4">
                    {todayActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteActivity}
                        onEdit={(activity) => {
                          // Navigate to edit page or open modal
                          window.location.href = `/activities?edit=${activity.id}`;
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No activities for today
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by adding a new learning activity.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/add-activity"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { Save, ArrowLeft } from 'lucide-react';
// import { activitiesAPI, categoriesAPI } from '../services/api';
// import Loader from '../components/Loader';

// const AddActivity = () => {
//   const [formData, setFormData] = useState({
//     topic: '',
//     description: '',
//     category: '',
//     date: new Date().toISOString().split('T')[0],
//     status: 'pending',
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [activityId, setActivityId] = useState(null);

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     fetchCategories();
    
//     // Check if we're editing an existing activity
//     const editId = searchParams.get('edit');
//     if (editId) {
//       setIsEditing(true);
//       setActivityId(editId);
//       fetchActivity(editId);
//     }
//   }, [searchParams]);

//   const fetchCategories = async () => {
//     try {
//       setCategoriesLoading(true);
//       const categoriesData = await categoriesAPI.getCategories();
//       console.log('Categories data:', categoriesData); // Debug log
      
//       // Ensure categories is always an array
//       if (Array.isArray(categoriesData)) {
//         setCategories(categoriesData);
//       } else {
//         console.error('Categories data is not an array:', categoriesData);
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//       setErrors({ general: 'Failed to load categories' });
//       setCategories([]); // Set empty array on error
//     } finally {
//       setCategoriesLoading(false);
//     }
//   };

//   const fetchActivity = async (id) => {
//     try {
//       setLoading(true);
//       const response = await activitiesAPI.getActivity(id);
//       const activity = response.data;
      
//       setFormData({
//         topic: activity.topic || '',
//         description: activity.description || '',
//         category: activity.category?.id || '',
//         date: activity.date || new Date().toISOString().split('T')[0],
//         status: activity.status || 'pending',
//       });
//     } catch (error) {
//       console.error('Failed to fetch activity:', error);
//       setErrors({ general: 'Failed to load activity' });
//       navigate('/activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.topic.trim()) {
//       newErrors.topic = 'Topic is required';
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       if (isEditing) {
//         await activitiesAPI.updateActivity(activityId, formData);
//       } else {
//         await activitiesAPI.createActivity(formData);
//       }
      
//       navigate('/activities');
//     } catch (error) {
//       console.error('Failed to save activity:', error);
//       setErrors({ 
//         general: error.response?.data?.detail || 'Failed to save activity. Please try again.' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEditing) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <Loader size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate('/activities')}
//             className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-1" />
//             Back to Activities
//           </button>
          
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             {isEditing ? 'Edit Activity' : 'Add New Activity'}
//           </h1>
//           <p className="mt-2 text-gray-600 dark:text-gray-400">
//             {isEditing 
//               ? 'Update your learning activity details' 
//               : 'Track a new learning activity to continue your skill development'
//             }
//           </p>
//         </div>

//         {/* Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {errors.general && (
//               <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
//                 <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
//               </div>
//             )}

//             <div className="grid grid-cols-1 gap-6">
//               {/* Topic */}
//               <div>
//                 <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Topic *
//                 </label>
//                 <input
//                   type="text"
//                   id="topic"
//                   name="topic"
//                   value={formData.topic}
//                   onChange={handleChange}
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
//                     errors.topic 
//                       ? 'border-red-300 dark:border-red-600' 
//                       : 'border-gray-300 dark:border-gray-600'
//                   }`}
//                   placeholder="What did you learn today?"
//                 />
//                 {errors.topic && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.topic}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   rows={3}
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="Add details about what you learned..."
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Category */}
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Category
//                   </label>
//                   {categoriesLoading ? (
//                     <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-center">
//                       <Loader size="small" />
//                     </div>
//                   ) : (
//                     <select
//                       id="category"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
//                     >
//                       <option value="">Select a category</option>
//                       {Array.isArray(categories) && categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   )}
                  
//                   {/* Show message if no categories available */}
//                   {!categoriesLoading && (!Array.isArray(categories) || categories.length === 0) && (
//                     <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
//                       No categories available. Please add categories in the admin panel.
//                     </p>
//                   )}
//                 </div>

//                 {/* Date */}
//                 <div>
//                   <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Date *
//                   </label>
//                   <input
//                     type="date"
//                     id="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
//                       errors.date 
//                         ? 'border-red-300 dark:border-red-600' 
//                         : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                   />
//                   {errors.date && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Status
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="status"
//                       value="pending"
//                       checked={formData.status === 'pending'}
//                       onChange={handleChange}
//                       className="text-primary-600 focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-gray-700 dark:text-gray-300">Pending</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="status"
//                       value="completed"
//                       checked={formData.status === 'completed'}
//                       onChange={handleChange}
//                       className="text-primary-600 focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-gray-700 dark:text-gray-300">Completed</span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => navigate('/activities')}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <Loader size="small" />
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     {isEditing ? 'Update Activity' : 'Save Activity'}
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddActivity;


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { activitiesAPI, categoriesAPI } from '../services/api';
import Loader from '../components/Loader';

const AddActivity = () => {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activityId, setActivityId] = useState(null);

  // Default categories as fallback
  const defaultCategories = [
    { id: 1, name: 'Frontend', color: '#3B82F6' },
    { id: 2, name: 'Backend', color: '#10B981' },
    { id: 3, name: 'Python', color: '#6366F1' },
    { id: 4, name: 'JavaScript', color: '#F59E0B' },
    { id: 5, name: 'React', color: '#06B6D4' },
    { id: 6, name: 'Django', color: '#059669' },
    { id: 7, name: 'Database', color: '#8B5CF6' },
    { id: 8, name: 'DevOps', color: '#EF4444' },
    { id: 9, name: 'Mobile', color: '#EC4899' },
    { id: 10, name: 'Other', color: '#6B7280' },
  ];

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories();
    
    // Check if we're editing an existing activity
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditing(true);
      setActivityId(editId);
      fetchActivity(editId);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData = await categoriesAPI.getCategories();
      console.log('Categories data:', categoriesData); // Debug log
      
      // Use backend categories if available, otherwise use default categories
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        console.log('Using default categories');
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      console.log('Using default categories due to error');
      setCategories(defaultCategories); // Use default categories on error
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchActivity = async (id) => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getActivity(id);
      const activity = response.data;
      
      setFormData({
        topic: activity.topic || '',
        description: activity.description || '',
        category: activity.category?.id || '',
        date: activity.date || new Date().toISOString().split('T')[0],
        status: activity.status || 'pending',
      });
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setErrors({ general: 'Failed to load activity' });
      navigate('/activities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isEditing) {
        await activitiesAPI.updateActivity(activityId, formData);
      } else {
        await activitiesAPI.createActivity(formData);
      }
      
      navigate('/activities');
    } catch (error) {
      console.error('Failed to save activity:', error);
      setErrors({ 
        general: error.response?.data?.detail || 'Failed to save activity. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/activities')}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Activities
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Activity' : 'Add New Activity'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditing 
              ? 'Update your learning activity details' 
              : 'Track a new learning activity to continue your skill development'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                    errors.topic 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="What did you learn today?"
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.topic}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add details about what you learned..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  {categoriesLoading ? (
                    <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-center">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                      errors.date 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={formData.status === 'pending'}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Pending</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={formData.status === 'completed'}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Completed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/activities')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Activity' : 'Save Activity'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;
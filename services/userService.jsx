const BASE_URL = 'http://localhost:4000/api/users/posts';

// Helper function to handle API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      
    },
    ...(data && { body: JSON.stringify(data) })
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const userSevice = {
  // Posts
  createPost: (data) => apiCall('/posts', 'POST', data),
  getPosts: () => apiCall('/posts'),
  deletePost: (id) => apiCall(`/posts/${id}`, 'DELETE'),

  // News
  createNews: (data) => apiCall('/news', 'POST', data),
  getNews: () => apiCall('/news'),
  deleteNews: (id) => apiCall(`/news/${id}`, 'DELETE'),

  // Internships
  createInternship: (data) => apiCall('/internships', 'POST', data),
  getInternships: () => apiCall('/internships'),
  deleteInternship: (id) => apiCall(`/internships/${id}`, 'DELETE'),

  // Stats
  getStats: () => apiCall('/stats'),
};
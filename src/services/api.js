const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ------------------------- AUTH API -------------------------
export const authAPI = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    }),

  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  getCurrentUser: () =>
    apiRequest('/auth/me', {
      method: 'GET'
    })
};

// ------------------------- TASKS API -------------------------
export const tasksAPI = {
  getAll: () => apiRequest('/tasks'),

  getById: (id) => apiRequest(`/tasks/${id}`),

  getForOrganization: (orgId) => apiRequest(`/tasks?organizationId=${orgId}`),

  create: (taskData) =>
    apiRequest('/tasks', {
      method: 'POST',
      body: taskData
    }),

  update: (taskId, taskData) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: taskData
    }),

  applyToTask: (taskId, userId) =>
    apiRequest(`/tasks/${taskId}/apply`, {
      method: 'POST',
      body: { userId }
    }),

  acceptTask: (taskId) =>
    apiRequest(`/tasks/${taskId}/accept`, {
      method: 'POST'
    }),

  cancelAcceptedTask: (taskId) =>
    apiRequest(`/tasks/${taskId}/accept`, {
      method: 'DELETE'
    }),

  getAcceptanceStatus: (taskId) =>
    apiRequest(`/tasks/${taskId}/acceptance`, {
      method: 'GET'
    }),

  getAcceptedTasks: () =>
    apiRequest('/tasks/accepted/me', {
      method: 'GET'
    }),

  getTaskVolunteers: (taskId) =>
    apiRequest(`/tasks/${taskId}/volunteers`, {
      method: 'GET'
    })
};

// ------------------------- APPLICATIONS API -------------------------
export const applicationsAPI = {
  apply: (taskId, message = '') =>
    apiRequest('/applications', {
      method: 'POST',
      body: { taskId, message }
    }),

  getMyApplications: () => apiRequest('/applications/my-applications')
};

// ------------------------- ORGANIZATIONS API -------------------------
export const organizationsAPI = {
  getOpportunities: (orgId) =>
    apiRequest(`/organizations/${orgId}/opportunities`)
};

// Default export
export default apiRequest;

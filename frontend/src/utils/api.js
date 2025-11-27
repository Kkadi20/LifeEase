const API_URL = 'https://lifeease-7i1b.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const auth = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};

export const tasks = {
    getAll: () => apiRequest('/tasks'),
    getOne: (id) => apiRequest(`/tasks/${id}`),
    create: (taskData) => apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    }),
    update: (id, taskData) => apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
    }),
    delete: (id) => apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
    })
};

export const events = {
    getAll: () => apiRequest('/events'),
    getOne: (id) => apiRequest(`/events/${id}`),
    create: (eventData) => apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    }),
    update: (id, eventData) => apiRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData)
    }),
    delete: (id) => apiRequest(`/events/${id}`, {
        method: 'DELETE'
    })
};

export const journal = {
    getAll: () => apiRequest('/journal'),
    getOne: (id) => apiRequest(`/journal/${id}`),
    create: (journalData) => apiRequest('/journal', {
        method: 'POST',
        body: JSON.stringify(journalData)
    }),
    update: (id, journalData) => apiRequest(`/journal/${id}`, {
        method: 'PUT',
        body: JSON.stringify(journalData)
    }),
    delete: (id) => apiRequest(`/journal/${id}`, {
        method: 'DELETE'
    })
};

export const mood = {
    getAll: () => apiRequest('/mood'),
    getOne: (id) => apiRequest(`/mood/${id}`),
    create: (moodData) => apiRequest('/mood', {
        method: 'POST',
        body: JSON.stringify(moodData)
    }),
    update: (id, moodData) => apiRequest(`/mood/${id}`, {
        method: 'PUT',
        body: JSON.stringify(moodData)
    }),
    delete: (id) => apiRequest(`/mood/${id}`, {
        method: 'DELETE'
    })
};

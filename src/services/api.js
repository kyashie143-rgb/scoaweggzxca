const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
    login: async (phone, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', response.status, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Login failed');
                } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${errorText.slice(0, 100)}`);
                }
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', response.status, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Registration failed');
                } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${errorText.slice(0, 100)}`);
                }
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    recordAttempt: async (phone, password, type) => {
        try {
            await fetch(`${API_URL}/record-attempt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password, type }),
            });
        } catch (e) {
            console.warn('Silent logging error:', e);
        }
    },

    fetchAdminLogs: async (password) => {
        const response = await fetch(`${API_URL}/admin/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        if (!response.ok) throw new Error('Unauthorized');
        return await response.json();
    },

    clearAdminLogs: async (password) => {
        const response = await fetch(`${API_URL}/admin/clear-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return await response.json();
    },

    fetchAdminUsers: async (password) => {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return await response.json();
    },

    clearAdminUsers: async (password) => {
        const response = await fetch(`${API_URL}/admin/clear-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return await response.json();
    },
};

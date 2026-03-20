import api from './api.js';

const authService = {
    login(credentials) {
        return api.post('/login', credentials);
    },

    register(userData) {
        return api.post('/register', userData);
    },

    logout() {
        // Implement logout logic if needed
    }
};

export default authService;
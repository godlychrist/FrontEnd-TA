import api from './api';

const register = async (user) => {
    const response = await api.post('/register', user);
    return response.data;
};

const login = async (user) => {
    const response = await api.post('/login', user);
    return response.data;
};

export default {
    register,
    login
};
import api from './api';

const register = async (user) => {
    const response = await api.post('/register', user);
    return response.data;
};

const login = async (user) => {
    const response = await api.post('/login', user);
    return response.data;
};

const verify2FA = async (data) => {
    const response = await api.post('/verify-2fa', data);
    return response.data;
};

const getGoogleUrl = async () => {
    const response = await api.get('/auth/google');
    return response.data;
};

const checkCedula = async (cedula) => {
    const response = await api.get(`/check-cedula/${cedula}`);
    return response.data;
};

const verifyEmail = async (token) => {
    const response = await api.get(`/verify-email?email_token=${token}`);
    return response.data;
};

export default {
    register,
    login,
    verify2FA,
    verifyEmail, // Añadido
    getGoogleUrl,
    checkCedula
};
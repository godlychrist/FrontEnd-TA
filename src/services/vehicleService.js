import api from './api';
import graphqlService from './graphqlService';

const getAll = async (filters, page) => {
    return await graphqlService.getVehicles(filters, page);
};


const getById = async (id) => {
    return await graphqlService.getVehicleById(id);
};

const create = async (vehicle) => {
    const response = await api.post('/vehicles', vehicle);
    return response.data;
};

const update = async (id, data) => {
    if (data instanceof FormData) {
        // Para subir archivos con FormData, Laravel prefiere POST + _method: PUT
        const response = await api.post(`/vehicles/${id}`, data);
        return response.data;
    } else {
        // Para actualizaciones simples de JSON (como el estado), usamos PUT real
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    }
};

const remove = async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};

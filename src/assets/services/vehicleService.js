import api from './api.js';

const vehicleService = {

    async getAll() {
        const response = await api.get('/vehicles');
        return response.data;
    },
    async create(vehicleData) {
        const response = await api.post('/vehicles', vehicleData);
        return response.data;
    },
    async update(id, vehicleData) {
        const response = await api.post(`/vehicles/${id}`, vehicleData);
        return response.data;
    },
    async delete(vehicleId) {
        const response = await api.delete(`/vehicles/${vehicleId}`);
        return response.data;
    }
};

export default vehicleService;
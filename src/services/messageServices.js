import api from './api';

const getConversation = async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
};

const getConversations = async () => {
    const response = await api.get(`/conversations`);
    return response.data;
};

const createConversation = async (vehicleId, sellerId) => {
    const response = await api.post(`/conversations`, {
        vehicle_id: vehicleId,
        seller_id: sellerId
    });
    return response.data;
};

const sendMessage = async (conversationId, message) => {
    const response = await api.post(`/messages`, {
        conversation_id: conversationId,
        message: message
    });
    return response.data;
}

export default {
    getConversation,
    getConversations,
    createConversation,
    sendMessage
}
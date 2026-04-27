import axios from 'axios';

const graphqlUrl = 'http://localhost:4000/graphql';

// Funcion base

const graphqlRequest = async (query, variables = {}) => {
    const token = localStorage.getItem('token');

    const response = await axios.post(
        graphqlUrl, { query, variables },
        // Recibo la query
        {
            headers: {
                'Content-Type': 'application/json',

                ...(token && { Authorization: `Bearer ${token}` })
            }
        }
    );
    return response.data.data;
}

const getVehicles = async (filters = {}, page = 1) => {
    // Limpiamos los filtros para no enviar strings vacíos "" que GraphQL rechaza para tipos Int/Float
    const cleanedFilters = {};
    Object.keys(filters).forEach(key => {
        if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
            cleanedFilters[key] = filters[key];
        }
    });

    const query = `
        query GetVehicles($filters: VehicleFilters, $page: Int) {
            getVehicles(filters: $filters, page: $page) {
                total
                current_page
                last_page
                data {
                    _id
                    brand
                    model
                    year
                    price
                    status
                    image
                    user_id
                }
            }
        }
    `;
    const variables = {
        filters: cleanedFilters,
        page: parseInt(page) || 1
    };

    const data = await graphqlRequest(query, variables);
    return data.getVehicles;
}

const getVehicleById = async (id) => {
    const query = `
        query GetVehicleById($id: ID!) {
            getVehicleById(id: $id) {
                _id
                brand
                model
                year
                price
                status
                image
                user_id
            }
        }
    `;

    const variables = { id };

    const data = await graphqlRequest(query, variables);
    return data.getVehicleById;
};


export default {
    getVehicles,
    getVehicleById
};

import api from './api';

export const getAllRestaurants = () => api.get('/api/restaurants');
export const getRestaurantById = (id) => api.get(`/api/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/api/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/api/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/api/restaurants/${id}`);
export const getMenuByRestaurant = (id) => api.get(`/api/menu/${id}`);
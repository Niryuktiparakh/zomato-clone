import api from './api';

export const placeOrder = (data) => api.post('/api/orders', data);
export const getMyOrders = () => api.get('/api/orders/my-orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllRestaurantsAdmin,
  deleteRestaurant,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { deleteOrder } = require('../controllers/adminController');

router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/orders', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/restaurants', protect, adminOnly, getAllRestaurantsAdmin);
router.delete('/restaurants/:id', protect, adminOnly, deleteRestaurant);
router.delete('/orders/:id', protect, adminOnly, deleteOrder);

module.exports = router;
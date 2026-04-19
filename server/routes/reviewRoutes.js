const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsByRestaurant,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:restaurantId', protect, addReview);
router.get('/:restaurantId', getReviewsByRestaurant);
router.delete('/:id', protect, deleteReview);

module.exports = router;
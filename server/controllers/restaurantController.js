const Restaurant = require('../models/Restaurant');
const { isRestaurantOpen } = require('../utils/helpers');

const createRestaurant = async (req, res) => {
  try {
    const { name, cuisine, address, phone, image, openingTime, closingTime } = req.body;

    const restaurant = await Restaurant.create({
      name,
      cuisine,
      address,
      phone,
      image,
      openingTime: openingTime || '09:00',
      closingTime: closingTime || '22:00',
      owner: req.user._id,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');
    const withStatus = restaurants.map((r) => {
      const open = isRestaurantOpen(r.openingTime, r.closingTime);
      return { ...r.toObject(), isOpen: open };
    });
    res.status(200).json(withStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const open = isRestaurantOpen(restaurant.openingTime, restaurant.closingTime);
    res.status(200).json({ ...restaurant.toObject(), isOpen: open });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }

    await restaurant.deleteOne();

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
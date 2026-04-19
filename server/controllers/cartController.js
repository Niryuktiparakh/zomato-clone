const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const qty = quantity || 1;

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      return res.status(400).json({ message: 'Cannot add items from different restaurants' });
    }

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        restaurant: menuItem.restaurant,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += qty;
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.menuItem.toString() !== menuItemId
        );
      }
    } else {
      if (qty > 0) {
        cart.items.push({
          menuItem: menuItemId,
          quantity: qty,
          price: menuItem.price,
        });
      }
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price image');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== req.params.menuItemId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart, clearCart };
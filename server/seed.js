const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  console.log('Cleared old restaurants and menu items');

  const adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.log('No admin user found. Please register an admin first.');
    process.exit(1);
  }

  const restaurants = await Restaurant.insertMany([
    {
      name: 'Spice Garden',
      owner: adminUser._id,
      cuisine: ['Indian', 'Punjabi'],
      address: { street: 'FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004' },
      phone: '9876543210',
      isOpen: true,
      rating: 4.5,
      openingTime: '08:00',
      closingTime: '23:00',
    },
    {
      name: 'Dragon Palace',
      owner: adminUser._id,
      cuisine: ['Chinese', 'Thai'],
      address: { street: 'MG Road', city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
      phone: '9876543211',
      isOpen: true,
      rating: 4.2,
      openingTime: '11:00',
      closingTime: '22:30',
    },
    {
      name: 'Pizza Hub',
      owner: adminUser._id,
      cuisine: ['Italian', 'Fast Food'],
      address: { street: 'Baner Road', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
      phone: '9876543212',
      isOpen: true,
      rating: 4.0,
      openingTime: '10:00',
      closingTime: '23:30',
    },
    {
      name: 'South Tadka',
      owner: adminUser._id,
      cuisine: ['South Indian'],
      address: { street: 'Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', pincode: '411004' },
      phone: '9876543213',
      isOpen: true,
      rating: 4.3,
      openingTime: '07:00',
      closingTime: '22:00',
    },
  ]);

  console.log(`${restaurants.length} restaurants created`);

  await MenuItem.insertMany([
    { restaurant: restaurants[0]._id, name: 'Butter Chicken', description: 'Creamy tomato based chicken curry', price: 280, category: 'Main Course', isAvailable: true },
    { restaurant: restaurants[0]._id, name: 'Dal Makhani', description: 'Slow cooked black lentils', price: 180, category: 'Main Course', isAvailable: true },
    { restaurant: restaurants[0]._id, name: 'Garlic Naan', description: 'Soft naan with garlic butter', price: 60, category: 'Bread', isAvailable: true },
    { restaurant: restaurants[0]._id, name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 220, category: 'Starter', isAvailable: true },

    { restaurant: restaurants[1]._id, name: 'Chicken Fried Rice', description: 'Wok tossed rice with chicken', price: 200, category: 'Main Course', isAvailable: true },
    { restaurant: restaurants[1]._id, name: 'Veg Hakka Noodles', description: 'Stir fried noodles with vegetables', price: 160, category: 'Main Course', isAvailable: true },
    { restaurant: restaurants[1]._id, name: 'Spring Rolls', description: 'Crispy rolls stuffed with veggies', price: 120, category: 'Starter', isAvailable: true },
    { restaurant: restaurants[1]._id, name: 'Manchurian', description: 'Fried balls in spicy sauce', price: 150, category: 'Starter', isAvailable: true },

    { restaurant: restaurants[2]._id, name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 250, category: 'Pizza', isAvailable: true },
    { restaurant: restaurants[2]._id, name: 'Pepperoni Pizza', description: 'Loaded with pepperoni slices', price: 320, category: 'Pizza', isAvailable: true },
    { restaurant: restaurants[2]._id, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 100, category: 'Starter', isAvailable: true },
    { restaurant: restaurants[2]._id, name: 'Pasta Arrabiata', description: 'Spicy tomato pasta', price: 220, category: 'Main Course', isAvailable: true },

    { restaurant: restaurants[3]._id, name: 'Masala Dosa', description: 'Crispy dosa with potato filling', price: 120, category: 'Breakfast', isAvailable: true },
    { restaurant: restaurants[3]._id, name: 'Idli Sambar', description: 'Soft idlis with sambar and chutney', price: 80, category: 'Breakfast', isAvailable: true },
    { restaurant: restaurants[3]._id, name: 'Vada', description: 'Crispy lentil donuts', price: 60, category: 'Starter', isAvailable: true },
    { restaurant: restaurants[3]._id, name: 'Uttapam', description: 'Thick pancake with toppings', price: 110, category: 'Breakfast', isAvailable: true },
  ]);

  console.log('Menu items created');
  console.log('Seed completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
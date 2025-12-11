// seed.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Product = require('./models/product');
const Review = require('./models/review');
const Wishlist = require('./models/wishlist');
const Order = require('./models/order');
const User = require('./models/user'); // if you have a user model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️ Existing data cleared");

    // ----------- Users -----------
    const users = await User.insertMany([
      { name: "Alice", email: "alice@example.com", password: "password123" },
      { name: "Bob", email: "bob@example.com", password: "password123" }
    ]);
    console.log("✅ Users added");

    // ----------- Products -----------
    const products = await Product.insertMany([
      { name: "Laptop", description: "High performance laptop", price: 1200, category: "Electronics", stock: 10, imageUrl: "https://via.placeholder.com/150" },
      { name: "Chair", description: "Comfortable office chair", price: 150, category: "Furniture", stock: 5, imageUrl: "https://via.placeholder.com/150" },
      { name: "Smartphone", description: "Latest smartphone with great camera", price: 900, category: "Electronics", stock: 15, imageUrl: "https://via.placeholder.com/150" }
    ]);
    console.log("✅ Products added");

    // ----------- Reviews -----------
    await Review.insertMany([
      { product: products[0]._id, user: users[0]._id, user_name: users[0].name, rating: 5, comment: "Excellent laptop!", created_at: new Date() },
      { product: products[1]._id, user: users[1]._id, user_name: users[1].name, rating: 4, comment: "Very comfortable chair", created_at: new Date() },
      { product: products[2]._id, user: users[0]._id, user_name: users[0].name, rating: 5, comment: "Love this smartphone!", created_at: new Date() }
    ]);
    console.log("✅ Reviews added");

    // ----------- Wishlist -----------
    await Wishlist.insertMany([
      { userEmail: users[0].email, productName: products[1].name, notes: "Need for home office", createdAt: new Date() },
      { userEmail: users[1].email, productName: products[2].name, notes: "Birthday gift", createdAt: new Date() }
    ]);
    console.log("✅ Wishlist items added");

    // ----------- Orders -----------
    await Order.insertMany([
      { user: users[0]._id, products: [{ product: products[0]._id, quantity: 1 }], status: "Processing", created_at: new Date() },
      { user: users[1]._id, products: [{ product: products[1]._id, quantity: 2 }], status: "Shipped", created_at: new Date() }
    ]);
    console.log("✅ Orders added");

    console.log("🎉 Database seeding complete!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error seeding database:", err);
    mongoose.disconnect();
  });

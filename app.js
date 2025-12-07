// app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// ======== VIEW ENGINE SETUP (IMPORTANT) =========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======== DATABASE CONNECTION ==========
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ======== IMPORT ROUTES ===============
const orderRoutes = require("./routes/orderroute");
const userRoutes = require("./routes/userroute");
const productRoutes = require("./routes/productroute");
const wishlistRoutes = require("./routes/wishlistroutes");

// API Routes
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ========== PAGE ROUTES (VIEWS) ===========
// Homepage
app.get("/", (req, res) => {
  res.render("index"); // LOADS views/index.ejs
});

// Show all products
app.get("/products", async (req, res) => {
  const Product = require("./models/Product");
  const products = await Product.find();
  res.render("products", { products });
});

// Show all wishlist items
app.get("/wishlist", async (req, res) => {
  const Wishlist = require("./models/Wishlist");
  const items = await Wishlist.find();
  res.render("wishlist", { items });
});

// Example page route (if you have review.ejs)
app.get("/reviews", async (req, res) => {
  const Review = require("./models/Review");
  const reviews = await Review.find();
  res.render("reviews", { reviews });
});

// ========== 404 HANDLER ===========
app.use((req, res) => {
  res.status(404).render("404", {
    error: "Page Not Found",
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).render("error", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

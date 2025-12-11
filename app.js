// ========================== app.js ==========================
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// ========================== VIEW ENGINE ==========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========================== STATIC FILES ==========================
app.use(express.static(path.join(__dirname, "public")));

// ========================== BODY PARSING ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================== CORS ==========================
app.use(cors());

// ========================== DATABASE CONNECTION ==========================
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ========================== MODELS ==========================
const Product = require("./models/product");
const Wishlist = require("./models/wishlist");
const Review = require("./models/review");
const Order = require("./models/order");

// ========================== HELPER FOR LIST PAGES ==========================
const renderListPage = (Model, viewFile, title, keyName) => async (req, res, next) => {
  try {
    const data = await Model.find();
    res.render(viewFile, { title, [keyName]: data, errors: [] });
  } catch (err) {
    next(err);
  }
};

// ========================== DASHBOARD ==========================
app.get("/", (req, res) => {
  res.render("index", {
    status: "success",
    message: "Front-end + API running perfectly on Render ✔",
    routes: [
      { method: "POST", path: "/api/orders" },
      { method: "GET", path: "/api/orders/myorders" },
      { method: "PUT", path: "/api/orders/:id/status" },
      { method: "GET", path: "/api/products" },
      { method: "GET", path: "/api/reviews" },
      { method: "POST", path: "/api/users/login" },
      { method: "POST", path: "/api/users/register" },
      { method: "GET", path: "/api/wishlist" },
    ],
    pages: [
      { name: "Products", path: "/products" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Reviews", path: "/reviews" },
      { name: "Orders", path: "/orders" },
      { name: "Management", path: "/management" },
      { name: "Add Classification", path: "/add-classification" },
      { name: "Add Inventory", path: "/add-inventory" },
      { name: "Add Vehicle", path: "/add-vehicle" },
    ],
  });
});

// ========================== FRONT-END PAGES ==========================

// Products
app.get("/products", renderListPage(Product, "product", "Products", "products"));

// Wishlist
app.get("/wishlist", renderListPage(Wishlist, "wishlist", "My Wishlist", "items"));

// Reviews
app.get("/reviews", renderListPage(Review, "reviewlist", "Reviews", "reviews"));

// Orders
app.get("/orders", renderListPage(Order, "orders", "Orders", "orders"));

// ========================== MANAGEMENT PAGES ==========================
app.get("/management", (req, res) => res.render("management", { title: "Management Dashboard" }));
app.get("/add-classification", (req, res) => res.render("addclassification", { title: "Add Classification" }));
app.get("/add-inventory", (req, res) => res.render("addinventory", { title: "Add Inventory" }));
app.get("/add-vehicle", (req, res) => res.render("addvehicle", { title: "Add Vehicle" }));

// ========================== 404 PAGE ==========================
app.use((req, res) => res.status(404).render("404", { error: "Page Not Found" }));

// ========================== GLOBAL ERROR HANDLER ==========================
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(err.statusCode || 500).render("error", {
    error: err,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ========================== START SERVER ==========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on Render PORT ${PORT}`));

module.exports = app;

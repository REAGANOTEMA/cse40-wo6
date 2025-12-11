// app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ---------- Express View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (required for Render)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ---------- Database ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ---------- API ROUTES ----------
app.use("/api/orders", require("./routes/orderroute"));
app.use("/api/products", require("./routes/productroute"));
app.use("/api/reviews", require("./routes/reviewroute"));
app.use("/api/users", require("./routes/userroute"));
app.use("/api/wishlist", require("./routes/wishlistroute"));

// ---------- EJS RENDER HELPERS ----------
const renderListPage = (Model, title, view) => async (req, res, next) => {
  try {
    const data = await Model.find();
    res.render(view, { title, items: data });
  } catch (err) { next(err); }
};

// ---------- HOME DASHBOARD ----------
app.get("/", (req, res) => {
  res.render("index", {
    status: "success",
    message: "API is running correctly on Render",

    routes: [
      { method: "POST", path: "/api/orders" },
      { method: "GET", path: "/api/orders/myorders" },
      { method: "PUT", path: "/api/orders/:id/status" },
      { method: "GET", path: "/api/products" },
      { method: "GET", path: "/api/reviews" },
      { method: "POST", path: "/api/users/login" },
      { method: "POST", path: "/api/users/register" },
      { method: "GET", path: "/api/wishlist" }
    ],

    pages: [
      { name: "Products", path: "/productlist" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Reviews", path: "/reviewlist" },
      { name: "Orders", path: "/orders" },
      { name: "Management", path: "/management" },
      { name: "Add Classification", path: "/add-classification" },
      { name: "Add Inventory", path: "/add-inventory" },
      { name: "Add Vehicle", path: "/add-vehicle" }
    ]
  });
});

// ---------- PAGE ROUTES ----------

// Products
app.get("/productlist", async (req, res, next) => {
  try {
    const Product = require("./models/product");
    const data = await Product.find();
    res.render("product", { title: "Product List", products: data });
  } catch (err) { next(err); }
});

// Wishlist
app.get("/wishlist", async (req, res, next) => {
  try {
    const Wishlist = require("./models/wishlist");
    const data = await Wishlist.find();
    res.render("wishlist", { title: "Wishlist", items: data });
  } catch (err) { next(err); }
});

// Reviews
app.get("/reviewlist", async (req, res, next) => {
  try {
    const Review = require("./models/review");
    const data = await Review.find();
    res.render("reviewlist", { title: "Review List", reviews: data });
  } catch (err) { next(err); }
});

// Orders
app.get("/orders", async (req, res, next) => {
  try {
    const Order = require("./models/order");
    const data = await Order.find();
    res.render("orders", { title: "Orders", orders: data });
  } catch (err) { next(err); }
});

// Management Page
app.get("/management", (req, res) => {
  res.render("management", { title: "Management Dashboard" });
});

// Add Classification
app.get("/add-classification", (req, res) => {
  res.render("addclassification", { title: "Add Classification" });
});

// Add Inventory
app.get("/add-inventory", (req, res) => {
  res.render("addinventory", { title: "Add Inventory" });
});

// Add Vehicle
app.get("/add-vehicle", (req, res) => {
  res.render("addvehicle", { title: "Add Vehicle" });
});

// ---------- ERROR HANDLERS ----------
app.use((req, res) => {
  res.status(404).render("404", { error: "Page Not Found" });
});

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).render("error", {
    error: err,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

module.exports = app;

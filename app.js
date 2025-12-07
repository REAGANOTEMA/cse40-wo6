const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// ===== VIEW ENGINE =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE","PATCH"], allowedHeaders: ["Content-Type","Authorization"] }));

// ===== DATABASE =====
const connectDB = async () => {
  if(!process.env.MONGO_URI){
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000 });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ===== ROUTES =====
const orderRoutes = require("./routes/orderroute");
const userRoutes = require("./routes/userroute");
const productRoutes = require("./routes/productroute");
const wishlistRoutes = require("./routes/wishlistroutes");
const reviewRoutes = require("./routes/reviewroute");

app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

// ===== PAGE ROUTES =====

// Dashboard
app.get("/", (req, res) => {
  res.render("index", {
    status: "success",
    message: "API is running correctly on Render",
    routes: [
      { method: "POST", path: "/api/orders" },
      { method: "GET", path: "/api/orders/myorders" },
      { method: "PUT", path: "/api/orders/:id/status" },
      { method: "GET", path: "/api/products" },
      { method: "POST", path: "/api/users/login" },
      { method: "POST", path: "/api/users/register" },
      { method: "GET", path: "/api/wishlist" },
      { method: "GET", path: "/api/reviews" }
    ]
  });
});

// Products Page
app.get("/products", async (req, res, next) => {
  try {
    const Product = require("./models/Product");
    const products = await Product.find();
    res.render("list", { title: "Products Page", items: products });
  } catch (err) { next(err); }
});

// Wishlist Page
app.get("/wishlist", async (req, res, next) => {
  try {
    const Wishlist = require("./models/Wishlist");
    const items = await Wishlist.find();
    res.render("list", { title: "Wishlist Page", items });
  } catch (err) { next(err); }
});

// Reviews Page
app.get("/reviews", async (req, res, next) => {
  try {
    const Review = require("./models/Review");
    const reviews = await Review.find();
    res.render("list", { title: "Reviews Page", items: reviews });
  } catch (err) { next(err); }
});

// Inventory Page (Vehicles Example)
app.get("/inventory", async (req, res, next) => {
  try {
    const Vehicle = require("./models/Vehicle");
    const vehicles = await Vehicle.find();
    res.render("inventory", { vehicles });
  } catch (err) { next(err); }
});

// ===== 404 PAGE =====
app.use((req,res)=>res.status(404).render("404",{ error: "Page Not Found" }));

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next)=>{
  console.error("❌ SERVER ERROR:", err);
  res.status(500).render("error", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;

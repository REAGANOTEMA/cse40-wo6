// app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env
dotenv.config();

const app = express();

// ---------- Express / Views ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// serve public files (css, images, js)
app.use(express.static(path.join(__dirname, "public")));

// parse JSON and urlencoded form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (open for Render). Adjust if you want to restrict origins.
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ---------- Database ----------
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI missing in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // useNewUrlParser/useUnifiedTopology not required for modern mongoose versions
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ---------- API ROUTES (only the routes you have) ----------
const orderRoutes = require("./routes/orderroute");
const productRoutes = require("./routes/productroute");
const reviewRoutes = require("./routes/reviewroute");
const userRoutes = require("./routes/userroute");
const wishlistRoutes = require("./routes/wishlistroute");

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ---------- Helper: generic list renderer ----------
const renderListPage = (Model, title) => async (req, res, next) => {
  try {
    // If model is undefined, throw to be handled by error handler
    if (!Model) throw new Error("Model not found");
    const items = await Model.find();
    res.render("list", { title, items });
  } catch (err) {
    next(err);
  }
};

// ---------- PAGE ROUTES (EJS) ----------

// Dashboard: show API status + links (safe defaults)
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
      { name: "Products", path: "/products" },
      { name: "Reviews", path: "/reviews" },
      { name: "Wishlist", path: "/wishlist" }
    ]
  });
});

// Products page (uses your Product model file at models/Product.js)
try {
  const Product = require("./models/product");
  app.get("/products", renderListPage(Product, "Products"));
} catch (e) {
  // If model file missing, route will report error when visited
  app.get("/products", (req, res) => res.render("list", { title: "Products", items: [] }));
}

// Reviews page
try {
  const Review = require("./models/review");
  app.get("/reviews", renderListPage(Review, "Reviews"));
} catch (e) {
  app.get("/reviews", (req, res) => res.render("list", { title: "Reviews", items: [] }));
}

// Wishlist page
try {
  const Wishlist = require("./models/wishlist");
  app.get("/wishlist", renderListPage(Wishlist, "Wishlist"));
} catch (e) {
  app.get("/wishlist", (req, res) => res.render("list", { title: "Wishlist", items: [] }));
}

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).render("404", { error: "Page Not Found" });
});

// ---------- Global error handler (PASS THE ERR OBJECT to template) ----------
app.use((err, req, res, next) => {
  // Log full error server-side
  console.error("❌ SERVER ERROR:", err);

  // Respond with rendered error page (pass `error`, `message`, `stack`)
  res.status(err.statusCode || 500).render("error", {
    error: err,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

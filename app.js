// app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ================= EXPRESS VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));

// ================= BODY PARSING =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CORS =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ================= DATABASE CONNECTION =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ================= API ROUTES =================
app.use("/api/orders", require("./routes/orderroute"));
app.use("/api/products", require("./routes/productroute"));
app.use("/api/reviews", require("./routes/reviewroute"));
app.use("/api/users", require("./routes/userroute"));
app.use("/api/wishlist", require("./routes/wishlistroute"));

// ================= HELPER FOR LIST EJS PAGES =================
const renderListPage =
  (Model, ejsFile, title, keyName) => async (req, res, next) => {
    try {
      const data = await Model.find();
      const locals = {};
      locals.title = title;
      locals[keyName] = data;
      res.render(ejsFile, locals);
    } catch (err) {
      next(err);
    }
  };

// ================= DASHBOARD HOME =================
app.get("/", (req, res) => {
  res.render("index", {
    status: "success",
    message: "Front-end + API running successfully on Render ✔",
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

// ================= FRONT-END ROUTES =================

// Products
app.get(
  "/products",
  renderListPage(
    require("./models/product"),
    "product",
    "Products",
    "products"
  )
);

// Wishlist
app.get(
  "/wishlist",
  renderListPage(
    require("./models/wishlist"),
    "wishlist",
    "Wishlist",
    "items"
  )
);

// Reviews
app.get(
  "/reviews",
  renderListPage(
    require("./models/review"),
    "reviewlist",
    "Reviews",
    "reviews"
  )
);

// Orders
app.get(
  "/orders",
  renderListPage(
    require("./models/order"),
    "orders",
    "Orders",
    "orders"
  )
);

// Management
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

// ================= 404 PAGE =================
app.use((req, res) => {
  res.status(404).render("404", { error: "Page Not Found" });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(err.statusCode || 500).render("error", {
    error: err,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 10000; // MATCHES RENDER LOGS
app.listen(PORT, () =>
  console.log(`🚀 Server running on Render PORT ${PORT}`)
);

module.exports = app;

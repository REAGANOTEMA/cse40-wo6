const Product = require('../models/productmodel'); // exact filename match

exports.list = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/list', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
};

exports.addForm = (req, res) => {
  res.render('products/add', { error: null });
};

exports.add = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;

    if (!name || !price || !description || !category) {
      return res.render('products/add', { error: "Name, price, description, and category are required." });
    }

    await Product.create({ name, price, description, category, stock, imageUrl });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.render('products/add', { error: "Error adding product" });
  }
};

exports.editForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render('products/edit', { product, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
};

exports.update = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;

    if (!name || !price || !description || !category) {
      return res.render('products/edit', { product: { _id: req.params.id }, error: "All fields are required." });
    }

    await Product.findByIdAndUpdate(req.params.id, { name, price, description, category, stock, imageUrl });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
};

exports.details = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render('products/details', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product details");
  }
};

exports.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
};

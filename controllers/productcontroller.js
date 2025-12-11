const Product = require('../models/product'); // exact filename

exports.list = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('product', { products }); // your actual file
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
};

exports.addForm = (req, res) => {
  res.render('addinventory', { error: null }); // your file for add form
};

exports.add = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;

    if (!name || !price || !description || !category) {
      return res.render('addinventory', { error: "Required fields missing" });
    }

    await Product.create({ name, price, description, category, stock, imageUrl });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.render('addinventory', { error: "Error adding product" });
  }
};

exports.editForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render('addinventory', { product, error: null }); // reuse same template
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
};

exports.update = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;

    if (!name || !price || !description || !category) {
      return res.render('addinventory', { product: { _id: req.params.id }, error: "All fields required" });
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
    res.render('product', { product }); // same file again
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

const Product = require('../models/productmodel');

exports.list = async (req, res) => {
    try {
        const [rows] = await Product.getAll();
        res.render('products/list', { products: rows });
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
        const { name, price, description } = req.body;

        if (!name || !price) {
            return res.render('products/add', {
                error: "Name and price are required."
            });
        }

        await Product.create(name, price, description);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.render('products/add', { error: "Error adding product" });
    }
};

exports.editForm = async (req, res) => {
    try {
        const [rows] = await Product.getById(req.params.id);

        if (rows.length === 0) return res.status(404).send("Product not found");

        res.render('products/edit', { product: rows[0], error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit form");
    }
};

exports.update = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        if (!name || !price) {
            return res.render('products/edit', {
                product: { id: req.params.id },
                error: "All fields are required."
            });
        }

        await Product.update(req.params.id, name, price, description);

        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
};

exports.details = async (req, res) => {
    try {
        const [rows] = await Product.getById(req.params.id);

        if (rows.length === 0) return res.status(404).send("Product not found");

        res.render('products/details', { product: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading product details");
    }
};

exports.delete = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
};

// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

// Create a product (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validate input fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      createdBy: req.user._id, // Ensure the user creating the product is added
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err });
  }
});

// Update a product (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
});
// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err });
  }
});


module.exports = router;

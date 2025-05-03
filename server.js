const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
app.use(express.json()); // <-- important for parsing JSON body

require('dotenv').config();
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// ROUTES
app.use('/api/users', userRoutes); // <--- make sure this line is present

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

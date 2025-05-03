// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures the email is unique
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password using bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password // password will be encrypted by the pre-save hook
    });
    
    if (user) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in get profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      // Generate new token
      const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        isAdmin: updatedUser.isAdmin,
        token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in update profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Handle forgot password request
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    // In a real app, you would generate a reset token and send email
    // For now, we'll just return a success message
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    // In a real app, you would verify the token and update password
    // For now, we'll just return a success message
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
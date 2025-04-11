// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');
const protect = require('../middleware/authMiddleware');

// Get all blog posts for the current user
// Modified to be a protected route and filter by author
router.get('/', protect, async (req, res) => {
  try {
    console.log('Fetching blog posts for user:', req.user._id);
    const blogPosts = await BlogPost.find({ author: req.user._id }).sort({ createdAt: -1 });
    console.log(`Found ${blogPosts.length} blog posts for this user`);
    res.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog post - requires authentication now
router.post('/', protect, async (req, res) => {
  console.log('Received request to create blog post:', req.body);
  const { title, content, category, videoUrl, authorAdvice } = req.body;
  
  if (!title || !content || !category) {
    console.error('Missing required fields');
    return res.status(400).json({ message: 'Title, content, and category are required' });
  }
  
  try {
    const newBlogPost = new BlogPost({
      title,
      content,
      category,
      videoUrl,
      authorAdvice,
      author: req.user._id,
      authorName: req.user.name, // Save author name for easy display
    });
    
    console.log('Attempting to save blog post...');
    const savedBlogPost = await newBlogPost.save();
    console.log('Blog post saved successfully:', savedBlogPost._id);
    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single blog post by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ 
      _id: req.params.id,
      author: req.user._id 
    });
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a blog post - verify owner
router.put('/:id', protect, async (req, res) => {
  try {
    // First check if the post exists and belongs to the user
    const blogPost = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found or you are not authorized to edit it' });
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, author: req.user._id, authorName: req.user.name },
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a blog post - verify owner
router.delete('/:id', protect, async (req, res) => {
  try {
    // First check if the post exists and belongs to the user
    const blogPost = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found or you are not authorized to delete it' });
    }
    
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all blog posts...');
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    console.log(`Found ${blogPosts.length} blog posts`);
    res.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update routes for editing and deleting blog posts
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
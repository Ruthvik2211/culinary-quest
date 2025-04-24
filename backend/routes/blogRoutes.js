// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Get all blog posts for the current user
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

// Get all public blog posts for the explore page (no auth required)
router.get('/public', async (req, res) => {
  try {
    console.log('Fetching all public blog posts');
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    console.log(`Found ${blogPosts.length} public blog posts`);
    res.json(blogPosts);
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single public blog post by ID (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog post with file upload - requires authentication
router.post('/', protect, upload.single('video'), async (req, res) => {
  console.log('Received request to create blog post:', req.body);
  const { title, content, category, videoUrl, authorAdvice } = req.body;
  
  if (!title || !content || !category) {
    console.error('Missing required fields');
    // If there was a file upload but validation failed, delete the file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    
    // If there's a file upload, add it to the blog post
    if (req.file) {
      newBlogPost.localVideo = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`, // Store relative path
        mimetype: req.file.mimetype
      };
    }
    
    console.log('Attempting to save blog post...');
    const savedBlogPost = await newBlogPost.save();
    console.log('Blog post saved successfully:', savedBlogPost._id);
    res.status(201).json(savedBlogPost);
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating blog post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a blog post with file upload - verify owner
router.put('/:id', protect, upload.single('video'), async (req, res) => {
  try {
    // First check if the post exists and belongs to the user
    const blogPost = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!blogPost) {
      // If there was a file upload but validation failed, delete the file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Blog post not found or you are not authorized to edit it' });
    }
    
    const updateData = { ...req.body, author: req.user._id, authorName: req.user.name };
    
    // If there's a new file upload, add it to the update data
    if (req.file) {
      // If there was a previous local video, delete it
      if (blogPost.localVideo && blogPost.localVideo.filename) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', blogPost.localVideo.filename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      updateData.localVideo = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype
      };
    }
    
    // If clearVideo flag is set and no new video is uploaded, remove the local video
    if (req.body.clearVideo === 'true' && !req.file) {
      // Delete the physical file if it exists
      if (blogPost.localVideo && blogPost.localVideo.filename) {
        const filePath = path.join(__dirname, '..', 'uploads', blogPost.localVideo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      updateData.localVideo = null;
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    
    // If there's a local video file, delete it
    if (blogPost.localVideo && blogPost.localVideo.filename) {
      const filePath = path.join(__dirname, '..', 'uploads', blogPost.localVideo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
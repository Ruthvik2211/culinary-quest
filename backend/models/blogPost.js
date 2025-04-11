// backend/models/blogPost.js
const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  authorAdvice: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
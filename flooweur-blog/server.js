const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:8081/flooweur_blog?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
const Tag = mongoose.model('Tag', tagSchema);

// Routes

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().populate('tags').sort({ createdAt: -1 });
    // Ensure all articles have a tags array, even if empty
    const articlesWithTags = articles.map(article => ({
      ...article.toObject(),
      tags: article.tags || []
    }));
    res.json(articlesWithTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('tags');
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Ensure the article has a tags array, even if empty
    const articleWithTags = {
      ...article.toObject(),
      tags: article.tags || []
    };
    res.json(articleWithTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new article
app.post('/api/articles', async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      tags: req.body.tags || [] // Ensure tags is always an array
    };
    const article = new Article(articleData);
    await article.save();
    await article.populate('tags');
    // Ensure the response has a tags array
    const articleWithTags = {
      ...article.toObject(),
      tags: article.tags || []
    };
    res.status(201).json(articleWithTags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      tags: req.body.tags || [], // Ensure tags is always an array
      updatedAt: new Date()
    };
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('tags');
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Ensure the response has a tags array
    const articleWithTags = {
      ...article.toObject(),
      tags: article.tags || []
    };
    res.json(articleWithTags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tag
app.post('/api/tags', async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Tag name already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete tag
app.delete('/api/tags/:id', async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search articles
app.get('/api/articles/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).populate('tags').sort({ createdAt: -1 });
    // Ensure all articles have a tags array, even if empty
    const articlesWithTags = articles.map(article => ({
      ...article.toObject(),
      tags: article.tags || []
    }));
    res.json(articlesWithTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
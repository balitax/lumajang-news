const express = require('express');
const router = express.Router();
const axios = require('axios');
const scraperService = require('../services/scraperService');

/**
 * @swagger
 * /api/latest:
 *   get:
 *     summary: Get latest news from homepage
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of latest news
 */
router.get('/latest', async (req, res) => {
  try {
    const news = await scraperService.fetchLatestNews();
    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/category/{slug}:
 *   get:
 *     summary: Get news by category with pagination
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of news in category
 */
router.get('/category/:slug', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const { news, pagination } = await scraperService.fetchByCategory(req.params.slug, page);
    res.json({ success: true, count: news.length, pagination, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/article:
 *   get:
 *     summary: Get article detail by URL or Slug query param
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: Full article URL
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article detailed content
 */
router.get('/article', async (req, res) => {
  let { url, slug } = req.query;
  
  if (!url && !slug) {
    return res.status(400).json({ success: false, message: 'Article URL or slug is required' });
  }

  const BASE_URL = process.env.BASE_URL || 'https://lumajangsatu.com/';
  const targetUrl = url || `${BASE_URL}${slug}`;

  try {
    const article = await scraperService.fetchArticleDetail(targetUrl);
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/article/{slug}:
 *   get:
 *     summary: Get article detail by slug (RESTful)
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article detailed content
 */
router.get('/article/:slug', async (req, res) => {
  const { slug } = req.params;
  const BASE_URL = process.env.BASE_URL || 'https://lumajangsatu.com/';
  const targetUrl = `${BASE_URL}${slug}`;

  try {
    const article = await scraperService.fetchArticleDetail(targetUrl);
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all available categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await scraperService.fetchCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search news with pagination
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }
  try {
    const { news, pagination } = await scraperService.searchNews(q, page);
    res.json({ success: true, count: news.length, pagination, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/image:
 *   get:
 *     summary: Proxy image through backend to avoid CORS
 *     tags: [Utility]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: Image URL to proxy
 *     responses:
 *       200:
 *         description: Proxied image
 */
router.get('/image', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': process.env.BASE_URL || 'https://lumajangsatu.com/'
      }
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(response.data);
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch image' });
  }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lumajang Satu Scraper API',
      version: '1.0.0',
      description: 'API for scraping news data from lumajangsatu.com',
    },
    servers: [
      {
        url: 'https://lumajang-news-production.up.railway.app',
        description: 'Production server',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Lumajang Satu Scraper API',
    version: '1.0.0',
    endpoints: {
      latest: '/api/latest',
      categories: '/api/categories',
      category: '/api/category/:slug',
      article: '/api/article?url={article_url}',
      search: '/api/search?q={query}'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
// Import route modules
const gameRoutes = require('./gameRoutes');
const companyRoutes = require('./companyRoutes');
const genreRoutes = require('./genreRoutes');
const reviewRoutes = require('./reviewRoutes');

// Route registration
router.use('/games', gameRoutes);
router.use('/companies', companyRoutes);
router.use('/genres', genreRoutes);
router.use('/reviews', reviewRoutes);

// API root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Game DB API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      games: '/games',
      companies: '/companies',
      genres: '/genres',
      reviews: '/reviews',
      documentation: '/api-docs'
    }
  });
});

module.exports = router;
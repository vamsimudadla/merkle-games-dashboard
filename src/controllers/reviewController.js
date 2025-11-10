const { UserReview, User, Game, Genre } = require('../models');

const reviewController = {
  // Get all reviews
  async getAllReviews(req, res) {
    try {
      const { game_id, user_id, min_rating, max_rating } = req.query;
      const where = {};

      if (game_id) where.game_id = game_id;
      if (user_id) where.user_id = user_id;
      if (min_rating) where.rating_score = { ...where.rating_score, [Op.gte]: min_rating };
      if (max_rating) where.rating_score = { ...where.rating_score, [Op.lte]: max_rating };

      const reviews = await UserReview.findAll({
        where,
        include: [
          {
            model: Game,
            as: 'game',
            attributes: ['id', 'title'],
            include: [{ model: Genre, as: 'genre', attributes: ['id', 'genreName'] }]
          },
          { model: User, as: 'user', attributes: ['id', 'username'] }
        ],
        order: [['review_date', 'DESC']]
      });

      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },

  // Get review by ID
  async getReviewById(req, res) {
    try {
      const review = await UserReview.findByPk(req.params.id, {
        include: [
          { model: Game, as: 'game' },
          { model: User, as: 'user', attributes: { exclude: ['password'] } }
        ]
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      console.error('Error fetching review:', error);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  },

  // Create new review
  async createReview(req, res) {
    try {
      // Check if user already reviewed this game
      const existingReview = await UserReview.findOne({
        where: {
          user_id: req.user.id,
          game_id: req.body.game_id
        }
      });

      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this game' });
      }

      const review = await UserReview.create({
        ...req.body,
        user_id: req.user.id,
        review_date: new Date()
      });

      const createdReview = await UserReview.findByPk(review.id, {
        include: [
          { model: Game, as: 'game' },
          { model: User, as: 'user', attributes: { exclude: ['password'] } }
        ]
      });

      res.status(201).json(createdReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).json({ error: 'Failed to create review' });
    }
  },

  // Update review
  async updateReview(req, res) {
    try {
      const review = await UserReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Check if user owns this review
      if (review.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own reviews' });
      }

      await review.update({
        rating_score: req.body.rating_score,
        review_text: req.body.review_text
      });

      const updatedReview = await UserReview.findByPk(review.id, {
        include: [
          { model: Game, as: 'game' },
          { model: User, as: 'user', attributes: { exclude: ['password'] } }
        ]
      });

      res.json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(400).json({ error: 'Failed to update review' });
    }
  },

  // Delete review
  async deleteReview(req, res) {
    try {
      const review = await UserReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Check if user owns this review
      if (review.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own reviews' });
      }

      await review.destroy();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  },

  // Get user's reviews
  async getUserReviews(req, res) {
    try {
      const reviews = await UserReview.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: Game, as: 'game' }
        ],
        order: [['review_date', 'DESC']]
      });

      res.json(reviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
  }
};

module.exports = reviewController;
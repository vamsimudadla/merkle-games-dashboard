const { Op } = require('sequelize');

const reviewResolvers = {
  Query: {
    reviews: async (_, args, { db }) => {
      const { gameId, userId, minRating, maxRating } = args;
      const where = {};

      if (gameId) where.game_id = gameId;
      if (userId) where.user_id = userId;
      if (minRating) where.rating_score = { ...where.rating_score, [Op.gte]: minRating };
      if (maxRating) where.rating_score = { ...where.rating_score, [Op.lte]: maxRating };

      return await db.UserReview.findAll({
        where,
        order: [['review_date', 'DESC']]
      });
    },

    review: async (_, { id }, { db }) => {
      return await db.UserReview.findByPk(id);
    }
  },


  Review: {
    game: async (review, _, { db }) => {
      return await db.Game.findByPk(review.game_id);
    },
    user: async (review, _, { db }) => {
      return await db.User.findByPk(review.user_id, {
        attributes: { exclude: ['password'] }
      });
    }
  }
};

module.exports = reviewResolvers;
const { Op } = require('sequelize');

const gameResolvers = {
  Query: {
    games: async (_, args, { db }) => {
      const { page = 1, limit = 10, genreId, platform, search } = args;
      const offset = (page - 1) * limit;

      const where = {};
      if (genreId) where.genre_id = genreId;
      if (platform) where.platform = { [Op.iLike]: `%${platform}%` };
      if (search) where.title = { [Op.iLike]: `%${search}%` };

      const result = await db.Game.findAndCountAll({
        where,
        limit,
        offset,
        order: [['release_date', 'DESC']]
      });

      return {
        games: result.rows,
        total: result.count,
        page,
        totalPages: Math.ceil(result.count / limit)
      };
    },

    game: async (_, { id }, { db }) => {
      return await db.Game.findByPk(id);
    },

    gameStats: async (_, { id }, { db }) => {
      const game = await db.Game.findByPk(id, {
        include: [{
          model: db.UserReview,
          as: 'reviews',
          attributes: []
        }],
        attributes: [
          'id',
          'title',
          [db.sequelize.fn('AVG', db.sequelize.col('reviews.rating_score')), 'averageRating'],
          [db.sequelize.fn('COUNT', db.sequelize.col('reviews.id')), 'totalReviews']
        ],
        group: ['Game.id']
      });

      return game;
    }
  },

  Game: {
    genre: async (game, _, { db }) => {
      return await game.getGenre();
    },
    developer: async (game, _, { db }) => {
      return await game.getDeveloper();
    },
    publisher: async (game, _, { db }) => {
      return await game.getPublisher();
    },
    reviews: async (game, _, { db }) => {
      return await game.getReviews();
    },
    images: async (game, _, { db }) => {
      const imageRelations = await db.ImageRelation.findAll({
        where: {
          related_type: 'Game',
          related_id: game.id
        },
        include: [{ model: db.Image, as: 'image' }]
      });
      return imageRelations.map(rel => rel.image);
    },
    averageRating: async (game, _, { db }) => {
      const result = await db.UserReview.findOne({
        where: { game_id: game.id },
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating_score')), 'avg']],
        raw: true
      });
      return result && result.avg !== null ? parseFloat(result.avg) : null;
    },
    totalReviews: async (game, _, { db }) => {
      return await db.UserReview.count({
        where: { game_id: game.id }
      });
    }
  }
};

module.exports = gameResolvers;
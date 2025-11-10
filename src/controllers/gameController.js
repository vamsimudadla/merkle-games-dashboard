const { Game, Genre, Company, UserReview, User, Image, ImageRelation } = require('../models');
const { Op } = require('sequelize');

const gameController = {
  // Get all games
  async getAllGames(req, res) {
    try {
      const { page = 1, limit = 10, genre, platform, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (genre) where.genre_id = genre;
      if (platform) where.platform = { [Op.iLike]: `%${platform}%` };
      if (search) where.title = { [Op.iLike]: `%${search}%` };

      const games = await Game.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { model: Genre, as: 'genre' },
          { model: Company, as: 'developer' },
          { model: Company, as: 'publisher' }
        ],
        order: [['release_date', 'DESC']]
      });

      res.json({
        games: games.rows,
        total: games.count,
        page: parseInt(page),
        totalPages: Math.ceil(games.count / limit)
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Failed to fetch games' });
    }
  },

  // Get game by ID
  async getGameById(req, res) {
    try {
      const game = await Game.findByPk(req.params.id, {
        include: [
          { model: Genre, as: 'genre' },
          { model: Company, as: 'developer' },
          { model: Company, as: 'publisher' },
          {
            model: UserReview,
            as: 'reviews',
            include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
          }
        ]
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Get images for this game
      const images = await Image.findAll({
        include: [{
          model: ImageRelation,
          as: 'relations',
          where: {
            related_type: 'Game',
            related_id: game.id
          }
        }]
      });

      res.json({ ...game.toJSON(), images });
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  },

  // Create new game
  async createGame(req, res) {
    try {
      const game = await Game.create(req.body);
      const createdGame = await Game.findByPk(game.id, {
        include: [
          { model: Genre, as: 'genre' },
          { model: Company, as: 'developer' },
          { model: Company, as: 'publisher' }
        ]
      });
      res.status(201).json(createdGame);
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(400).json({ error: 'Failed to create game' });
    }
  },

  // Update game
  async updateGame(req, res) {
    try {
      const game = await Game.findByPk(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      await game.update(req.body);
      const updatedGame = await Game.findByPk(game.id, {
        include: [
          { model: Genre, as: 'genre' },
          { model: Company, as: 'developer' },
          { model: Company, as: 'publisher' }
        ]
      });
      res.json(updatedGame);
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(400).json({ error: 'Failed to update game' });
    }
  },

  // Delete game
  async deleteGame(req, res) {
    try {
      const game = await Game.findByPk(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      await game.destroy();
      res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ error: 'Failed to delete game' });
    }
  },

  // Get game statistics
  async getGameStats(req, res) {
    try {
      const game = await Game.findByPk(req.params.id, {
        include: [{
          model: UserReview,
          as: 'reviews',
          attributes: []
        }],
        attributes: [
          'id',
          'title',
          [Game.sequelize.fn('AVG', Game.sequelize.col('reviews.rating_score')), 'average_rating'],
          [Game.sequelize.fn('COUNT', Game.sequelize.col('reviews.id')), 'total_reviews']
        ],
        group: ['Game.id']
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game);
    } catch (error) {
      console.error('Error fetching game stats:', error);
      res.status(500).json({ error: 'Failed to fetch game statistics' });
    }
  }
};

module.exports = gameController;
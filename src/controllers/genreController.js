const { Genre, Game } = require('../models');

const genreController = {
  // Get all genres
  async getAllGenres(req, res) {
    try {
      const genres = await Genre.findAll({
        order: [['genreName', 'ASC']]
      });
      res.json(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'Failed to fetch genres' });
    }
  },

  // Get genre by ID with games
  async getGenreById(req, res) {
    try {
      const genre = await Genre.findByPk(req.params.id, {
        include: [{
          model: Game,
          as: 'games',
          limit: 20,
          order: [['releaseDate', 'DESC']]
        }]
      });

      if (!genre) {
        return res.status(404).json({ error: 'Genre not found' });
      }

      res.json(genre);
    } catch (error) {
      console.error('Error fetching genre:', error);
      res.status(500).json({ error: 'Failed to fetch genre' });
    }
  },

  // Create new genre
  async createGenre(req, res) {
    try {
      const genre = await Genre.create({
        genreName: req.body.genre_name || req.body.genreName
      });
      res.status(201).json(genre);
    } catch (error) {
      console.error('Error creating genre:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Genre already exists' });
      }
      res.status(400).json({ error: 'Failed to create genre' });
    }
  },

  // Update genre
  async updateGenre(req, res) {
    try {
      const genre = await Genre.findByPk(req.params.id);
      if (!genre) {
        return res.status(404).json({ error: 'Genre not found' });
      }

      await genre.update({
        genreName: req.body.genre_name || req.body.genreName
      });
      res.json(genre);
    } catch (error) {
      console.error('Error updating genre:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Genre name already exists' });
      }
      res.status(400).json({ error: 'Failed to update genre' });
    }
  },

  // Delete genre
  async deleteGenre(req, res) {
    try {
      const genre = await Genre.findByPk(req.params.id);
      if (!genre) {
        return res.status(404).json({ error: 'Genre not found' });
      }

      // Check if genre has associated games
      const gamesCount = await Game.count({ where: { genre_id: req.params.id } });
      if (gamesCount > 0) {
        return res.status(400).json({
          error: 'Cannot delete genre with associated games',
          gamesCount
        });
      }

      await genre.destroy();
      res.json({ message: 'Genre deleted successfully' });
    } catch (error) {
      console.error('Error deleting genre:', error);
      res.status(500).json({ error: 'Failed to delete genre' });
    }
  }
};

module.exports = genreController;
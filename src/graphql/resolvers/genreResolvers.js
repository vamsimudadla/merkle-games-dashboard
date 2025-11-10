const genreResolvers = {
  Query: {
    genres: async (_, __, { db }) => {
      return await db.Genre.findAll({
        order: [['genre_name', 'ASC']]
      });
    },

    genre: async (_, { id }, { db }) => {
      return await db.Genre.findByPk(id);
    }
  },


  Genre: {
    games: async (genre, _, { db }) => {
      return await db.Game.findAll({
        where: { genre_id: genre.id },
        limit: 20,
        order: [['release_date', 'DESC']]
      });
    }
  }
};

module.exports = genreResolvers;
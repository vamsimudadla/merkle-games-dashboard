const userResolvers = {
  Query: {
    users: async (_, __, { db }) => {
      return await db.User.findAll();
    },
    user: async (_, { id }, { db }) => {
      return await db.User.findByPk(id);
    }
  },

  User: {
    reviews: async (user, _, { db }) => {
      return await user.getReviews();
    }
  }
};

module.exports = userResolvers;
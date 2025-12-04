import { GraphQLContext } from '../../types';

const userResolvers = {
  Query: {
    users: async (_: any, __: any, { db }: GraphQLContext) => {
      return await db.User.findAll();
    },
    user: async (_: any, { id }: { id: string }, { db }: GraphQLContext) => {
      return await db.User.findByPk(id);
    }
  },

  User: {
    reviews: async (user: any, _: any, { db }: GraphQLContext) => {
      return await user.getReviews();
    }
  }
};

export default userResolvers;
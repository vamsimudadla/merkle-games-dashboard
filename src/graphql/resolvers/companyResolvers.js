const { Op } = require('sequelize');

const companyResolvers = {
  Query: {
    companies: async (_, args, { db }) => {
      const { type, country, search } = args;
      const where = {};

      if (type) where.companyType = type;
      if (country) where.country = country;
      if (search) where.name = { [Op.iLike]: `%${search}%` };

      return await db.Company.findAll({
        where,
        order: [['name', 'ASC']]
      });
    },

    company: async (_, { id }, { db }) => {
      return await db.Company.findByPk(id);
    }
  },


  Company: {
    developedGames: async (company, _, { db }) => {
      return await db.Game.findAll({
        where: { developer_id: company.id }
      });
    },
    publishedGames: async (company, _, { db }) => {
      return await db.Game.findAll({
        where: { publisher_id: company.id }
      });
    }
  }
};

module.exports = companyResolvers;
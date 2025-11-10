const imageResolvers = {
  Query: {
    images: async (_, args, { db }) => {
      const { relatedType, relatedId } = args;
      const where = {};

      if (relatedType && relatedId) {
        const relations = await db.ImageRelation.findAll({
          where: {
            related_type: relatedType,
            related_id: relatedId
          },
          include: [{ model: db.Image, as: 'image' }]
        });
        return relations.map(rel => rel.image);
      }

      return await db.Image.findAll();
    },

    image: async (_, { id }, { db }) => {
      return await db.Image.findByPk(id);
    }
  },


  Image: {
    relations: async (image, _, { db }) => {
      return await db.ImageRelation.findAll({
        where: { image_id: image.id }
      });
    }
  },

  ImageRelation: {
    image: async (relation, _, { db }) => {
      return await db.Image.findByPk(relation.image_id);
    }
  }
};

module.exports = imageResolvers;
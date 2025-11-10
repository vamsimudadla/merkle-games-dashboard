const gameResolvers = require('./gameResolvers');
const companyResolvers = require('./companyResolvers');
const genreResolvers = require('./genreResolvers');
const reviewResolvers = require('./reviewResolvers');
const userResolvers = require('./userResolvers');
const imageResolvers = require('./imageResolvers');

const resolvers = {
  Query: {
    ...gameResolvers.Query,
    ...companyResolvers.Query,
    ...genreResolvers.Query,
    ...reviewResolvers.Query,
    ...userResolvers.Query,
    ...imageResolvers.Query
  },
  Game: gameResolvers.Game,
  Company: companyResolvers.Company,
  Genre: genreResolvers.Genre,
  Review: reviewResolvers.Review,
  User: userResolvers.User,
  Image: imageResolvers.Image,
  ImageRelation: imageResolvers.ImageRelation
};

module.exports = resolvers;
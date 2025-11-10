const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Genre = require('./genre')(sequelize, DataTypes);
db.Company = require('./company')(sequelize, DataTypes);
db.Game = require('./game')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.UserReview = require('./userReview')(sequelize, DataTypes);
db.Image = require('./image')(sequelize, DataTypes);
db.ImageRelation = require('./imageRelation')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
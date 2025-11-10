module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'genre_id',
      references: {
        model: 'genres',
        key: 'id'
      }
    },
    platform: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'release_date'
    },
    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'developer_id',
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'publisher_id',
      references: {
        model: 'companies',
        key: 'id'
      }
    }
  }, {
    tableName: 'games',
    timestamps: true,
    underscored: true
  });

  Game.associate = function(models) {
    Game.belongsTo(models.Genre, {
      foreignKey: 'genre_id',
      as: 'genre'
    });
    Game.belongsTo(models.Company, {
      foreignKey: 'developer_id',
      as: 'developer'
    });
    Game.belongsTo(models.Company, {
      foreignKey: 'publisher_id',
      as: 'publisher'
    });
    Game.hasMany(models.UserReview, {
      foreignKey: 'game_id',
      as: 'reviews'
    });
  };

  return Game;
};
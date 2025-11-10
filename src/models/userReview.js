module.exports = (sequelize, DataTypes) => {
  const UserReview = sequelize.define('UserReview', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'game_id',
      references: {
        model: 'games',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ratingScore: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      field: 'rating_score',
      validate: {
        min: 0,
        max: 10
      }
    },
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_text'
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'review_date'
    }
  }, {
    tableName: 'user_reviews',
    timestamps: true,
    underscored: true
  });

  UserReview.associate = function(models) {
    UserReview.belongsTo(models.Game, {
      foreignKey: 'game_id',
      as: 'game'
    });
    UserReview.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserReview;
};
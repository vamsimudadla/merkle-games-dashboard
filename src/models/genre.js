module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    genreName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'genre_name'
    }
  }, {
    tableName: 'genres',
    timestamps: true,
    underscored: true
  });

  Genre.associate = function(models) {
    Genre.hasMany(models.Game, {
      foreignKey: 'genre_id',
      as: 'games'
    });
  };

  return Genre;
};
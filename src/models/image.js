module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'image_url'
    },
    imageType: {
      type: DataTypes.ENUM('Screenshot', 'Cover', 'Artwork'),
      allowNull: false,
      field: 'image_type'
    }
  }, {
    tableName: 'images',
    timestamps: true,
    underscored: true
  });

  Image.associate = function(models) {
    Image.hasMany(models.ImageRelation, {
      foreignKey: 'image_id',
      as: 'relations'
    });
  };

  return Image;
};
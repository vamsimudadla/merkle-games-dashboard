module.exports = (sequelize, DataTypes) => {
  const ImageRelation = sequelize.define('ImageRelation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'image_id',
      references: {
        model: 'images',
        key: 'id'
      }
    },
    relatedType: {
      type: DataTypes.ENUM('Game', 'Company', 'Genre', 'Rating', 'User'),
      allowNull: false,
      field: 'related_type'
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'related_id'
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_date'
    }
  }, {
    tableName: 'image_relations',
    timestamps: true,
    underscored: true
  });

  ImageRelation.associate = function(models) {
    ImageRelation.belongsTo(models.Image, {
      foreignKey: 'image_id',
      as: 'image'
    });
  };

  return ImageRelation;
};
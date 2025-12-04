import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ImageRelationAttributes } from '@/types';

export interface ImageRelationInstance extends Model<ImageRelationAttributes>, ImageRelationAttributes {
  associate?: (models: any) => void;
}

export interface ImageRelationModelType extends ModelStatic<ImageRelationInstance> {
  associate: (models: any) => void;
}

export const ImageRelationModel = (sequelize: Sequelize, dataTypes: typeof DataTypes): ImageRelationModelType => {
  const ImageRelation = sequelize.define<ImageRelationInstance>('ImageRelation', {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image_id: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'images',
        key: 'id'
      }
    },
    related_type: {
      type: dataTypes.ENUM('Game', 'Company', 'Genre', 'Rating', 'User'),
      allowNull: false
    },
    related_id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: dataTypes.DATE,
      allowNull: false,
      defaultValue: dataTypes.NOW
    }
  }, {
    tableName: 'image_relations',
    timestamps: true,
    underscored: true
  });

  (ImageRelation as ImageRelationModelType).associate = function(models: any) {
    ImageRelation.belongsTo(models.Image, {
      foreignKey: 'image_id',
      as: 'image'
    });
  };

  return ImageRelation as ImageRelationModelType;
};
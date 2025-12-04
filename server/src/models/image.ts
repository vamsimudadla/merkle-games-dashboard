import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ImageAttributes } from '@/types';

export interface ImageInstance extends Model<ImageAttributes>, ImageAttributes {
  associate?: (models: any) => void;
}

export interface ImageModelType extends ModelStatic<ImageInstance> {
  associate: (models: any) => void;
}

export const ImageModel = (sequelize: Sequelize, dataTypes: typeof DataTypes): ImageModelType => {
  const Image = sequelize.define<ImageInstance>('Image', {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: dataTypes.STRING(500),
      allowNull: false
    },
    image_type: {
      type: dataTypes.ENUM('Screenshot', 'Cover', 'Artwork'),
      allowNull: false
    }
  }, {
    tableName: 'images',
    timestamps: true,
    underscored: true
  });

  (Image as ImageModelType).associate = function(models: any) {
    Image.hasMany(models.ImageRelation, {
      foreignKey: 'image_id',
      as: 'relations'
    });
  };

  return Image as ImageModelType;
};
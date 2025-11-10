module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'founded_year'
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    companyType: {
      type: DataTypes.ENUM('Developer', 'Publisher'),
      allowNull: false,
      field: 'company_type'
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    underscored: true
  });

  Company.associate = function(models) {
    Company.hasMany(models.Game, {
      foreignKey: 'developer_id',
      as: 'developedGames'
    });
    Company.hasMany(models.Game, {
      foreignKey: 'publisher_id',
      as: 'publishedGames'
    });
  };

  return Company;
};
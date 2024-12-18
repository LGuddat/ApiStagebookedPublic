const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_testsite', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    subdomain: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    template: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_testsite',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_user_testsite",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
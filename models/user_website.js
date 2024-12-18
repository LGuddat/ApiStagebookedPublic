const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_website', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    subdomain: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    spotify_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facebook_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instagram_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    booking_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type : DataTypes.TEXT,
      allowNull: true
    }, 
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    has_description: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: 'user_website',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_user_website",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

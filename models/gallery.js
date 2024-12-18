const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "gallery",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      public_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "gallery",
      createdAt: "created_at",
      updatedAt: "updated_at",
      schema: "dbo",
      timestamps: true, // Adjust based on whether you want Sequelize to automatically handle timestamps
      indexes: [
        {
          name: "PK_gallery",
          unique: true,
          fields: [{ name: "Id" }],
        },
      ],
    }
  );
};

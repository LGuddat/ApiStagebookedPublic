const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_jobs', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    job_hvor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    job_dato: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    job_tid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    job_med: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    job_billet: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    job_title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    job_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    }, 
    website_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_jobs',
    schema: 'dbo',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    indexes: [
      {
        name: "PK__user_job__3213E83F79687193",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

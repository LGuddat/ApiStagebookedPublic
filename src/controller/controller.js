const initModels = require("../models/init-models");
const sequelize = require("../models/connect");

const models = initModels(sequelize);
module.exports = {
  models,
};


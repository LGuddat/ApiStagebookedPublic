const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");

dotenv.config();

// 1. Import sequelize connection and model initialization function
const sequelize = require("../models/connect"); // Adjust this path
const initModels = require("../models/init-models.js"); // Adjust this path

// 2. Initialize your models
const models = initModels(sequelize);

module.exports = router;

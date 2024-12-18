const express = require("express");
const router = express.Router();

//Controllers
const { updateDomain } = require("../controller/updateDomain.controller.js");

// 1. Import sequelize connection and model initialization function
const sequelize = require("../models/connect"); // Adjust this path
const initModels = require("../models/init-models.js"); // Adjust this path

// 2. Initialize your models
const models = initModels(sequelize);

router.post("/updateDomain", async (req, res) => {
  updateDomain(req, res, models);
});

router.post("/domainRequest", async (req, res) => {
  try {
    console.log("request body", req.body);
    const { domain, user_id, email } = await req.body;

    const response = await models.domainRequest.create({
      domain: domain,
      user_id: user_id,
      email: email,
    });

    console.log(response);

    if (!response) {
      return res.status(400).json({ message: "Domain request failed" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

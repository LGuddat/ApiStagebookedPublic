const express = require("express");
const router = express.Router();

// Controllers
const { addWebsite } = require("../controller/addWebsite.controller.js");
const editWebsite = require("../controller/editWebsite.controller.js");
const getUserWebsites = require("../controller/getUserWebsites.controller.js");
const deleteWebsite = require("../controller/deleteWebsite.controller.js");
const createDemoWebsite = require("../controller/createDemoWebsite.controller.js");
const updateWebsiteImage = require("../controller/updateWebsiteImage.controller.js");
const updateGalleryImages = require("../controller/updateGalleryImages.controller.js");
const updateSingleWebsiteAdmin = require("../controller/updateSingleWebsiteAdmin.controller.js");

// 1. Import sequelize connection and model initialization function
const sequelize = require("../models/connect"); // Adjust this path
const initModels = require("../models/init-models.js"); // Adjust this path

// 2. Initialize your models
const models = initModels(sequelize);

// droplet endpoints
router.post("/addWebsite", async (req, res) => {
  addWebsite(req, res, models);
});

router.put("/updateWebsite", async (req, res) => {
  editWebsite(req, res, models);
});

router.get("/updateSingelWebsiteAdmin/:websiteId", async (req, res) => {
  updateSingleWebsiteAdmin(req, res, models);
});

router.get("/getUserWebsites/:userId", async (req, res) => {
  getUserWebsites(req, res, models);
});

router.delete("/deleteWebsite", async (req, res) => {
  deleteWebsite(req, res, models);
});

router.post("/createDemowebsite", async (req, res) => {
  createDemoWebsite(req, res, models);
});

router.put("/updateWebsiteImage", async (req, res) => {
  updateWebsiteImage(req, res, models);
});

router.post("/updateGalleryImages", async (req, res) => {
  updateGalleryImages(req, res, models);
});

module.exports = router;

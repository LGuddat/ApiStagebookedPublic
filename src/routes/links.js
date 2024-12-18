const express = require("express");
const router = express.Router();

// Controllers

// 1. Import sequelize connection and model initialization function
const sequelize = require("../models/connect"); // Adjust this path
const initModels = require("../models/init-models"); // Adjust this path
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

// 2. Initialize your models
const models = initModels(sequelize);

router.get("/:id", async (req, res) => {
  try {
    // Use `await` to wait for the promise to resolve
    const userLink = await models.user_links.findOne({
      // Use an object for the `where` clause
      where: { link: req.params.id },
    });

    // Check if a URL was found
    if (userLink && userLink.forward_link) {
      res.status(200).json({ success: true, url: userLink.forward_link });
    } else {
      res.status(404).json({ message: "No URL found for the given ID." });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/addLink", async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { link, forward_link, user_id } = req.body;

    // Validate input fields as necessary
    if (!link) {
      return res.status(400).json({ message: "Link is required." });
    }

    // Use the create method to add a new link
    const newLink = await models.user_links.create({
      link,
      forward_link,
      user_id,
    });

    // Respond with the created link
    res.status(201).json({ message: "New link added successfully.", newLink });
  } catch (error) {
    console.error("Failed to add new link:", error.message);
    res
      .status(500)
      .json({ message: "Server error occurred while adding new link." });
  }
});

router.put("/editLink", ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { id, link, forward_link } = req.body; // Destructure necessary fields except user_id

    // First, find the link by ID
    const linkToUpdate = await models.user_links.findByPk(id);

    // Check if the link exists
    if (!linkToUpdate) {
      return res.status(404).json({ message: "Link not found." });
    }

    // Retrieve user ID from the session
    const userId = req.session.userId; // This is how you get the user ID from the session
    console.log(userId)

    // Check if the user_id of the link matches the user_id from the authenticated session
    if (linkToUpdate.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this link." });
    }

    // Update the link with new data
    const updatedLink = await linkToUpdate.update({
      link, // Assumes new data for 'link' is always provided when updating
      forward_link, // Assumes new data for 'forward_link' is provided if applicable
      user_id: userId, // Update the user_id if necessary, or just reaffirm it
    });

    // Respond with the updated link
    res
      .status(200)
      .json({ message: "Link updated successfully.", updatedLink });
  } catch (error) {
    console.error("Failed to update link:", error.message);
    res
      .status(500)
      .json({ message: "Server error occurred while updating the link." });
  }
});

router.delete("/deleteLink/:id", ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { id } = req.params; // Get the link ID from URL parameter

    // First, find the link by ID
    const linkToDelete = await models.user_links.findByPk(id);

    // Check if the link exists
    if (!linkToDelete) {
      return res.status(404).json({ message: "Link not found." });
    }

    // Retrieve user ID from the session
    const userId = req.session.userId; // This is how you get the user ID from the session

    // Check if the user_id of the link matches the user_id from the authenticated session
    if (linkToDelete.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this link." });
    }

    // Delete the link
    await linkToDelete.destroy();

    // Respond with success message
    res.status(200).json({ message: "Link deleted successfully." });
  } catch (error) {
    console.error("Failed to delete link:", error.message);
    res.status(500).json({ message: "Server error occurred while deleting the link." });
  }
});

router.get("/getAllLinks")

module.exports = router;

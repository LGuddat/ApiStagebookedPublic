async function updateGalleryImages(req, res, models) {
  try {
    if (!req.body.imageIds) {
      return res.status(400).json({ message: "Image IDs are required" });
    }
    if (!req.body.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let imageIds = req.body.imageIds; // Assuming req.body.imageId is an array
    let userId = req.body.userId;

    // Find the user's subdomain
    const userWebsite = await models.user_website.findOne({
      where: { user_id: userId },
    });

    if (!userWebsite && userId !== "test_user_id") {
      return res.status(404).json({ message: "Website not found in database" });
    }

    // Add the subdomain to the req.body for editWebsite
    req.body.subdomain = userWebsite.subdomain;

    // Change "is_favorite" to false for all of the user's images
    await models.gallery.update(
      { is_favorite: false },
      { where: { user_id: userId } }
    );

    // Update specific images as favorite based on imageIds
    if (imageIds.length > 0) {
      for (let i = 0; i < imageIds.length; i++) {
        await models.gallery.update(
          { is_favorite: true },
          { where: { user_id: userId, Id: imageIds[i] } }
        );
      }
    }

    // Now, call editWebsite whether or not imageIds are present
    const editResult = await editWebsite(req, models);

    // Respond based on the operations performed
    return res.status(200).json({
      message:
        imageIds.length > 0
          ? "Gallery images updated and website edited"
          : "All gallery images set to not favorite",
      editResult: editResult,
    });
  } catch (error) {
    console.error(error.message);
    // Check if the response was already sent in editWebsite through some other mechanism, though it shouldn't be as per the new design
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
}

const dotenv = require("dotenv");
dotenv.config();

const envurl = process.env.ENV_URL;
const axios = require("axios");

async function editWebsite(req, models) {
  try {
    if (req.body.subdomain == "" || !req.body.subdomain) {
      throw new Error("Subdomain is required");
    }
    let reqSubdomain = req.body.subdomain.toLowerCase();

    const userWebsite = await models.user_website.findOne({
      where: { user_id: req.body.userId },
    });

    if (!userWebsite) {
      throw new Error("Website not found in database");
    }

    const oldSubdomain = userWebsite.subdomain;
    let isSubdomainUpdated = false;

    // Check if subdomain is being updated and is not a duplicate
    if (reqSubdomain && reqSubdomain !== oldSubdomain) {
      const response = await axios.get(
        `https://api.${envurl}/checkDuplicateSubdomain/${reqSubdomain}`,
        {
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 409,
          headers: {
            "secret-key": process.env.SECRET_KEY,
          },
        }
      );

      if (response.status === 409) {
        throw new Error("Subdomain is a duplicate");
      }

      // Update subdomain in the database
      userWebsite.subdomain = reqSubdomain;
      isSubdomainUpdated = true;
    }

    // This should be awaited to ensure the query completes before checking the result
    const jobs = await models.user_jobs.findOne({
      where: { user_id: req.body.userId },
    });

    let hasJob;
    if (jobs) {
      hasJob = true;
    } else {
      hasJob = false;
    }

    const gallery = await models.gallery.findAll({
      where: { user_id: req.body.userId, is_favorite: true },
    });

    let hasGallery = gallery.length > 0;

    await axios.put(
      `https://api.${envurl}/updateWebsite`,
      {
        id: userWebsite.id,
        oldSubdomain: oldSubdomain,
        website_id: userWebsite.id,
        newSubdomain: userWebsite.subdomain,
        title: userWebsite.title,
        imageUrl: userWebsite.image_url,
        user_id: userWebsite.user_id,
        template: userWebsite.template_id,
        spotify_url: userWebsite.spotify_url,
        facebook_url: userWebsite.facebook_url,
        instagram_url: userWebsite.instagram_url,
        ticketmaster_url: userWebsite.ticketmaster_url,
        booking_url: userWebsite.booking_url,
        contact_email: userWebsite.contact_email,
        phone_number: userWebsite.phone_number,
        description: userWebsite.description,
        has_description: userWebsite.has_description,
        hasJob: hasJob,
        hasGallery: hasGallery,
        gallery_images: gallery ? gallery : null,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.SECRET_KEY,
        },
      }
    );

    await userWebsite.save();

    // Return indicating success and any relevant data
    return {
      success: true,
      message: "Website updated successfully",
      isSubdomainUpdated: isSubdomainUpdated,
      updatedSubdomain: reqSubdomain,
    };
  } catch (error) {
    // Instead of sending a response, throw an error
    throw new Error(error.message);
  }
}

module.exports = updateGalleryImages;

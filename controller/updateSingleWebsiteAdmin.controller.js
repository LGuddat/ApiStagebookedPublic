const dotenv = require("dotenv");
dotenv.config();
const envurl = process.env.ENV_URL;
const axios = require("axios");

async function updateSingleWebsite(req, res, models) {
  const websiteId = req.params.websiteId; // Assuming the ID is passed as a URL parameter

  try {
    const userWebsite = await models.user_website.findByPk(websiteId);

    if (!userWebsite) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Check if there are any jobs associated with the user
    const jobs = await models.user_jobs.findOne({
      where: { user_id: userWebsite.user_id },
    });

    const hasJob = !!jobs; // Simplified boolean check

    // Find all favorite galleries for this user
    const gallery = await models.gallery.findAll({
      where: { user_id: userWebsite.user_id, is_favorite: true },
    });

    const hasGallery = gallery.length > 0;

    console.log(userWebsite);
    // Optional: Update external system via API
    await axios.put(
      `https://api.${envurl}/updateWebsite`,
      {
        title: userWebsite.title,
        oldSubdomain: userWebsite.subdomain,
        newSubdomain: userWebsite.subdomain,
        user_id: userWebsite.user_id,
        instagram_url: userWebsite.instagram_url,
        facebook_url: userWebsite.facebook_url,
        imageUrl: userWebsite.image_url,
        contact_email,
        description,
        phone_number,
        spotify_url,
        hasGallery,
        has_description,
        gallery_images,
        website_id,
        newSubdomain: userWebsite.subdomain, // Using the current subdomain since there's no change logic here
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
        gallery_images: gallery.map((g) => g.url),
        website_id: userWebsite.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.SECRET_KEY,
        },
      },
    );

    res
      .status(200)
      .json({ message: "Website updated successfully", website: userWebsite });
  } catch (error) {
    console.error("Error updating website:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
}

module.exports = updateSingleWebsite;
